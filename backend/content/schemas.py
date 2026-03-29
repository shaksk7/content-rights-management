from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ContentCreate(BaseModel):
    title: str
    content_type: str
    genre: Optional[str] = None
    duration_minutes: Optional[int] = None
    description: Optional[str] = None

class ContentUpdate(BaseModel):
    title: Optional[str] = None
    content_type: Optional[str] = None
    genre: Optional[str] = None
    duration_minutes: Optional[int] = None
    description: Optional[str] = None

class ContentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    content_type: str
    genre: Optional[str]
    duration_minutes: Optional[int]
    description: Optional[str]
    created_at: datetime