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

    # Phase 1 new fields
    readiness_label = Column(String(50), nullable=True)
    score_explanation = Column(Text, nullable=True)
    category_scores = Column(JSON, nullable=True)    # Detailed category breakdown
    top_fixes = Column(JSON, nullable=True)          # Prioritized fixes list

    # Phase 2 new fields
    section_diagnostics = Column(JSON, nullable=True)
    formatting_checks = Column(JSON, nullable=True)
    bullet_analysis = Column(JSON, nullable=True)
    keyword_grouping = Column(JSON, nullable=True)

    # Phase 3 history fields
    parent_analysis_id = Column(Integer, ForeignKey("analyses.id", ondelete="SET NULL"), nullable=True)
    resume_version_id = Column(Integer, ForeignKey("resume_versions.id", ondelete="SET NULL"), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="analyses")
    resume = relationship("Resume", back_populates="analyses")
    parent_analysis = relationship("Analysis", remote_side=[id], backref="child_analyses")
    resume_version = relationship("ResumeVersion", backref="analyses")

    def __repr__(self):
        return f"<Analysis(id={self.id}, user_id={self.user_id}, resume_id={self.resume_id}, ats_score={self.ats_score})>"


class AppliedSuggestion(Base):
    __tablename__ = "applied_suggestions"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False)
    suggestion_type = Column(String(50), nullable=False)  # 'bullet', 'keyword', 'formatting'
    original_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())

    analysis = relationship("Analysis", backref="applied_suggestions")
