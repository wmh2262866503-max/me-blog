import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link to="/" className="inline-flex items-center px-1 pt-1 text-gray-900 font-medium">
              首页
            </Link>
            <Link to="/archive" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
              归档
            </Link>
            <Link to="/tags" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
              标签
            </Link>
            <Link to="/about" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
              关于
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
