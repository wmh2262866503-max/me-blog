import sqlite3
from datetime import datetime, timedelta
import random

# 测试文章数据
test_articles = [
    {
        "title": "Python异步编程完全指南",
        "slug": "python-async-guide",
        "summary": "深入理解Python的异步编程模型，从asyncio到实战应用",
        "content": """# Python异步编程完全指南

## 什么是异步编程

异步编程是一种编程范式，允许程序在等待某些操作完成时继续执行其他任务。

## asyncio基础

```python
import asyncio

async def main():
    print('Hello')
    await asyncio.sleep(1)
    print('World')

asyncio.run(main())
```

## 实战应用

在Web开发中，异步编程可以显著提升性能。
""",
        "tags": ["Python", "异步编程", "后端"]
    },
    {
        "title": "React Hooks最佳实践",
        "slug": "react-hooks-best-practices",
        "summary": "掌握React Hooks的使用技巧，写出更优雅的组件代码",
        "content": """# React Hooks最佳实践

## useState的正确使用

```jsx
const [count, setCount] = useState(0);

// 使用函数式更新
setCount(prev => prev + 1);
```

## useEffect的依赖管理

正确管理依赖数组，避免不必要的重渲染。

## 自定义Hooks

封装可复用的逻辑，提高代码复用性。
""",
        "tags": ["React", "前端", "JavaScript"]
    },
    {
        "title": "Docker容器化部署实战",
        "slug": "docker-deployment-guide",
        "summary": "从零开始学习Docker，实现应用的容器化部署",
        "content": """# Docker容器化部署实战

## Docker基础概念

- 镜像（Image）
- 容器（Container）
- 仓库（Registry）

## Dockerfile编写

```dockerfile
FROM python:3.9
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
```

## Docker Compose

使用docker-compose管理多容器应用。
""",
        "tags": ["Docker", "DevOps", "部署"]
    },
    {
        "title": "数据库索引优化技巧",
        "slug": "database-index-optimization",
        "summary": "深入理解数据库索引原理，掌握查询优化方法",
        "content": """# 数据库索引优化技巧

## 索引的工作原理

B+树索引是最常用的索引结构。

## 何时使用索引

- 频繁查询的字段
- WHERE子句中的字段
- JOIN操作的关联字段

## 索引优化策略

```sql
CREATE INDEX idx_user_email ON users(email);
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
```

避免索引失效的常见陷阱。
""",
        "tags": ["数据库", "SQL", "性能优化"]
    },
    {
        "title": "Git工作流最佳实践",
        "slug": "git-workflow-best-practices",
        "summary": "掌握Git分支管理和团队协作的最佳实践",
        "content": """# Git工作流最佳实践

## Git Flow模型

- master：生产环境
- develop：开发环境
- feature：功能分支
- hotfix：紧急修复

## 提交规范

```bash
feat: 添加用户登录功能
fix: 修复登录页面样式问题
docs: 更新README文档
```

## 代码审查流程

使用Pull Request进行代码审查。
""",
        "tags": ["Git", "版本控制", "团队协作"]
    },
    {
        "title": "RESTful API设计原则",
        "slug": "restful-api-design-principles",
        "summary": "学习RESTful API的设计规范和最佳实践",
        "content": """# RESTful API设计原则

## REST基本概念

- 资源（Resource）
- 表现层（Representation）
- 状态转移（State Transfer）

## HTTP方法使用

- GET：获取资源
- POST：创建资源
- PUT：更新资源
- DELETE：删除资源

## URL设计规范

```
GET    /api/articles
POST   /api/articles
GET    /api/articles/:id
PUT    /api/articles/:id
DELETE /api/articles/:id
```

## 状态码使用

正确使用HTTP状态码表达API响应状态。
""",
        "tags": ["API", "后端", "架构设计"]
    },
    {
        "title": "CSS Grid布局完全指南",
        "slug": "css-grid-layout-guide",
        "summary": "掌握CSS Grid布局系统，轻松实现复杂页面布局",
        "content": """# CSS Grid布局完全指南

## Grid基础

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

## 网格线命名

使用命名网格线提高代码可读性。

## 响应式布局

```css
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}
```

## 实战案例

实现常见的页面布局模式。
""",
        "tags": ["CSS", "前端", "布局"]
    },
    {
        "title": "微服务架构设计模式",
        "slug": "microservices-architecture-patterns",
        "summary": "了解微服务架构的核心概念和常见设计模式",
        "content": """# 微服务架构设计模式

## 微服务的优势

- 独立部署
- 技术栈灵活
- 易于扩展

## 服务拆分原则

按业务能力拆分服务。

## 常见设计模式

- API Gateway
- Service Discovery
- Circuit Breaker
- Event Sourcing

## 挑战与解决方案

分布式事务、服务间通信、数据一致性。
""",
        "tags": ["微服务", "架构设计", "后端"]
    },
    {
        "title": "TypeScript高级类型技巧",
        "slug": "typescript-advanced-types",
        "summary": "深入学习TypeScript的高级类型系统和实用技巧",
        "content": """# TypeScript高级类型技巧

## 泛型的使用

```typescript
function identity<T>(arg: T): T {
  return arg;
}
```

## 条件类型

```typescript
type IsString<T> = T extends string ? true : false;
```

## 映射类型

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

## 实用工具类型

Partial、Required、Pick、Omit等。
""",
        "tags": ["TypeScript", "前端", "类型系统"]
    },
    {
        "title": "Redis缓存策略与实践",
        "slug": "redis-caching-strategies",
        "summary": "学习Redis的使用场景和缓存策略，提升应用性能",
        "content": """# Redis缓存策略与实践

## Redis数据结构

- String
- Hash
- List
- Set
- Sorted Set

## 缓存策略

```python
# 缓存穿透解决方案
def get_user(user_id):
    cache_key = f"user:{user_id}"
    user = redis.get(cache_key)
    if user is None:
        user = db.query(user_id)
        redis.setex(cache_key, 3600, user)
    return user
```

## 缓存更新策略

- Cache Aside
- Read Through
- Write Through
- Write Behind

## 实战场景

会话存储、排行榜、消息队列。
""",
        "tags": ["Redis", "缓存", "性能优化"]
    }
]

