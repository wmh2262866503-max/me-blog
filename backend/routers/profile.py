from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db, Profile
from models.profile_schemas import ProfileUpdate, ProfileResponse
from routers.auth import get_current_user

router = APIRouter(prefix="/api/profile", tags=["profile"])

@router.get("", response_model=ProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        profile = Profile(name="Star King", bio="开发者 / 写作者")
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("", response_model=ProfileResponse)
def update_profile(
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    profile = db.query(Profile).first()
    if not profile:
        profile = Profile()
        db.add(profile)

    if profile_data.name is not None:
        profile.name = profile_data.name
    if profile_data.bio is not None:
        profile.bio = profile_data.bio
    if profile_data.avatar is not None:
        profile.avatar = profile_data.avatar
    if profile_data.about is not None:
        profile.about = profile_data.about

    db.commit()
    db.refresh(profile)
    return profile
