from pydantic import BaseModel
from typing import Optional

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    about: Optional[str] = None

class ProfileResponse(BaseModel):
    name: str
    bio: str
    avatar: Optional[str] = None
    about: Optional[str] = None
