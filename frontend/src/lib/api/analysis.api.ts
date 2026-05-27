import { api } from "./client";
import type {
  Analysis,
  AnalysisHistoryResponse,
  CreateAnalysisPayload,
} from "@/types/analysis";

export const analysisApi = {
  create: (data: CreateAnalysisPayload) =>
    api.post<Analysis>("/analysis/", data),

  getById: (id: number) => api.get<Analysis>(`/analysis/${id}`),

  getHistory: (skip = 0, limit = 20) =>
    api.get<AnalysisHistoryResponse>(
      `/analysis/history?skip=${skip}&limit=${limit}`
    ),
};
