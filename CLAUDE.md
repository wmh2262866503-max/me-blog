# CLAUDE.md - 项目开发指南

## 项目概述

这是一个极简的前后端分离个人博客系统，支持 Markdown 写作、文章管理、搜索、访问统计等功能。

## 技术栈

### 后端
- **框架**: FastAPI 0.95+
- **ORM**: SQLAlchemy 1.4+
- **数据库**: SQLite
- **认证**: JWT (python-jose)
- **密码加密**: Bcrypt + Passlib
- **Python 版本**: 3.7+

### 前端
- **框架**: React 18
- **构建工具**: Vite 5
- **样式**: TailwindCSS 3
- **路由**: React Router 6
- **HTTP 客户端**: Axios
- **Markdown 渲染**: React Markdown

## 目录结构

```
blog_wx/
├── backend/                    # 后端目录
│   ├── models/                 # 数据模型
│   │   ├── __init__.py
│   │   ├── database.py         # 数据库模型定义
│   │   ├── schemas.py          # Pydantic 模型
│   │   ├── auth_schemas.py     # 认证相关模型
│   │   └── profile_schemas.py  # 个人信息模型
│   ├── routers/                # API 路由
│   │   ├── __init__.py
│   │   ├── articles.py         # 文章相关 API
│   │   ├── auth.py             # 认证 API
│   │   ├── profile.py          # 个人信息 API
│   │   └── statistics.py       # 统计 API
│   ├── services/               # 业务逻辑
│   │   └── auth.py             # 认证服务
│   ├── main.py                 # 应用入口
│   ├── requirements.txt        # Python 依赖
│   └── blog.db                 # SQLite 数据库文件
│
├── frontend/                   # 前端目录
│   ├── src/
│   │   ├── api/                # API 调用
│   │   │   └── index.js        # API 封装
│   │   ├── components/         # 组件
│   │   │   ├── Layout.jsx      # 布局组件
│   │   │   ├── Sidebar.jsx     # 侧边栏
│   │   │   ├── ArticleCard.jsx # 文章卡片
│   │   │   ├── Timeline.jsx    # 时间线
│   │   │   ├── SearchBar.jsx   # 搜索栏
│   │   │   └── ProtectedRoute.jsx # 路由守卫
│   │   ├── pages/              # 页面
│   │   │   ├── Home.jsx        # 首页
│   │   │   ├── Article.jsx     # 文章详情
│   │   │   ├── Archive.jsx     # 归档
│   │   │   ├── Tags.jsx        # 标签
│   │   │   ├── About.jsx       # 关于
│   │   │   ├── Login.jsx       # 登录
│   │   │   ├── Admin.jsx       # 管理后台
│   │   │   ├── ArticleEditor.jsx # 文章编辑器
│   │   │   └── ProfileSettings.jsx # 个人设置
│   │   ├── styles/
│   │   │   └── index.css       # 全局样式
│   │   └── main.jsx            # 应用入口
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md                   # 项目说明

```

## 数据库结构

### articles 表
```sql
CREATE TABLE articles (
    id INTEGER PRIMARY KEY,
    title VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status INTEGER DEFAULT 1,
    views INTEGER DEFAULT 0
);
```

### tags 表
```sql
CREATE TABLE tags (
    id INTEGER PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL
);
```

### article_tags 表（关联表）
```sql
CREATE TABLE article_tags (
    article_id INTEGER,
    tag_id INTEGER,
    FOREIGN KEY (article_id) REFERENCES articles(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);
```

