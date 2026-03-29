from sqlalchemy.orm import Session
from datetime import date

from starlette.responses import Content
from rights.models import Rights


def check_availability(
    db: Session,
    content_id: int,
    territory: str,
    platform: str,
    check_date: date
):
    conflict = db.query(Rights).filter(Rights.content_id == content_id,
        Rights.territory == territory,
        Rights.platform.in_([platform, "ALL"]),
        Rights.start_date <= check_date,
        Rights.end_date >= check_date).first()

    return conflict is None


def get_conflicts(db: Session, content_id: int, territory: str):
    
    rights = db.query(Rights).filter(
        Rights.content_id == content_id,
        Rights.territory == territory
    ).all()
    
    conflicts = []
    
    for i in range(len(rights)):
        for j in range(i + 1, len(rights)):
            r1, r2 = rights[i], rights[j]
            if r1.start_date <= r2.end_date and r2.start_date <= r1.end_date:
                if r1.platform == r2.platform or "ALL" in [r1.platform, r2.platform]:
                    conflicts.append({"right_1": r1.id, "right_2": r2.id})
    return conflicts