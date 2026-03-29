from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date, datetime

class RightsCreate(BaseModel):
    content_id: int
    licensee: str
    territory: str
    platform: str
    start_date: date
    end_date: date
    is_exclusive: bool = False

class RightsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    content_id: int
    licensee: str
    territory: str
    platform: str
    start_date: date
    end_date: date
    is_exclusive: bool
    created_at: datetime

class AvailabilityCheck(BaseModel):
    content_id: int
    territory: str
    platform: str
    check_date: date