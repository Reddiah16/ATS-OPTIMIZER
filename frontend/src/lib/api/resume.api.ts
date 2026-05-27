import { api } from "./client";
import type { Resume, ResumeListResponse } from "@/types/resume";

export const resumeApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<Resume>("/resumes/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  list: () => api.get<ResumeListResponse>("/resumes/"),

  getById: (id: number) => api.get<Resume>(`/resumes/${id}`),

  delete: (id: number) => api.delete<void>(`/resumes/${id}`),
};
