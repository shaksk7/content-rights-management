from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from auth.router import router as auth_router
from content.router import router as content_router
from rights.router import router as rights_router
from reports.router import router as reports_router

# Import all models so Base creates tables
import auth.models
import content.models
import rights.models

app = FastAPI(
    title="Content Rights Management API",
    description="API for managing content licensing and rights across territories",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(content_router)
app.include_router(rights_router)
app.include_router(reports_router)

@app.get("/")
def root():
    return {
        "message": "Content Rights Management API",
        "docs": "/docs",
        "version": "1.0.0"
    }