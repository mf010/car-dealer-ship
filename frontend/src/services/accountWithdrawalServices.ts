import axios from 'axios';
import type { AccountWithdrawal, CreateAccountWithdrawalDTO, UpdateAccountWithdrawalDTO, AccountWithdrawalFilters } from '../models/AccountWithdrawal';
import type { PaginatedResponse } from '../models/Make';

const BASE_URL = '/api/account-withdrawals'; // Adjust this based on your API base URL

export const accountWithdrawalServices = {
  // Get all account withdrawals with pagination and filtering
  getAllWithdrawals: async (page: number = 1, filters?: AccountWithdrawalFilters): Promise<PaginatedResponse<AccountWithdrawal>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await axios.get<PaginatedResponse<AccountWithdrawal>>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  // Create a new account withdrawal
  createWithdrawal: async (withdrawalData: CreateAccountWithdrawalDTO): Promise<AccountWithdrawal> => {
    const response = await axios.post<AccountWithdrawal>(BASE_URL, withdrawalData);
    return response.data;
  },

  // Get a single account withdrawal by ID
  getWithdrawalById: async (id: number): Promise<AccountWithdrawal> => {
    const response = await axios.get<AccountWithdrawal>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Update an account withdrawal
  updateWithdrawal: async (id: number, withdrawalData: UpdateAccountWithdrawalDTO): Promise<AccountWithdrawal> => {
    const response = await axios.put<AccountWithdrawal>(`${BASE_URL}/${id}`, withdrawalData);
    return response.data;
  },

  // Delete an account withdrawal
  deleteWithdrawal: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },

  // Get all deleted withdrawals with pagination and filtering
  getDeletedWithdrawals: async (page: number = 1, filters?: AccountWithdrawalFilters): Promise<PaginatedResponse<AccountWithdrawal>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await axios.get<PaginatedResponse<AccountWithdrawal>>(`${BASE_URL}/deleted?${params.toString()}`);
    return response.data;
  },

  // Restore a deleted withdrawal
  restoreWithdrawal: async (id: number): Promise<AccountWithdrawal> => {
    const response = await axios.post<AccountWithdrawal>(`${BASE_URL}/${id}/restore`);
    return response.data;
  }
};
