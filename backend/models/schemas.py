from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class Tag(TagBase):
    id: int

    class Config:
        from_attributes = True

class ArticleBase(BaseModel):
    title: str
    slug: str
    summary: Optional[str] = None
    content: str

class ArticleCreate(ArticleBase):
    tags: List[str] = []

class ArticleList(BaseModel):
    id: int
    title: str
    date: str
    summary: Optional[str] = None

    class Config:
        from_attributes = True

class ArticleDetail(BaseModel):
    id: int
    title: str
    content: str
    date: str
    tags: List[str]

    class Config:
        from_attributes = True

class ArchiveItem(BaseModel):
    title: str
    date: str
    id: int

class ArchiveResponse(BaseModel):
    pass
