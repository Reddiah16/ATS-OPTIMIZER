from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.session import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)

    # Job description
    job_title = Column(String(255), nullable=True)
    job_description = Column(Text, nullable=False)

    # ATS Score breakdown
    ats_score = Column(Float, nullable=False)
    keyword_score = Column(Float, nullable=True)
    skill_score = Column(Float, nullable=True)
    experience_score = Column(Float, nullable=True)
    formatting_score = Column(Float, nullable=True)

    # Keywords analysis
    matched_keywords = Column(JSON, nullable=True)   # list of matched keywords
    missing_keywords = Column(JSON, nullable=True)   # list of missing keywords
    all_job_keywords = Column(JSON, nullable=True)   # all keywords from JD

    # Skills analysis
    matched_skills = Column(JSON, nullable=True)
    missing_skills = Column(JSON, nullable=True)

    # AI Feedback
    ai_feedback = Column(JSON, nullable=True)        # structured AI suggestions
    improved_bullets = Column(JSON, nullable=True)   # AI-improved bullet points
    strengths = Column(JSON, nullable=True)
    weaknesses = Column(JSON, nullable=True)
    semantic_alignment = Column(JSON, nullable=True) # AI semantic & logical alignment analysis

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="analyses")
    resume = relationship("Resume", back_populates="analyses")

    def __repr__(self):
        return f"<Analysis(id={self.id}, ats_score={self.ats_score}, user_id={self.user_id})>"
