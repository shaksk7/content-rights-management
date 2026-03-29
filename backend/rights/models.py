from sqlalchemy import Column, Integer, String, Date, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Rights(Base):
    __tablename__ = "rights"

    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("content.id"), nullable=False)
    licensee = Column(String(255), nullable=False)
    territory = Column(String(100), nullable=False)
    platform = Column(String(50), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    is_exclusive = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    content = relationship("Content", backref="rights")