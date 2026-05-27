from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.resume import ResumeResponse, ResumeListResponse
from app.services.resume_service import ResumeService
from app.middleware.auth import get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/resumes", tags=["Resumes"])


@router.post("/upload", response_model=ResumeResponse, status_code=201)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Upload a resume (PDF or DOCX).
    Validates file type and size, extracts text, and stores in database.
    """
    service = ResumeService(db)
    return await service.upload_resume(file, current_user)


@router.get("/", response_model=ResumeListResponse)
def list_resumes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get all resumes for the current user."""
    service = ResumeService(db)
    return service.get_user_resumes(current_user)


@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get a specific resume by ID."""
    service = ResumeService(db)
    resume = service.get_resume_by_id(resume_id, current_user)
    return ResumeResponse.from_orm_with_text(resume)


@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Delete a resume and its associated file."""
    service = ResumeService(db)
    return service.delete_resume(resume_id, current_user)
