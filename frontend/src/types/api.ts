export interface ApiErrorBody {
  detail?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedParams {
  skip?: number;
  limit?: number;
}
