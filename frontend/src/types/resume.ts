export interface Resume {
  id: number;
  user_id: number;
  filename: string;
  original_filename: string;
  file_type: string;
  has_text: boolean;
  uploaded_at: string;
}

export interface ResumeListResponse {
  resumes: Resume[];
  total: number;
}
