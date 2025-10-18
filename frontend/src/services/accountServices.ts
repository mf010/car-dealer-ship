import axios from 'axios';
import type { Account, CreateAccountDTO, UpdateAccountDTO, AccountFilters, BalanceUpdateDTO } from '../models/Account';
import type { PaginatedResponse } from '../models/Make';

const BASE_URL = '/api/accounts'; // Adjust this based on your API base URL

export const accountServices = {
  // Get all accounts with pagination and filtering
  getAllAccounts: async (page: number = 1, filters?: AccountFilters): Promise<PaginatedResponse<Account>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await axios.get<PaginatedResponse<Account>>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  // Create a new account
  createAccount: async (accountData: CreateAccountDTO): Promise<Account> => {
    const response = await axios.post<Account>(BASE_URL, accountData);
    return response.data;
  },

  // Get a single account by ID
  getAccountById: async (id: number): Promise<Account> => {
    const response = await axios.get<Account>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Update an account
  updateAccount: async (id: number, accountData: UpdateAccountDTO): Promise<Account> => {
    const response = await axios.put<Account>(`${BASE_URL}/${id}`, accountData);
    return response.data;
  },

  // Delete an account
  deleteAccount: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },

  // Get all deleted accounts with pagination and filtering
  getDeletedAccounts: async (page: number = 1, filters?: AccountFilters): Promise<PaginatedResponse<Account>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await axios.get<PaginatedResponse<Account>>(`${BASE_URL}/deleted?${params.toString()}`);
    return response.data;
  },

  // Restore a deleted account
  restoreAccount: async (id: number): Promise<Account> => {
    const response = await axios.post<Account>(`${BASE_URL}/${id}/restore`);
    return response.data;
  },

  // Add amount to account balance
  addToAccountBalance: async (id: number, data: BalanceUpdateDTO): Promise<Account> => {
    const response = await axios.post<Account>(`${BASE_URL}/${id}/add-balance`, data);
    return response.data;
  },

  // Subtract amount from account balance
  subtractFromAccountBalance: async (id: number, data: BalanceUpdateDTO): Promise<Account> => {
    const response = await axios.post<Account>(`${BASE_URL}/${id}/subtract-balance`, data);
    return response.data;
  }
};
