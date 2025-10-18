import type { CarModel } from './CarModel';

export type CarStatus = 'available' | 'sold';

export interface Car {
  id: number;
  car_model_id: number;
  status: CarStatus;
  purchase_price: number;
  total_expenses: number;
  carModel?: CarModel;  // Includes nested make due to eager loading in controller
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CreateCarDTO {
  car_model_id: number;
  status?: CarStatus;
  purchase_price: number;
}

export interface UpdateCarDTO {
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
