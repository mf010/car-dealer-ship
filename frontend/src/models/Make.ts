export interface Make {
  id: number;
  name: string;
  deleted_at?: string | null;
}

export interface CreateMakeDTO {
  name: string;
}

export interface UpdateMakeDTO {
  name?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface MakeFilters {
  name?: string;
  // Add any other filter parameters you need
}

