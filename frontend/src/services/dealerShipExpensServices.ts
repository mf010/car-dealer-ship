import api from '../helper/api';
import type { DealerShipExpense, CreateDealerShipExpenseDTO, UpdateDealerShipExpenseDTO, DealerShipExpenseFilters } from '../models/DealerShipExpenses';
import type { PaginatedResponse } from '../models/Make';

const BASE_URL = '/api/dealership-expenses'; // Adjust this based on your API base URL

export const dealerShipExpenseServices = {
  // Get all dealership expenses with pagination and filtering
  getAllDealerShipExpenses: async (page: number = 1, filters?: DealerShipExpenseFilters): Promise<PaginatedResponse<DealerShipExpense>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      // Send filters as individual query parameters instead of JSON string
      if (filters.description) {
        params.append('description', filters.description);
      }
      if (filters.expense_date) {
        params.append('expense_date', filters.expense_date);
      }
      if (filters.amount_from !== undefined) {
        params.append('amount_from', filters.amount_from.toString());
      }
      if (filters.amount_to !== undefined) {
        params.append('amount_to', filters.amount_to.toString());
      }
    }
    
    const response = await api.get<PaginatedResponse<DealerShipExpense>>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  // Create a new dealership expense
  createDealerShipExpense: async (expenseData: CreateDealerShipExpenseDTO): Promise<DealerShipExpense> => {
    const response = await api.post<DealerShipExpense>(BASE_URL, expenseData);
    return response.data;
  },

  // Get a single dealership expense by ID
  getDealerShipExpenseById: async (id: number): Promise<DealerShipExpense> => {
    const response = await api.get<DealerShipExpense>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Update a dealership expense
  updateDealerShipExpense: async (id: number, expenseData: UpdateDealerShipExpenseDTO): Promise<DealerShipExpense> => {
    const response = await api.put<DealerShipExpense>(`${BASE_URL}/${id}`, expenseData);
    return response.data;
  },

  // Delete a dealership expense
  deleteDealerShipExpense: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Get all deleted dealership expenses with pagination and filtering
  getDeletedDealerShipExpenses: async (page: number = 1, filters?: DealerShipExpenseFilters): Promise<PaginatedResponse<DealerShipExpense>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      // Send filters as individual query parameters instead of JSON string
      if (filters.description) {
        params.append('description', filters.description);
      }
      if (filters.expense_date) {
        params.append('expense_date', filters.expense_date);
      }
      if (filters.amount_from !== undefined) {
        params.append('amount_from', filters.amount_from.toString());
      }
      if (filters.amount_to !== undefined) {
        params.append('amount_to', filters.amount_to.toString());
      }
    }
    
    const response = await api.get<PaginatedResponse<DealerShipExpense>>(`${BASE_URL}/deleted?${params.toString()}`);
    return response.data;
  },

  // Restore a deleted dealership expense
  restoreDealerShipExpense: async (id: number): Promise<DealerShipExpense> => {
    const response = await api.post<DealerShipExpense>(`${BASE_URL}/${id}/restore`);
    return response.data;
  }
};
