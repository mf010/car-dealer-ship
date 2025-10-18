import axios from 'axios';
import type { DealerShipExpense, CreateDealerShipExpenseDTO, UpdateDealerShipExpenseDTO, DealerShipExpenseFilters } from '../models/DealerShipExpenses';
import type { PaginatedResponse } from '../models/Make';

const BASE_URL = '/api/dealership-expenses'; // Adjust this based on your API base URL

export const dealerShipExpenseServices = {
  // Get all dealership expenses with pagination and filtering
  getAllDealerShipExpenses: async (page: number = 1, filters?: DealerShipExpenseFilters): Promise<PaginatedResponse<DealerShipExpense>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await axios.get<PaginatedResponse<DealerShipExpense>>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  // Create a new dealership expense
  createDealerShipExpense: async (expenseData: CreateDealerShipExpenseDTO): Promise<DealerShipExpense> => {
    const response = await axios.post<DealerShipExpense>(BASE_URL, expenseData);
    return response.data;
  },

  // Get a single dealership expense by ID
  getDealerShipExpenseById: async (id: number): Promise<DealerShipExpense> => {
    const response = await axios.get<DealerShipExpense>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Update a dealership expense
  updateDealerShipExpense: async (id: number, expenseData: UpdateDealerShipExpenseDTO): Promise<DealerShipExpense> => {
    const response = await axios.put<DealerShipExpense>(`${BASE_URL}/${id}`, expenseData);
    return response.data;
  },

  // Delete a dealership expense
  deleteDealerShipExpense: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },

  // Get all deleted dealership expenses with pagination and filtering
  getDeletedDealerShipExpenses: async (page: number = 1, filters?: DealerShipExpenseFilters): Promise<PaginatedResponse<DealerShipExpense>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await axios.get<PaginatedResponse<DealerShipExpense>>(`${BASE_URL}/deleted?${params.toString()}`);
    return response.data;
  },

  // Restore a deleted dealership expense
  restoreDealerShipExpense: async (id: number): Promise<DealerShipExpense> => {
    const response = await axios.post<DealerShipExpense>(`${BASE_URL}/${id}/restore`);
    return response.data;
  }
};
