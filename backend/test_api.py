"""
blog_wx Backend API Tests
测试覆盖: 文章管理、用户认证、个人信息、访问统计
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models.database import Base, get_db
from main import app

# ─── 使用内存数据库做隔离测试 ───────────────────────────────────────────────
TEST_DATABASE_URL = "sqlite:///./test_blog.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    """每个测试前重建数据库，测试后删除"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)

# ─── 辅助函数 ──────────────────────────────────────────────────────────────

def register_and_login(username="testuser", password="testpass123"):
    """注册并登录，返回 Bearer token 字符串"""
    client.post("/api/auth/register", json={"username": username, "password": password})
    resp = client.post("/api/auth/login", json={"username": username, "password": password})
    assert resp.status_code == 200, f"登录失败: {resp.text}"
    return resp.json()["access_token"]


def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


def create_article(token, title="测试文章", slug="test-article", tags=None):
    payload = {
        "title": title,
        "slug": slug,
        "summary": "摘要",
        "content": "# 内容\n正文",
        "tags": tags or ["Python", "FastAPI"],
    }
    resp = client.post("/api/article", json=payload, headers=auth_headers(token))
    assert resp.status_code == 200, f"创建文章失败: {resp.text}"
    return resp.json()


# ══════════════════════════════════════════════════════════════════════════════
# 1. 根路径
# ══════════════════════════════════════════════════════════════════════════════

class TestRoot:
    def test_root(self):
        resp = client.get("/")
        assert resp.status_code == 200
        assert resp.json() == {"message": "Blog API is running"}


# ══════════════════════════════════════════════════════════════════════════════
# 2. 认证接口
# ══════════════════════════════════════════════════════════════════════════════

class TestAuth:
    def test_register_success(self):
        resp = client.post("/api/auth/register", json={"username": "alice", "password": "pass123"})
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_register_duplicate_username(self):
        client.post("/api/auth/register", json={"username": "alice", "password": "pass123"})
        resp = client.post("/api/auth/register", json={"username": "alice", "password": "another"})
        assert resp.status_code == 400
        assert "already registered" in resp.json()["detail"]

    def test_login_success(self):
        client.post("/api/auth/register", json={"username": "bob", "password": "mypass"})
        resp = client.post("/api/auth/login", json={"username": "bob", "password": "mypass"})
        assert resp.status_code == 200
        assert "access_token" in resp.json()

    def test_login_wrong_password(self):
        client.post("/api/auth/register", json={"username": "bob", "password": "mypass"})
        resp = client.post("/api/auth/login", json={"username": "bob", "password": "wrongpass"})
        assert resp.status_code == 401

    def test_login_nonexistent_user(self):
        resp = client.post("/api/auth/login", json={"username": "ghost", "password": "123"})
        assert resp.status_code == 401


# ══════════════════════════════════════════════════════════════════════════════
# 3. 文章接口 - 公开
# ══════════════════════════════════════════════════════════════════════════════

class TestArticlesPublic:
    def test_get_articles_empty(self):
        resp = client.get("/api/articles")
        assert resp.status_code == 200
        assert resp.json() == []

    def test_get_articles_returns_list(self):
        token = register_and_login()
        create_article(token, "第一篇文章", "first-article")
        create_article(token, "第二篇文章", "second-article")
        resp = client.get("/api/articles")
        assert resp.status_code == 200
        assert len(resp.json()) == 2

    def test_get_articles_search_by_title(self):
        token = register_and_login()
        create_article(token, "Python 教程", "python-tutorial")
        create_article(token, "FastAPI 入门", "fastapi-intro")
        resp = client.get("/api/articles?search=Python")
        assert resp.status_code == 200
        results = resp.json()
        assert len(results) == 1
        assert results[0]["title"] == "Python 教程"

    def test_get_articles_search_no_result(self):
        token = register_and_login()
        create_article(token, "Python 教程", "python-tut")
        resp = client.get("/api/articles?search=JavaScript")
        assert resp.status_code == 200
        assert resp.json() == []

    def test_get_article_detail(self):
        token = register_and_login()
        article = create_article(token)
        resp = client.get(f"/api/article/{article['id']}")
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == article["id"]
        assert data["title"] == article["title"]
        assert "content" in data
        assert "tags" in data

    def test_get_article_increments_views(self):
        token = register_and_login()
        article = create_article(token)
        aid = article["id"]
        # 访问 3 次
        for _ in range(3):
            client.get(f"/api/article/{aid}")
        # 通过统计接口验证 views 累加
        stats = client.get("/api/stats").json()
        assert stats["total_views"] == 3

    def test_get_article_not_found(self):
        resp = client.get("/api/article/99999")
        assert resp.status_code == 404

    def test_get_archive(self):
        token = register_and_login()
        create_article(token, slug="arch-1")
        resp = client.get("/api/archive")
        assert resp.status_code == 200
        # 返回 dict，年份为 key
        data = resp.json()
        assert isinstance(data, dict)
        assert len(data) >= 1

    def test_get_tags_empty(self):
        resp = client.get("/api/tags")
        assert resp.status_code == 200
        assert resp.json() == []

    def test_get_tags_after_article_creation(self):
        token = register_and_login()
        create_article(token, tags=["Python", "后端"])
        resp = client.get("/api/tags")
        assert resp.status_code == 200
        names = [t["name"] for t in resp.json()]
        assert "Python" in names
        assert "后端" in names


