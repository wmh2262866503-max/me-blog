import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Article from './pages/Article';
import Archive from './pages/Archive';
import Tags from './pages/Tags';
import About from './pages/About';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ArticleEditor from './pages/ArticleEditor';
import ProfileSettings from './pages/ProfileSettings';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/admin/new" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
        <Route path="/admin/edit/:id" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/article/:id" element={<Layout><Article /></Layout>} />
        <Route path="/archive" element={<Layout><Archive /></Layout>} />
        <Route path="/tags" element={<Layout><Tags /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
