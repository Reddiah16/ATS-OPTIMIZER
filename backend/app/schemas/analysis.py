from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any


class AnalysisRequest(BaseModel):
    resume_id: int
    job_description: str
    job_title: Optional[str] = None


class ScoreBreakdown(BaseModel):
    keyword_score: float
    skill_score: float
    experience_score: float
    formatting_score: float


class KeywordAnalysis(BaseModel):
    matched_keywords: List[str]
    missing_keywords: List[str]
    all_job_keywords: List[str]
    match_percentage: float


class SkillAnalysis(BaseModel):
    matched_skills: List[str]
    missing_skills: List[str]


class AISuggestion(BaseModel):
    category: str
    original: Optional[str] = None
    improved: Optional[str] = None
    explanation: str


class AnalysisResponse(BaseModel):
    id: int
    user_id: int
    resume_id: int
    job_title: Optional[str]
    ats_score: float
    score_breakdown: ScoreBreakdown
    keyword_analysis: KeywordAnalysis
    skill_analysis: SkillAnalysis
    ai_feedback: List[AISuggestion]
    improved_bullets: List[Dict[str, str]]
    strengths: List[str]
    weaknesses: List[str]
    created_at: datetime

    class Config:
        from_attributes = True


class AnalysisSummary(BaseModel):
    id: int
    job_title: Optional[str]
    ats_score: float
    resume_filename: str
    created_at: datetime
    matched_keywords_count: int
    missing_keywords_count: int

    class Config:
        from_attributes = True


class AnalysisHistoryResponse(BaseModel):
    analyses: List[AnalysisSummary]
    total: int
