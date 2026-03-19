import React, { useEffect, useState } from 'react';
import { getTags } from '../api';

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTags()
      .then(res => {
        setTags(res.data);
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
        <h1 className="text-3xl font-bold text-gray-800">标签</h1>
        <p className="text-gray-500 mt-2">共 {tags.length} 个标签</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-wrap gap-4">
          {tags.length === 0 ? (
            <div className="text-gray-500 w-full text-center py-10">暂无标签</div>
          ) : (
            tags.map(tag => (
              <div
                key={tag.id}
                className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 px-6 py-3 rounded-lg text-base font-medium hover:shadow-md transition cursor-pointer"
              >
                # {tag.name}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