### users 表
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL
);
```

### profile 表
```sql
CREATE TABLE profile (
    id INTEGER PRIMARY KEY,
    name VARCHAR DEFAULT 'Star King',
    bio VARCHAR DEFAULT '开发者 / 写作者',
    avatar TEXT
);
```

## API 接口

### 公开接口
- `GET /api/articles` - 获取文章列表
  - 参数: `?page=1&page_size=10&search=关键词`
  - 返回: 分页数据（items, total, page, page_size, total_pages）
- `GET /api/article/{id}` - 获取文章详情（自动统计访问量）
- `GET /api/archive` - 获取归档（按年份分组）
- `GET /api/tags` - 获取所有标签
- `GET /api/stats` - 获取统计信息（总文章数、总访问量、热门文章）
- `GET /api/profile` - 获取个人信息

### 认证接口
- `POST /api/auth/register` - 注册新用户
- `POST /api/auth/login` - 用户登录（返回 JWT Token）

### 需要认证的接口
- `POST /api/article` - 创建文章
- `PUT /api/article/{id}` - 更新文章
- `DELETE /api/article/{id}` - 删除文章
- `PUT /api/profile` - 更新个人信息（头像、名字、简介）
- `GET /api/stats/admin` - 获取管理员统计（所有文章的详细访问数据）

## 代码规范

### 后端规范

1. **文件命名**: 小写字母 + 下划线（如 `auth_schemas.py`）
2. **类命名**: 大驼峰（如 `ArticleCreate`）
3. **函数命名**: 小写字母 + 下划线（如 `get_articles`）
4. **路由前缀**: 统一使用 `/api`
5. **认证**: 使用 JWT Bearer Token
6. **错误处理**: 使用 HTTPException

### 前端规范

1. **文件命名**: 大驼峰（如 `ArticleCard.jsx`）
2. **组件命名**: 大驼峰（如 `export default function ArticleCard`）
3. **函数命名**: 小驼峰（如 `handleSubmit`）
4. **状态命名**: 小驼峰（如 `isLoading`）
5. **样式**: 使用 TailwindCSS 类名
6. **路由保护**: 使用 ProtectedRoute 组件

## 启动命令

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

## 环境配置

### 后端环境变量（可选）
- `SECRET_KEY`: JWT 密钥（默认在 `services/auth.py` 中）
- `ALGORITHM`: JWT 算法（默认 HS256）
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token 过期时间（默认 30 分钟）

### 前端代理配置
在 `vite.config.js` 中配置了 API 代理：
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true
  }
}
```

## 核心功能

### 1. 文章管理
- 创建、编辑、删除文章
- Markdown 编辑器（支持完整 Markdown 语法）
- 标签管理（自动创建，无需预先定义）
- 文章列表展示（前端10条/页，后台20条/页）
- Slug 自动生成 URL

### 2. 搜索功能
- 全文搜索（标题、摘要、内容）
- 隐藏式搜索栏（右上角按钮，点击展开）
- 实时搜索结果
- 支持 API 搜索: `GET /api/articles?search=关键词`

### 3. 访问统计
- 自动统计文章访问量（每次访问详情页 +1）
- 管理后台可视化展示（统计卡片 + 访问量列）
- 总文章数、总访问量、热门文章排行
- 公开统计接口: `GET /api/stats`
- 管理员统计接口: `GET /api/stats/admin`（需登录）

### 4. 用户认证
- JWT Token 认证（有效期 30 分钟）
- 路由守卫保护管理页面
- Token 存储在 localStorage
- 密码使用 Bcrypt 加密

### 5. 个人信息管理
- 头像上传（Base64 存储，限制 2MB）
- 名字、简介修改
- 仅管理员可修改
- 前端展示在侧边栏

### 6. 分页功能
- 前端首页: 每页 10 篇文章
- 管理后台: 每页 20 篇文章
- 智能页码显示（首页、末页、当前页及相邻页）
- API 支持: `?page=1&page_size=10`

### 7. 视觉特效
- 赛博朋克风格动效背景
- 动态网格 + 霓虹波浪线条
- 粒子系统（50个浮动粒子）
- 鼠标交互效果（吸引、光晕、涟漪）
- Canvas API 实现，性能优化

## 使用指南

### 访问地址
- **前端页面**: http://localhost:3000
- **后端 API**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs
- **登录页面**: http://localhost:3000/login
- **管理后台**: http://localhost:3000/admin

### 使用流程

#### 1. 登录管理后台
访问 http://localhost:3000/login，使用测试账号登录。

#### 2. 管理文章
登录后会自动跳转到管理后台，可以：
- 点击"新建文章"创建文章
- 点击"编辑"修改现有文章
- 点击"删除"删除文章
- 查看文章访问统计

#### 3. 编辑文章
在文章编辑器中：
- **标题**: 文章标题
- **Slug**: URL 路径（如 `my-first-post`，必须唯一）
- **摘要**: 文章简介
- **标签**: 用逗号分隔（如 `React, JavaScript, 前端`）
- **内容**: 使用 Markdown 格式编写

#### 4. 查看文章
访问前端页面查看发布的文章：
- 首页：最新文章列表（分页展示）
- 归档：按年份时间线展示
- 标签：所有标签列表
- 文章详情：点击文章标题查看（自动统计访问量）

#### 5. 搜索文章
- 点击右上角搜索按钮（🔍图标）
- 输入关键词（如 "React"）
- 按回车或点击"搜索"按钮
- 查看搜索结果

#### 6. 添加文章的三种方式

**方式一：通过管理后台（推荐）**
1. 登录后台
2. 点击"新建文章"
3. 填写信息并保存

