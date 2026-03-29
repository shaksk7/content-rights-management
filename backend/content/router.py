from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from starlette.status import HTTP_404_NOT_FOUND
from database import get_db
from auth.router import get_current_user
from auth.models import User
from content.models import Content
from content.schemas import ContentCreate, ContentUpdate, ContentResponse

router = APIRouter(prefix="/api/content", tags=["Content"])

@router.post("", response_model=ContentResponse)
def create_content(data: ContentCreate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    content = Content(**data.model_dump())
    db.add(content)
    db.commit()
    db.refresh(content)
    return content

@router.get("",response_model=List[ContentResponse],)
def list_content(
    page: int = 1,
    limit: int = 10,
    content_type: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Content)
    if content_type:
        query = query.filter(Content.title == content_type)
    
    offset = (page -1) * limit
    return query.offset(offset).limit(limit).all()

@router.get("/{content_id}",response_model=ContentResponse)
def get_content(content_id:int ,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404,detail="Content Not Found")
    
    return content

@router.put("/{content_id}", response_model=ContentResponse)
def update_content(
    content_id: int,
    data: ContentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(content, key, value)
    db.commit()
    db.refresh(content)
    return content

@router.delete("/{content_id}")
def delete_content(content_id: int,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    db.delete(content)
    db.commit()
    return {"message": "Content deleted successfully"}
