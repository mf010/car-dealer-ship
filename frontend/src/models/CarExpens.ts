import type { Car } from './Car';

export interface CarExpense {
  id: number;
  car_id: number;
  description: string;
  amount: number;
  expense_date: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  
  // Relations
  car?: Car; // Will include nested carModel.make due to eager loading
}

export interface CreateCarExpenseDTO {
  car_id: number;
  description: string;
  amount: number;
  expense_date: string;
}

export interface UpdateCarExpenseDTO {
  car_id?: number;
  description?: string;
  amount?: number;
  expense_date?: string;
}

export interface CarExpenseFilters {
  car_id?: number;
  description?: string;
  expense_date?: string;
  amount_from?: number;
  amount_to?: number;
  // Add any other filter parameters you need
}