**方式二：使用 API**
```bash
curl -X POST http://localhost:8000/api/article \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "我的第一篇文章",
    "slug": "my-first-post",
    "summary": "这是摘要",
    "content": "# 标题\n\n这是内容",
    "tags": ["技术", "博客"]
  }'
```

**方式三：批量创建测试文章**
```bash
cd backend
python create_test_articles.py
```

## 数据库操作

### 查看数据库
```bash
cd backend
python -c "import sqlite3; conn = sqlite3.connect('blog.db'); cursor = conn.cursor(); cursor.execute('SELECT * FROM articles'); print(cursor.fetchall())"
```

### 添加 views 字段（如果需要）
```bash
cd backend
python -c "import sqlite3; conn = sqlite3.connect('blog.db'); cursor = conn.cursor(); cursor.execute('ALTER TABLE articles ADD COLUMN views INTEGER DEFAULT 0'); conn.commit()"
```

### 更新数据库结构
```bash
cd backend
python -c "from models.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

## 测试账号

- 用户名: `admin`
- 密码: `admin123`

## 常见问题

### 1. 端口被占用
```bash
# Windows
netstat -ano | findstr :8000
taskkill /F /PID <进程ID>

# 或使用 bash
netstat -ano | grep :8000
taskkill //F //PID <进程ID>
```

### 2. 数据库字段缺失
如果遇到 "no such column" 错误，运行数据库更新命令。

### 3. Token 过期
Token 有效期 30 分钟，过期后需要重新登录。

### 4. CORS 错误
后端已配置允许所有来源，如有问题检查 `main.py` 中的 CORS 配置。

## 开发注意事项

1. **不要提交敏感信息**: `.gitignore` 已配置忽略 `blog.db`、`node_modules` 等
2. **修改数据库结构**: 需要手动更新或删除 `blog.db` 重新生成
3. **Token 存储**: 前端使用 localStorage 存储 Token
4. **图片上传**: 头像使用 Base64 存储，建议限制大小（当前 2MB）
5. **生产环境**: 需要修改 `SECRET_KEY`、配置 HTTPS、使用生产数据库

## 性能优化建议

1. **数据库索引**: 已在 `id`、`slug` 字段添加索引
2. **图片优化**: 考虑使用 CDN 或对象存储
3. **缓存**: 可添加 Redis 缓存热门文章
4. **分页**: ✅ 已实现（前端10条/页，后台20条/页）
5. **懒加载**: 图片和组件可使用懒加载

## API 使用示例

### 搜索文章
```bash
# 搜索包含 "React" 的文章
curl "http://localhost:8000/api/articles?search=React"
```

### 分页获取文章
```bash
# 获取第2页，每页10条
curl "http://localhost:8000/api/articles?page=2&page_size=10"
```

### 查看统计
```bash
# 公开统计
curl http://localhost:8000/api/stats

# 管理员统计（需要 token）
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/stats/admin
```

### 访问文章（自动统计）
```bash
# 访问文章 ID 1，views 自动 +1
curl http://localhost:8000/api/article/1
```

## 扩展功能建议

- [ ] 评论系统
- [ ] RSS 订阅
- [ ] 文章分类
- [ ] 草稿功能
- [ ] 定时发布
- [ ] 文章导出
- [ ] 数据备份
- [ ] 访问日志
- [ ] SEO 优化
- [ ] 暗黑模式

## 部署建议

### 前端
- Vercel
- Netlify
- Cloudflare Pages

### 后端
- Railway
- Render
- Heroku
- 自建服务器

### 数据库
- 开发环境: SQLite
- 生产环境: PostgreSQL / MySQL

## 更新日志

### v1.1.0 (2026-03-17)
- ✅ 新增前端首页分页功能（每页10条）
- ✅ 新增管理后台分页功能（每页20条）
- ✅ 优化 API 返回格式，支持分页信息
- ✅ 添加测试文章生成脚本
- ✅ 改进错误处理和调试信息

### v1.0.0 (2026-03-13)
- ✅ 基础博客功能
- ✅ 用户认证系统
- ✅ 文章管理（创建、编辑、删除）
- ✅ 标签系统
- ✅ 时间线归档
- ✅ 搜索功能（全文搜索）
- ✅ 访问统计（自动统计 + 可视化展示）
- ✅ 个人信息管理
- ✅ 头像上传（Base64 存储）
- ✅ 赛博朋克风格动效背景

## 联系方式

- 作者: Star King
- 项目地址: D:\project\blog_wx
- 数据库位置: D:\project\blog_wx\backend\blog.db
