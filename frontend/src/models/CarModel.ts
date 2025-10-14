import type { Make } from './Make';

export interface CarModel {
  id: number;
  name: string;
  make_id: number;
  make?: Make;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCarModelDTO {
  name: string;
  make_id: number;
}

export interface UpdateCarModelDTO {
  name?: string;
  make_id?: number;
}

export interface CarModelFilters {
  name?: string;
  make_id?: number;
  // Add any other filter parameters you need
}
