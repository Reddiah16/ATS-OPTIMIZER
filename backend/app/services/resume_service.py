import os
import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile, status
from loguru import logger

from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeResponse, ResumeListResponse
from app.utils.file_parser import extract_text, validate_file_type, validate_file_size
from app.config import settings


class ResumeService:
    def __init__(self, db: Session):
        self.db = db
        self._ensure_upload_dir()

    def _ensure_upload_dir(self):
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    async def upload_resume(self, file: UploadFile, user: User) -> ResumeResponse:
        """Handle resume upload: validate, save, extract text, persist to DB."""
        # Validate file type
        is_valid, file_type = validate_file_type(file.filename)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF and DOCX files are supported",
            )

        # Read file content
        content = await file.read()

        # Validate file size
        if not validate_file_size(len(content), settings.MAX_FILE_SIZE_MB):
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File exceeds the {settings.MAX_FILE_SIZE_MB}MB limit",
            )

        # Generate unique filename to prevent collisions
        unique_name = f"{uuid.uuid4().hex}_{file.filename}"
        file_path = os.path.join(settings.UPLOAD_DIR, unique_name)

        # Save file to disk
        with open(file_path, "wb") as f:
            f.write(content)

        logger.info(f"Saved resume file: {file_path}")

        # Extract text
        extracted_text = extract_text(file_path, file_type)
        if not extracted_text:
            logger.warning(f"Could not extract text from {file.filename}")

        # Persist to database
        resume = Resume(
            user_id=user.id,
            filename=unique_name,
            original_filename=file.filename,
            file_path=file_path,
            file_type=file_type,
            extracted_text=extracted_text,
        )
        self.db.add(resume)
        self.db.commit()
        self.db.refresh(resume)

        logger.info(f"Resume saved to DB: id={resume.id}, user={user.id}")
        return ResumeResponse.from_orm_with_text(resume)

    def get_user_resumes(self, user: User) -> ResumeListResponse:
        """Get all resumes for a user."""
        resumes = (
            self.db.query(Resume)
            .filter(Resume.user_id == user.id)
            .order_by(Resume.uploaded_at.desc())
            .all()
        )
        return ResumeListResponse(
            resumes=[ResumeResponse.from_orm_with_text(r) for r in resumes],
            total=len(resumes),
        )

    def get_resume_by_id(self, resume_id: int, user: User) -> Resume:
        """Get a specific resume, ensuring it belongs to the user."""
        resume = (
            self.db.query(Resume)
            .filter(Resume.id == resume_id, Resume.user_id == user.id)
            .first()
        )
        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found",
            )
        return resume

    def delete_resume(self, resume_id: int, user: User) -> dict:
        """Delete a resume and its file."""
        resume = self.get_resume_by_id(resume_id, user)

        # Remove file from disk
        if os.path.exists(resume.file_path):
            os.remove(resume.file_path)
            logger.info(f"Deleted file: {resume.file_path}")

        self.db.delete(resume)
        self.db.commit()
        return {"message": "Resume deleted successfully"}