def create_test_articles():
    conn = sqlite3.connect('blog.db')
    cursor = conn.cursor()

    # 获取或创建标签
    tag_ids = {}
    for article in test_articles:
        for tag_name in article['tags']:
            if tag_name not in tag_ids:
                cursor.execute("SELECT id FROM tags WHERE name = ?", (tag_name,))
                result = cursor.fetchone()
                if result:
                    tag_ids[tag_name] = result[0]
                else:
                    cursor.execute("INSERT INTO tags (name) VALUES (?)", (tag_name,))
                    tag_ids[tag_name] = cursor.lastrowid

    # 创建文章
    base_date = datetime.now()
    for i, article in enumerate(test_articles):
        # 每篇文章间隔几天
        created_at = base_date - timedelta(days=i * 2, hours=random.randint(0, 23))

        cursor.execute("""
            INSERT INTO articles (title, slug, summary, content, created_at, updated_at, status, views)
            VALUES (?, ?, ?, ?, ?, ?, 1, ?)
        """, (
            article['title'],
            article['slug'],
            article['summary'],
            article['content'],
            created_at,
            created_at,
            random.randint(10, 500)  # 随机访问量
        ))

        article_id = cursor.lastrowid

        # 关联标签
        for tag_name in article['tags']:
            cursor.execute("""
                INSERT INTO article_tags (article_id, tag_id)
                VALUES (?, ?)
            """, (article_id, tag_ids[tag_name]))

    conn.commit()
    conn.close()
    print(f"Successfully created {len(test_articles)} test articles!")

if __name__ == "__main__":
    create_test_articles()
