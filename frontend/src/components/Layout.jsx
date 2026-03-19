import React from 'react';
import Sidebar from './Sidebar';
import CyberBackground from './CyberBackground';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <CyberBackground />
      <Sidebar />
      <main className="ml-64 p-8 relative" style={{ zIndex: 10 }}>
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
