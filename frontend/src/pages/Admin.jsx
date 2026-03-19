import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getArticles, deleteArticle, getAdminStatistics } from '../api';
import AdminBackground from '../components/AdminBackground';

export default function Admin() {
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      getArticles('', currentPage, pageSize),
      getAdminStatistics()
    ])
      .then(([articlesRes, statsRes]) => {
        console.log('Articles response:', articlesRes.data);
        console.log('Stats response:', statsRes.data);

        // 处理新的分页格式
        const articlesList = articlesRes.data.items || articlesRes.data;
        console.log('Processed articles:', articlesList);

        setArticles(articlesList);
        setTotal(articlesRes.data.total);
        setTotalPages(articlesRes.data.total_pages);
        setStats(statsRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        console.error('Error response:', err.response);
        console.error('Error message:', err.message);

        let errorMsg = '未知错误';
        if (err.response) {
          errorMsg = `状态码 ${err.response.status}: ${JSON.stringify(err.response.data)}`;
        } else if (err.message) {
          errorMsg = err.message;
        }

        alert('加载数据失败: ' + errorMsg);
        setLoading(false);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除这篇文章吗？')) return;

    try {
      await deleteArticle(id);
      loadData();
    } catch (err) {
      alert('删除失败');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="text-center py-10">加载中...</div>;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <AdminBackground />
      <div className="max-w-6xl mx-auto p-8 relative" style={{ zIndex: 10 }}>
        <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">文章管理</h1>
        <div className="flex gap-4">
          <Link
            to="/admin/profile"
            className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition"
          >
            个人设置
          </Link>
          <Link
            to="/admin/new"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            新建文章
          </Link>
          <button
            onClick={handleLogout}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
          >
            退出登录
          </button>
        </div>
      </div>

      {/* 统计信息 */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold">{stats.total_articles}</div>
            <div className="text-blue-100 mt-1">总文章数</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold">{stats.total_views}</div>
            <div className="text-purple-100 mt-1">总访问量</div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        {articles.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            暂无文章数据
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">标题</th>
                  <th className="px-6 py-3 text-left text-gray-700">日期</th>
                  <th className="px-6 py-3 text-left text-gray-700">访问量</th>
                  <th className="px-6 py-3 text-right text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(article => {
                  const articleStats = stats?.articles?.find(a => a.id === article.id);
                  return (
                    <tr key={article.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{article.title}</td>
                      <td className="px-6 py-4 text-gray-600">{article.date}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {articleStats?.views || 0} 次
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/edit/${article.id}`}
                          className="text-blue-500 hover:underline mr-4"
                        >
                          编辑
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-500 hover:underline"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* 分页组件 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 p-6 border-t">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
                  }`}
                >
                  上一页
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2 py-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
                  }`}
                >
                  下一页
                </button>

                <span className="ml-4 text-gray-600">
                  第 {currentPage} / {totalPages} 页，共 {total} 篇文章
                </span>
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </div>
  );
}
