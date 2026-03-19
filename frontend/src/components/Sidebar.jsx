import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile } from '../api';

export default function Sidebar() {
  const [profile, setProfile] = useState({
    name: 'Star King',
    bio: '开发者 / 写作者',
    avatar: null
  });

  useEffect(() => {
    getProfile()
      .then(res => {
        setProfile(res.data);
      })
      .catch(err => {
        console.error('加载个人信息失败', err);
      });
  }, []);

  return (
    <aside className="w-64 bg-gray-800 fixed left-0 top-0 h-screen flex flex-col items-center pt-12 shadow-lg">
      <div className="text-center mb-8">
        <div className="w-32 h-32 mx-auto mb-4">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover border-4 border-gray-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-gray-700">
              {profile.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold mb-1 text-white">{profile.name}</h2>
        <p className="text-gray-400 text-sm">{profile.bio}</p>
      </div>

      <nav className="w-full px-8 flex-1">
        <ul className="space-y-3">
          <li>
            <Link
              to="/"
              className="block py-3 px-6 rounded-lg hover:bg-gray-700 transition text-white text-center text-lg font-medium"
            >
              首页
            </Link>
          </li>
          <li>
            <Link
              to="/archive"
              className="block py-3 px-6 rounded-lg hover:bg-gray-700 transition text-white text-center text-lg font-medium"
            >
              归档
            </Link>
          </li>
          <li>
            <Link
              to="/tags"
              className="block py-3 px-6 rounded-lg hover:bg-gray-700 transition text-white text-center text-lg font-medium"
            >
              标签
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="block py-3 px-6 rounded-lg hover:bg-gray-700 transition text-white text-center text-lg font-medium"
            >
              关于
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mb-8 text-center text-gray-500 text-sm">
        <p>© 2026 Star King</p>
      </div>
    </aside>
  );
}
