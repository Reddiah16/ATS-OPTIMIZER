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

export interface SectionDiagnostic {
  section_name: string;
  present: boolean;
  completeness_score: number;
  quality: string;
  ats_risk: string;
  issues: string[];
  suggestions: string[];
  section_score: number;
}

export interface FormattingChecks {
  formatting_score: number;
  issues: string[];
  suggestions: string[];
}

export interface BulletAnalysisItem {
  original_text: string;
  bullet_score: number;
  issues: string[];
  improved_text: string;
  is_improvement_accepted: boolean;
}

export interface KeywordGrouping {
  matched_required_keywords: string[];
  missing_required_keywords: string[];
  secondary_keywords: string[];
  equivalent_skill_matches: Array<{
    job_requirement: string;
    candidate_equivalent: string;
    reason: string;
  }>;
  employer_language_to_mirror: string[];
  keyword_match_percentage: number;
  explanation: string;
  suggested_section_for_each_missing_keyword: Record<string, string>;
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
  section_diagnostics?: SectionDiagnostic[];
  formatting_checks?: FormattingChecks;
  bullet_analysis?: BulletAnalysisItem[];
  keyword_grouping?: KeywordGrouping;
  score_breakdown: ScoreBreakdown;
  keyword_analysis: KeywordAnalysis;
  skill_analysis: SkillAnalysis;
  ai_feedback: AISuggestion[];
  improved_bullets: ImprovedBullet[];
  strengths: string[];
  weaknesses: string[];
  created_at: string;
  parent_analysis_id?: number;
  resume_version_id?: number;
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
  history: AnalysisSummary[];
  total: number;
}

export interface CreateAnalysisPayload {
  resume_id: number;
  job_description: string;
  job_title?: string;
}
