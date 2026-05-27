from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ResumeBase(BaseModel):
    filename: str
    original_filename: str
    file_type: str


class ResumeCreate(ResumeBase):
    user_id: int
    file_path: str
    extracted_text: Optional[str] = None


class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    uploaded_at: datetime
    has_text: bool = False

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_with_text(cls, resume):
        return cls(
            id=resume.id,
            user_id=resume.user_id,
            filename=resume.filename,
            original_filename=resume.original_filename,
            file_type=resume.file_type,
            uploaded_at=resume.uploaded_at,
            has_text=bool(resume.extracted_text),
        )


class ResumeListResponse(BaseModel):
    resumes: list[ResumeResponse]
    total: int