# ══════════════════════════════════════════════════════════════════════════════
# 4. 文章接口 - 需要认证
# ══════════════════════════════════════════════════════════════════════════════

class TestArticlesAuth:
    def test_create_article_requires_auth(self):
        payload = {"title": "无认证", "slug": "no-auth", "summary": "x", "content": "x", "tags": []}
        resp = client.post("/api/article", json=payload)
        assert resp.status_code == 403  # HTTPBearer 返回 403

    def test_create_article_success(self):
        token = register_and_login()
        article = create_article(token, "新建文章", "new-article", tags=["tag1"])
        assert article["title"] == "新建文章"
        assert "tag1" in article["tags"]

    def test_create_article_duplicate_slug(self):
        token = register_and_login()
        create_article(token, slug="dup-slug")
        payload = {"title": "重复", "slug": "dup-slug", "summary": "", "content": "x", "tags": []}
        resp = client.post("/api/article", json=payload, headers=auth_headers(token))
        # Bug 已修复：现在返回 400 而非 500
        assert resp.status_code == 400
        assert "Slug already exists" in resp.json()["detail"]

    def test_update_article_success(self):
        token = register_and_login()
        article = create_article(token, "原始标题", "orig-slug")
        aid = article["id"]
        update = {"title": "更新标题", "slug": "updated-slug", "summary": "新摘要", "content": "新内容", "tags": ["新标签"]}
        resp = client.put(f"/api/article/{aid}", json=update, headers=auth_headers(token))
        assert resp.status_code == 200
        data = resp.json()
        assert data["title"] == "更新标题"
        assert "新标签" in data["tags"]

    def test_update_article_slug_conflict(self):
        token = register_and_login()
        create_article(token, "文章A", "slug-a")
        b = create_article(token, "文章B", "slug-b")
        update = {"title": "文章B", "slug": "slug-a", "summary": "", "content": "x", "tags": []}
        resp = client.put(f"/api/article/{b['id']}", json=update, headers=auth_headers(token))
        assert resp.status_code == 400
        assert "Slug already exists" in resp.json()["detail"]

    def test_update_article_not_found(self):
        token = register_and_login()
        update = {"title": "x", "slug": "x", "summary": "", "content": "x", "tags": []}
        resp = client.put("/api/article/99999", json=update, headers=auth_headers(token))
        assert resp.status_code == 404

    def test_delete_article_success(self):
        token = register_and_login()
        article = create_article(token)
        resp = client.delete(f"/api/article/{article['id']}", headers=auth_headers(token))
        assert resp.status_code == 200
        # 确认已删除
        get_resp = client.get(f"/api/article/{article['id']}")
        assert get_resp.status_code == 404

    def test_delete_article_not_found(self):
        token = register_and_login()
        resp = client.delete("/api/article/99999", headers=auth_headers(token))
        assert resp.status_code == 404

    def test_delete_article_requires_auth(self):
        token = register_and_login()
        article = create_article(token)
        resp = client.delete(f"/api/article/{article['id']}")
        assert resp.status_code == 403


# ══════════════════════════════════════════════════════════════════════════════
# 5. 统计接口
# ══════════════════════════════════════════════════════════════════════════════

class TestStatistics:
    def test_get_stats_empty(self):
        resp = client.get("/api/stats")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_articles"] == 0
        assert data["total_views"] == 0
        assert data["popular_articles"] == []

    def test_get_stats_with_articles(self):
        token = register_and_login()
        create_article(token, slug="s1")
        create_article(token, slug="s2")
        resp = client.get("/api/stats")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_articles"] == 2

    def test_admin_stats_requires_auth(self):
        resp = client.get("/api/stats/admin")
        assert resp.status_code == 403

    def test_admin_stats_success(self):
        token = register_and_login()
        create_article(token, slug="as1")
        resp = client.get("/api/stats/admin", headers=auth_headers(token))
        assert resp.status_code == 200
        data = resp.json()
        assert "articles" in data
        assert data["total_articles"] == 1


# ══════════════════════════════════════════════════════════════════════════════
# 6. 个人信息接口
# ══════════════════════════════════════════════════════════════════════════════

class TestProfile:
    def test_get_profile_creates_default(self):
        resp = client.get("/api/profile")
        assert resp.status_code == 200
        data = resp.json()
        assert data["name"] == "Star King"
        assert "bio" in data

    def test_update_profile_requires_auth(self):
        resp = client.put("/api/profile", json={"name": "Hacker"})
        assert resp.status_code == 403

    def test_update_profile_success(self):
        token = register_and_login()
        resp = client.put("/api/profile", json={"name": "新名字", "bio": "新简介"}, headers=auth_headers(token))
        assert resp.status_code == 200
        data = resp.json()
        assert data["name"] == "新名字"
        assert data["bio"] == "新简介"

    def test_update_profile_about_field(self):
        """测试 about 字段更新（profile_schemas 中存在，database model 中也存在）"""
        token = register_and_login()
        resp = client.put(
            "/api/profile",
            json={"about": "我的关于页面内容"},
            headers=auth_headers(token)
        )
        assert resp.status_code == 200
        # BUG 检查: profile.py 的 update_profile 未处理 about 字段
        # 如果有 bug, about 仍然会是 None
        data = resp.json()
        assert data.get("about") == "我的关于页面内容", (
            "BUG: profile router 的 update_profile 未处理 about 字段更新！"
        )
