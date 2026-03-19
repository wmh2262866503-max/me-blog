import React from 'react';
import { Link } from 'react-router-dom';

export default function ArticleCard({ article }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 mb-4 border border-gray-100">
      <Link to={`/article/${article.id}`}>
        <h2 className="text-2xl font-bold mb-3 hover:text-blue-600 transition">
          {article.title}
        </h2>
      </Link>

      {article.summary && (
        <p className="text-gray-600 mb-4 leading-relaxed">
          {article.summary}
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{article.date}</span>
        <Link
          to={`/article/${article.id}`}
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          阅读全文 →
        </Link>
      </div>
    </div>
  );
}
