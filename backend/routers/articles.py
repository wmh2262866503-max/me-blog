from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from models.database import get_db, Article, Tag
from models.schemas import ArticleList, ArticleDetail, ArticleCreate, ArchiveItem
from routers.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api", tags=["articles"])

@router.get("/articles")
def get_articles(
    search: Optional[str] = Query(None, description="搜索关键词"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(10, ge=1, le=100, description="每页数量"),
    db: Session = Depends(get_db)
):
    query = db.query(Article).filter(Article.status == 1)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Article.title.like(search_pattern)) |
            (Article.summary.like(search_pattern)) |
            (Article.content.like(search_pattern))
        )

    # 获取总数
    total = query.count()

    # 分页查询
    articles = query.order_by(Article.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    return {
        "items": [
            {
                "id": article.id,
                "title": article.title,
                "date": article.created_at.strftime("%Y-%m-%d"),
                "summary": article.summary
            }
            for article in articles
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }

@router.get("/article/{article_id}", response_model=ArticleDetail)
def get_article(article_id: int, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    # 增加访问量
    article.views += 1
    db.commit()

    return ArticleDetail(
        id=article.id,
        title=article.title,
        content=article.content,
        date=article.created_at.strftime("%Y-%m-%d"),
        tags=[tag.name for tag in article.tags]
    )

@router.get("/archive")
def get_archive(db: Session = Depends(get_db)):
    articles = db.query(Article).filter(Article.status == 1).order_by(Article.created_at.desc()).all()

    archive = {}
    for article in articles:
        year = str(article.created_at.year)
        if year not in archive:
            archive[year] = []
        archive[year].append({
            "id": article.id,
            "title": article.title,
            "date": article.created_at.strftime("%m-%d")
        })

    return archive

@router.get("/tags")
def get_tags(db: Session = Depends(get_db)):
    tags = db.query(Tag).all()
    return [{"id": tag.id, "name": tag.name} for tag in tags]

@router.post("/article", response_model=ArticleDetail)
def create_article(article: ArticleCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_article = Article(
        title=article.title,
        slug=article.slug,
        summary=article.summary,
        content=article.content
    )

    for tag_name in article.tags:
        tag = db.query(Tag).filter(Tag.name == tag_name).first()
        if not tag:
            tag = Tag(name=tag_name)
            db.add(tag)
        db_article.tags.append(tag)

    db.add(db_article)
    try:
        db.commit()
        db.refresh(db_article)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Slug already exists")

    return ArticleDetail(
        id=db_article.id,
        title=db_article.title,
        content=db_article.content,
        date=db_article.created_at.strftime("%Y-%m-%d"),
        tags=[tag.name for tag in db_article.tags]
    )

@router.put("/article/{article_id}", response_model=ArticleDetail)
def update_article(article_id: int, article: ArticleCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")

    # 检查 slug 是否与其他文章冲突
    if article.slug != db_article.slug:
        existing = db.query(Article).filter(Article.slug == article.slug, Article.id != article_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Slug already exists")
        db_article.slug = article.slug

    db_article.title = article.title
    db_article.summary = article.summary
    db_article.content = article.content
    db_article.updated_at = datetime.utcnow()

    db_article.tags.clear()
    for tag_name in article.tags:
        tag = db.query(Tag).filter(Tag.name == tag_name).first()
        if not tag:
            tag = Tag(name=tag_name)
            db.add(tag)
        db_article.tags.append(tag)

    db.commit()
    db.refresh(db_article)

    return ArticleDetail(
        id=db_article.id,
        title=db_article.title,
        content=db_article.content,
        date=db_article.created_at.strftime("%Y-%m-%d"),
        tags=[tag.name for tag in db_article.tags]
    )

@router.delete("/article/{article_id}")
def delete_article(article_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")

    db.delete(db_article)
    db.commit()
    return {"message": "Article deleted successfully"}
