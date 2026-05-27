from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from loguru import logger
from typing import List

from app.models.analysis import Analysis
from app.models.resume import Resume
from app.models.user import User
from app.schemas.analysis import (
    AnalysisRequest, AnalysisResponse, AnalysisSummary,
    AnalysisHistoryResponse, ScoreBreakdown, KeywordAnalysis,
    SkillAnalysis, AISuggestion,
)
from app.services.ats_service import calculate_ats_score
from app.services.ai_service import AIService


class AnalysisService:
    def __init__(self, db: Session):
        self.db = db
        self.ai_service = AIService()

    async def run_analysis(
        self, request: AnalysisRequest, user: User
    ) -> AnalysisResponse:
        """
        Full analysis pipeline:
        1. Fetch resume & validate ownership
        2. Run ATS scoring engine
        3. Get AI-powered feedback
        4. Persist analysis to database
        5. Return structured response
        """
        # 1. Fetch and validate resume
        resume = (
            self.db.query(Resume)
            .filter(Resume.id == request.resume_id, Resume.user_id == user.id)
            .first()
        )
        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found",
            )
        if not resume.extracted_text:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Could not extract text from resume. Please upload a text-based PDF or DOCX.",
            )

        logger.info(f"Running analysis for resume {resume.id}, user {user.id}")

        # 2. ATS Scoring
        ats_result = calculate_ats_score(
            resume_text=resume.extracted_text,
            job_description=request.job_description,
        )

        # 3. AI Feedback
        ai_result = await self.ai_service.generate_resume_feedback(
            resume_text=resume.extracted_text,
            job_description=request.job_description,
            matched_keywords=ats_result["matched_keywords"],
            missing_keywords=ats_result["missing_keywords"],
            ats_score=ats_result["ats_score"],
        )

        # 4. Persist analysis
        analysis = Analysis(
            user_id=user.id,
            resume_id=resume.id,
            job_title=request.job_title,
            job_description=request.job_description,
            ats_score=ats_result["ats_score"],
            keyword_score=ats_result["keyword_score"],
            skill_score=ats_result["skill_score"],
            experience_score=ats_result["experience_score"],
            formatting_score=ats_result["formatting_score"],
            matched_keywords=ats_result["matched_keywords"],
            missing_keywords=ats_result["missing_keywords"],
            all_job_keywords=ats_result["all_job_keywords"],
            matched_skills=ats_result["matched_skills"],
            missing_skills=ats_result["missing_skills"],
            ai_feedback=ai_result.get("ai_feedback", []),
            improved_bullets=ai_result.get("improved_bullets", []),
            strengths=ai_result.get("strengths", []),
            weaknesses=ai_result.get("weaknesses", []),
        )
        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)

        logger.info(f"Analysis saved: id={analysis.id}, score={analysis.ats_score}")

        # 5. Build response
        return self._build_response(analysis)

    def get_analysis_by_id(self, analysis_id: int, user: User) -> AnalysisResponse:
        """Get a specific analysis by ID."""
        analysis = (
            self.db.query(Analysis)
            .filter(Analysis.id == analysis_id, Analysis.user_id == user.id)
            .first()
        )
        if not analysis:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Analysis not found",
            )
        return self._build_response(analysis)

    def get_user_history(
        self, user: User, skip: int = 0, limit: int = 20
    ) -> AnalysisHistoryResponse:
        """Get paginated analysis history for a user."""
        query = (
            self.db.query(Analysis)
            .filter(Analysis.user_id == user.id)
            .order_by(Analysis.created_at.desc())
        )
        total = query.count()
        analyses = query.offset(skip).limit(limit).all()

        summaries = []
        for a in analyses:
            resume = self.db.query(Resume).filter(Resume.id == a.resume_id).first()
            summaries.append(
                AnalysisSummary(
                    id=a.id,
                    job_title=a.job_title,
                    ats_score=a.ats_score,
                    resume_filename=resume.original_filename if resume else "Unknown",
                    created_at=a.created_at,
                    matched_keywords_count=len(a.matched_keywords or []),
                    missing_keywords_count=len(a.missing_keywords or []),
                )
            )

        return AnalysisHistoryResponse(analyses=summaries, total=total)

    def _build_response(self, analysis: Analysis) -> AnalysisResponse:
        """Convert an Analysis ORM object to AnalysisResponse."""
        ai_feedback = [
            AISuggestion(**item) if isinstance(item, dict) else item
            for item in (analysis.ai_feedback or [])
        ]

        matched_kw = analysis.matched_keywords or []
        all_jd_kw = analysis.all_job_keywords or []
        match_pct = (
            round(len(matched_kw) / len(all_jd_kw) * 100, 1)
            if all_jd_kw
            else 0.0
        )

        return AnalysisResponse(
            id=analysis.id,
            user_id=analysis.user_id,
            resume_id=analysis.resume_id,
            job_title=analysis.job_title,
            ats_score=analysis.ats_score,
            score_breakdown=ScoreBreakdown(
                keyword_score=analysis.keyword_score or 0,
                skill_score=analysis.skill_score or 0,
                experience_score=analysis.experience_score or 0,
                formatting_score=analysis.formatting_score or 0,
            ),
            keyword_analysis=KeywordAnalysis(
                matched_keywords=matched_kw,
                missing_keywords=analysis.missing_keywords or [],
                all_job_keywords=all_jd_kw,
                match_percentage=match_pct,
            ),
            skill_analysis=SkillAnalysis(
                matched_skills=analysis.matched_skills or [],
                missing_skills=analysis.missing_skills or [],
            ),
            ai_feedback=ai_feedback,
            improved_bullets=analysis.improved_bullets or [],
            strengths=analysis.strengths or [],
            weaknesses=analysis.weaknesses or [],
            created_at=analysis.created_at,
        )
