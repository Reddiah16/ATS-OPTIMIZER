export interface ScoreBreakdown {
  keyword_score: number;
  skill_score: number;
  experience_score: number;
  formatting_score: number;
}

export interface KeywordAnalysis {
  matched_keywords: string[];
  missing_keywords: string[];
  all_job_keywords: string[];
  match_percentage: number;
}

export interface SkillAnalysis {
  matched_skills: string[];
  missing_skills: string[];
}

export interface AISuggestion {
  category: string;
  original: string | null;
  improved: string | null;
  explanation: string;
}

export interface ImprovedBullet {
  original: string;
  improved: string;
}

export interface CategoryScoreDetail {
  score: number;
  max_weight: number;
  percentage: number;
  explanation: string;
  suggestions: string[];
}

export interface CategoryScores {
  keyword_match: CategoryScoreDetail;
  skill_match: CategoryScoreDetail;
  experience_quality: CategoryScoreDetail;
  formatting: CategoryScoreDetail;
}

export interface TopFix {
  title: string;
  severity: string;
  why_it_matters: string;
  suggested_action: string;
  estimated_score_impact: string;
}

export interface Analysis {
  id: number;
  user_id: number;
  resume_id: number;
  job_title: string | null;
  ats_score: number;
  overall_score?: number;
  readiness_label?: string;
  score_explanation?: string;
  category_scores?: CategoryScores;
  top_fixes?: TopFix[];
  score_breakdown: ScoreBreakdown;
  keyword_analysis: KeywordAnalysis;
  skill_analysis: SkillAnalysis;
  ai_feedback: AISuggestion[];
  improved_bullets: ImprovedBullet[];
  strengths: string[];
  weaknesses: string[];
  created_at: string;
}

export interface AnalysisSummary {
  id: number;
  job_title: string | null;
  ats_score: number;
  resume_filename: string;
  created_at: string;
  matched_keywords_count: number;
  missing_keywords_count: number;
}

export interface AnalysisHistoryResponse {
  analyses: AnalysisSummary[];
  total: number;
}

export interface CreateAnalysisPayload {
  resume_id: number;
  job_description: string;
  job_title?: string;
}
