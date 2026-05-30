from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional, List, Dict, Any
from app.utils.security import sanitize_input, detect_prompt_injection


class AnalysisRequest(BaseModel):
    resume_id: int
    job_description: str
    job_title: Optional[str] = None

    @field_validator("job_title")
    @classmethod
    def validate_job_title(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return v
        sanitized = sanitize_input(v)
        if detect_prompt_injection(sanitized):
            raise ValueError("Security violation: Potential prompt injection attempt detected in job title")
        return sanitized

    @field_validator("job_description")
    @classmethod
    def validate_job_description(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Job description cannot be empty")
        sanitized = sanitize_input(v)
        if detect_prompt_injection(sanitized):
            raise ValueError("Security violation: Potential prompt injection attempt detected in job description")
        return sanitized


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


class EquivalentSkillMatch(BaseModel):
    job_requirement: str
    candidate_equivalent: str
    match_strength: float
    reason: str


class CompetencyGap(BaseModel):
    competency: str
    priority: str
    suggestion: str


class RoleFit(BaseModel):
    seniority_alignment: str
    explanation: str


class SemanticAlignmentResponse(BaseModel):
    semantic_score: float
    role_fit: RoleFit
    equivalent_skills_matched: List[EquivalentSkillMatch]
    competency_gaps: List[CompetencyGap]


class CategoryScoreDetail(BaseModel):
    score: float
    max_weight: float
    percentage: float
    explanation: str
    suggestions: List[str]


class CategoryScores(BaseModel):
    keyword_match: CategoryScoreDetail
    skill_match: CategoryScoreDetail
    experience_quality: CategoryScoreDetail
    formatting: CategoryScoreDetail


class TopFix(BaseModel):
    title: str
    severity: str
    why_it_matters: str
    suggested_action: str
    estimated_score_impact: str


class AnalysisResponse(BaseModel):
    id: int
    user_id: int
    resume_id: int
    job_title: Optional[str]
    ats_score: float
    overall_score: Optional[float] = None
    readiness_label: Optional[str] = None
    score_explanation: Optional[str] = None
    category_scores: Optional[CategoryScores] = None
    top_fixes: Optional[List[TopFix]] = None
    score_breakdown: ScoreBreakdown
    keyword_analysis: KeywordAnalysis
    skill_analysis: SkillAnalysis
    ai_feedback: List[AISuggestion]
    improved_bullets: List[Dict[str, str]]
    strengths: List[str]
    weaknesses: List[str]
    semantic_alignment: Optional[SemanticAlignmentResponse] = None
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
