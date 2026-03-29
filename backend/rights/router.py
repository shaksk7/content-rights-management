from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
from auth.models import User
import redis
from database import get_db
from redis_client import get_redis
from auth.router import get_current_user
from rights.models import Rights
from rights.schemas import RightsCreate, RightsResponse, AvailabilityCheck
from rights.utils import check_availability, get_conflicts

router = APIRouter(prefix="/api/rights", tags=["Rights"])

@router.post("", response_model=RightsResponse)
def create_rights(
    data: RightsCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rights = Rights(**data.model_dump())
    db.add(rights)
    db.commit()
    db.refresh(rights)
    return rights

@router.get("", response_model=List[RightsResponse])
def list_rights(
    page: int = 1,
    limit: int = 10,
    territory: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Rights)
    if territory:
        query = query.filter(Rights.territory == territory)
    offset = (page - 1) * limit
    return query.offset(offset).limit(limit).all()

@router.post("/check-availability")
def check_rights_availability(
    data: AvailabilityCheck,
    db: Session = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis),
    current_user: User = Depends(get_current_user)

):
    # Check Redis cache first
    cache_key = f"availability:{data.content_id}:{data.territory}:{data.platform}:{data.check_date}"
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    available = check_availability(
        db, data.content_id, data.territory,
        data.platform, data.check_date
    )
    result = {
        "content_id": data.content_id,
        "territory": data.territory,
        "platform": data.platform,
        "check_date": str(data.check_date),
        "available": available,
        "cached": False
    }

    # Cache result for 5 minutes
    redis_client.setex(cache_key, 300, json.dumps(result))
    result["cached"] = False
    return result

@router.get("/conflicts/list")
def list_conflicts(
    content_id: int,
    territory: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conflicts = get_conflicts(db, content_id, territory)
    return {"conflicts": conflicts, "total": len(conflicts)}

@router.get("/{rights_id}", response_model=RightsResponse)
def get_rights(
    rights_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rights = db.query(Rights).filter(Rights.id == rights_id).first()
    if not rights:
        raise HTTPException(status_code=404, detail="Rights not found")
    return rights