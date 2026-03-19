import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { createArticle, updateArticle, getArticle } from '../api';
import AdminBackground from '../components/AdminBackground';

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    tags: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getArticle(id)
        .then(res => {
          setFormData({
            title: res.data.title,
            slug: id,
            summary: '',
            content: res.data.content,
            tags: res.data.tags.join(', ')
          });
        })
        .catch(err => {
          setError('加载文章失败');
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      if (id) {
        await updateArticle(id, data);
      } else {
        await createArticle(data);
      }

      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.detail || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      <AdminBackground />
      <div className="max-w-7xl mx-auto relative" style={{ zIndex: 10 }}>
        <h1 className="text-3xl font-bold mb-6">
          {id ? '编辑文章' : '新建文章'}
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">标题</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Slug (URL)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">摘要</label>
            <input
              type="text"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">标签 (用逗号分隔)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="例如: React, JavaScript, 前端"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">内容 (Markdown)</label>
            <div className="grid grid-cols-2 gap-4">
              {/* 左侧：编辑区 */}
              <div>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="# 开始写作...&#10;&#10;支持 Markdown 语法"
                  className="w-full h-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none bg-white"
                  style={{ height: '600px' }}
                  required
                />
              </div>

              {/* 右侧：预览区 */}
              <div className="bg-white border rounded p-6 overflow-auto" style={{ height: '600px' }}>
                <h3 className="text-sm font-semibold text-gray-500 mb-4 pb-2 border-b">预览</h3>
                <div className="prose prose-sm max-w-none markdown-body prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
                  {formData.content ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                    >
                      {formData.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-gray-400 italic">在左侧输入 Markdown 内容，这里会实时预览...</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
            >
              {loading ? '保存中...' : '保存'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
