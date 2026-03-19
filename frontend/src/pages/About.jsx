import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { getProfile } from '../api';

export default function About() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  const defaultContent = `## 👋 你好

这是一个极简的个人博客系统，专注于写作和分享。

## 🛠️ 技术栈

- 前端：React + Vite + TailwindCSS
- 后端：FastAPI + SQLAlchemy
- 数据库：SQLite

## ✨ 特性

- 支持 Markdown 写作
- 标签分类
- 时间线归档
- 响应式设计
- 简洁优雅的界面`;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">关于我</h1>
        <p className="text-gray-500 mt-2">了解更多关于我的信息</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="prose max-w-none markdown-body">
          <ReactMarkdown>{profile?.about || defaultContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
