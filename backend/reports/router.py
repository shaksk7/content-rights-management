from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from auth.models import User
from auth.router import get_current_user
from database import get_db
from rights.models import Rights

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/expiring")
def expiring_rights(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    future = today + timedelta(days=days)
    rights = db.query(Rights).filter(
        Rights.end_date >= today,
        Rights.end_date <= future
    ).all()
    return {
        "expiring_within_days": days,
        "total": len(rights),
        "rights": [
            {
                "id": r.id,
                "content_id": r.content_id,
                "licensee": r.licensee,
                "territory": r.territory,
                "end_date": str(r.end_date)
            }
            for r in rights
        ]
    }

@router.get("/by-territory")
def rights_by_territory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = db.query(
        Rights.territory,
        func.count(Rights.id).label("total_rights")
    ).group_by(Rights.territory).all()
    return {
        "data": [
            {"territory": r.territory, "total_rights": r.total_rights}
            for r in results
        ]
    }