import api from '../helper/api';
import type { AccountDeposit, CreateAccountDepositDTO, UpdateAccountDepositDTO, AccountDepositFilters } from '../models/AccountDeposit';
import type { PaginatedResponse } from '../models/Make';

const BASE_URL = '/account-deposits';

export const accountDepositServices = {
  // Get all account deposits with pagination and filtering
  getAllDeposits: async (page: number = 1, filters?: AccountDepositFilters): Promise<PaginatedResponse<AccountDeposit>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      // Send filters as individual query parameters
      if (filters.account_id) {
        params.append('account_id', filters.account_id.toString());
      }
      if (filters.deposit_date) {
        params.append('deposit_date', filters.deposit_date);
      }
      if (filters.amount_from !== undefined) {
        params.append('amount_from', filters.amount_from.toString());
      }
      if (filters.amount_to !== undefined) {
        params.append('amount_to', filters.amount_to.toString());
      }
    }
    
    const response = await api.get<PaginatedResponse<AccountDeposit>>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  // Create a new account deposit
  createDeposit: async (depositData: CreateAccountDepositDTO): Promise<AccountDeposit> => {
    const response = await api.post<AccountDeposit>(BASE_URL, depositData);
    return response.data;
  },

  // Get a single account deposit by ID
  getDepositById: async (id: number): Promise<AccountDeposit> => {
    const response = await api.get<AccountDeposit>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Update an account deposit
  updateDeposit: async (id: number, depositData: UpdateAccountDepositDTO): Promise<AccountDeposit> => {
    const response = await api.put<AccountDeposit>(`${BASE_URL}/${id}`, depositData);
    return response.data;
  },

  // Delete an account deposit
  deleteDeposit: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Get all deleted deposits with pagination and filtering
  getDeletedDeposits: async (page: number = 1, filters?: AccountDepositFilters): Promise<PaginatedResponse<AccountDeposit>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      // Send filters as individual query parameters
      if (filters.account_id) {
        params.append('account_id', filters.account_id.toString());
      }
      if (filters.deposit_date) {
        params.append('deposit_date', filters.deposit_date);
      }
      if (filters.amount_from !== undefined) {
        params.append('amount_from', filters.amount_from.toString());
      }
      if (filters.amount_to !== undefined) {
        params.append('amount_to', filters.amount_to.toString());
      }
    }
    
    const response = await api.get<PaginatedResponse<AccountDeposit>>(`${BASE_URL}/deleted?${params.toString()}`);
    return response.data;
  },

  // Restore a deleted deposit
  restoreDeposit: async (id: number): Promise<AccountDeposit> => {
    const response = await api.post<AccountDeposit>(`${BASE_URL}/${id}/restore`);
    return response.data;
  }
};
