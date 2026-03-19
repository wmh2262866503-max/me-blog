import React, { useEffect, useState } from 'react';
import { getArchive } from '../api';
import Timeline from '../components/Timeline';

export default function Archive() {
  const [archive, setArchive] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArchive()
      .then(res => {
        setArchive(res.data);
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">文章归档</h1>
        <p className="text-gray-500 mt-2">按时间线浏览所有文章</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <Timeline archive={archive} />
      </div>
    </div>
  );
}
