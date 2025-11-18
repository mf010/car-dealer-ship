import type { CarModel } from './CarModel';

export type CarStatus = 'available' | 'sold';

export interface Car {
  id: number;
  name?: string;
  car_model_id: number;
  status: CarStatus;
  purchase_price: number;
  total_expenses: number;
  carModel?: CarModel;  // Includes nested make due to eager loading in controller
  car_model?: CarModel; // API sends snake_case, add alias
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CreateCarDTO {
  name?: string;
  car_model_id: number;
  status?: CarStatus;
  purchase_price: number;
}

export interface UpdateCarDTO {
  name?: string;
  car_model_id?: number;
  status?: CarStatus;
  purchase_price?: number;
}

export interface CarFilters {
  car_model_id?: number;
  status?: CarStatus;
  // Add any other filter parameters you need
}

export interface ExpenseUpdateDTO {
  amount: number;
}
