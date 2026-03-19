# 个人博客系统

极简的前后端分离博客系统，支持 Markdown 写作、文章管理、搜索、访问统计等功能。

## 技术栈

**后端**: FastAPI + SQLAlchemy + SQLite + JWT
**前端**: React 18 + Vite 5 + TailwindCSS 3 + React Router 6

## 快速开始

### 后端
```bash
cd backend
pip install -r requirements.txt
python main.py
```
运行在 http://localhost:8000

### 前端
```bash
cd frontend
npm install
npm run dev
```
运行在 http://localhost:3000

### 默认账号
- 用户名: `admin`
- 密码: `admin123`

## 主要功能

- ✅ Markdown 文章编辑与渲染
- ✅ 文章列表与详情（支持分页）
- ✅ 时间线归档 + 标签系统
- ✅ 全文搜索（标题/摘要/内容）
- ✅ 访问统计与数据展示
- ✅ 用户认证与权限管理
- ✅ 个人信息管理（头像/简介）
- ✅ 赛博朋克风格动效背景
- ✅ 响应式设计

## 访问地址

- 前端页面: http://localhost:3000
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs
- 管理后台: http://localhost:3000/admin

## 文档

详细的开发指南、API 文档、使用说明请查看 [CLAUDE.md](./CLAUDE.md)

## 更新日志

### v1.1.0 (2026-03-17)
- ✅ 新增分页功能（前端10条/页，后台20条/页）
- ✅ 优化 API 返回格式
- ✅ 添加测试文章生成脚本

### v1.0.0 (2026-03-13)
- ✅ 基础博客系统上线
- ✅ 完整的前后端功能实现
