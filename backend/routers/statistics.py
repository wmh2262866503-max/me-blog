from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.database import get_db, Article
from routers.auth import get_current_user

router = APIRouter(prefix="/api/stats", tags=["statistics"])

@router.get("")
def get_statistics(db: Session = Depends(get_db)):
    total_articles = db.query(func.count(Article.id)).filter(Article.status == 1).scalar()
    total_views = db.query(func.sum(Article.views)).scalar() or 0

    # 获取最受欢迎的文章（前5篇）
    popular_articles = db.query(Article).filter(Article.status == 1).order_by(Article.views.desc()).limit(5).all()

    return {
        "total_articles": total_articles,
        "total_views": total_views,
        "popular_articles": [
            {
                "id": article.id,
                "title": article.title,
                "views": article.views
            }
            for article in popular_articles
        ]
    }

@router.get("/admin")
def get_admin_statistics(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    total_articles = db.query(func.count(Article.id)).filter(Article.status == 1).scalar()
    total_views = db.query(func.sum(Article.views)).scalar() or 0

    # 获取所有文章的访问量
    articles_with_views = db.query(Article).filter(Article.status == 1).order_by(Article.views.desc()).all()

    return {
        "total_articles": total_articles,
        "total_views": total_views,
        "articles": [
            {
                "id": article.id,
                "title": article.title,
                "views": article.views,
                "created_at": article.created_at.strftime("%Y-%m-%d")
            }
            for article in articles_with_views
        ]
    }
