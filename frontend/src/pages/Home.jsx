import React, { useEffect, useState } from 'react';
import { getArticles } from '../api';
import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    loadArticles();
  }, [currentPage]);

  const loadArticles = (search = '', page = currentPage) => {
    setLoading(true);
    getArticles(search, page, pageSize)
      .then(res => {
        setArticles(res.data.items);
        setTotal(res.data.total);
        setTotalPages(res.data.total_pages);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    loadArticles(term, 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div>
      <SearchBar onSearch={handleSearch} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {searchTerm ? `搜索结果: "${searchTerm}"` : '最新文章'}
        </h1>
        <p className="text-gray-500 mt-2">
          {searchTerm ? `找到 ${total} 篇文章` : '分享技术与思考'}
        </p>
      </div>

      <div>
        {articles.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {searchTerm ? '没有找到相关文章' : '暂无文章'}
          </div>
        ) : (
          <>
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}

            {/* 分页组件 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 mb-8">
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
                    // 显示逻辑：首页、末页、当前页及其前后各一页
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
                  第 {currentPage} / {totalPages} 页
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
