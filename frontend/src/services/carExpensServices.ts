import api from '../helper/api';
import type { CarExpense, CreateCarExpenseDTO, UpdateCarExpenseDTO, CarExpenseFilters } from '../models/CarExpens';
import type { PaginatedResponse } from '../models/Make';

const BASE_URL = '/api/car-expenses'; // Adjust this based on your API base URL

export const carExpenseServices = {
  // Get all car expenses with pagination and filtering
  getAllCarExpenses: async (page: number = 1, filters?: CarExpenseFilters): Promise<PaginatedResponse<CarExpense>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await api.get<PaginatedResponse<CarExpense>>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  // Create a new car expense
  createCarExpense: async (expenseData: CreateCarExpenseDTO): Promise<CarExpense> => {
    const response = await api.post<CarExpense>(BASE_URL, expenseData);
    return response.data;
  },

  // Get a single car expense by ID
  getCarExpenseById: async (id: number): Promise<CarExpense> => {
    const response = await api.get<CarExpense>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Update a car expense
  updateCarExpense: async (id: number, expenseData: UpdateCarExpenseDTO): Promise<CarExpense> => {
    const response = await api.put<CarExpense>(`${BASE_URL}/${id}`, expenseData);
    return response.data;
  },

  // Delete a car expense
  deleteCarExpense: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Get all deleted car expenses with pagination and filtering
  getDeletedCarExpenses: async (page: number = 1, filters?: CarExpenseFilters): Promise<PaginatedResponse<CarExpense>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await api.get<PaginatedResponse<CarExpense>>(`${BASE_URL}/deleted?${params.toString()}`);
    return response.data;
  },

  // Restore a deleted car expense
  restoreCarExpense: async (id: number): Promise<CarExpense> => {
    const response = await api.post<CarExpense>(`${BASE_URL}/${id}/restore`);
    return response.data;
  }
};
