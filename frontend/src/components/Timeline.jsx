import React from 'react';
import { Link } from 'react-router-dom';

export default function Timeline({ archive }) {
  return (
    <div className="space-y-8">
      {Object.keys(archive).sort((a, b) => b - a).map(year => (
        <div key={year}>
          <h2 className="text-2xl font-bold mb-4">{year}</h2>
          <div className="border-l-2 border-gray-300 pl-6 space-y-4">
            {archive[year].map(article => (
              <div key={article.id} className="relative">
                <div className="absolute -left-8 w-4 h-4 bg-blue-500 rounded-full"></div>
                <Link to={`/article/${article.id}`} className="hover:text-blue-600">
                  <span className="text-gray-600 mr-3">{article.date}</span>
                  <span className="font-medium">{article.title}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
