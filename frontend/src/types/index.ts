export type {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  AuthContextValue,
} from "./auth";

export type { ApiErrorBody, PaginatedParams } from "./api";

export type { Resume, ResumeListResponse } from "./resume";

export type {
  ScoreBreakdown,
  KeywordAnalysis,
  SkillAnalysis,
  AISuggestion,
  ImprovedBullet,
  CategoryScoreDetail,
  CategoryScores,
  TopFix,
  SectionDiagnostic,
  FormattingChecks,
  BulletAnalysisItem,
  KeywordGrouping,
  Analysis,
  AnalysisSummary,
  AnalysisHistoryResponse,
  CreateAnalysisPayload,
} from "./analysis";

/** @deprecated Use ApiErrorBody from ./api */
export type ApiError = import("./api").ApiErrorBody;
