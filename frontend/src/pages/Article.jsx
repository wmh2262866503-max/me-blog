import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticle } from '../api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticle(id)
      .then(res => {
        setArticle(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">文章不存在</p>
        <Link to="/" className="text-blue-500 hover:underline">返回首页</Link>
      </div>
    );
  }

  return (
    <article className="bg-white rounded-lg shadow-sm p-8">
      <header className="mb-8 pb-6 border-b">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">{article.title}</h1>
        <div className="flex items-center gap-4 text-gray-500 text-sm">
          <span>📅 {article.date}</span>
          {article.tags && article.tags.length > 0 && (
            <div className="flex gap-2">
              {article.tags.map(tag => (
                <span key={tag} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="prose prose-lg max-w-none markdown-body prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-img:rounded-lg prose-img:shadow-md prose-table:border prose-th:bg-gray-50 prose-td:border prose-th:border">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {article.content}
        </ReactMarkdown>
      </div>

      <footer className="mt-12 pt-6 border-t">
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          ← 返回首页
        </Link>
      </footer>
    </article>
  );
}
