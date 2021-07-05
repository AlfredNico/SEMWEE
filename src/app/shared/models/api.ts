export interface ApiResponse {
  message: string;
}

export interface PaginatedResponse<T> {
  length: number;
  pageIndex: string;
  data: T[];
  columns?: string[];
}
