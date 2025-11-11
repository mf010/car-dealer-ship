import api from '../helper/api';
import type { Client, CreateClientDTO, UpdateClientDTO, ClientFilters, BalanceUpdateDTO } from '../models/Client';
import type { PaginatedResponse } from '../models/Make';

const BASE_URL = '/clients'; // Adjust this based on your API base URL

export const clientServices = {
  // Get all clients with pagination and filtering
  getAllClients: async (page: number = 1, filters?: ClientFilters): Promise<PaginatedResponse<Client>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await api.get<PaginatedResponse<Client>>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  // Create a new client
  createClient: async (clientData: CreateClientDTO): Promise<Client> => {
    const response = await api.post<Client>(BASE_URL, clientData);
    return response.data;
  },

  // Get a single client by ID
  getClientById: async (id: number): Promise<Client> => {
    const response = await api.get<Client>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Update a client
  updateClient: async (id: number, clientData: UpdateClientDTO): Promise<Client> => {
    const response = await api.put<Client>(`${BASE_URL}/${id}`, clientData);
    return response.data;
  },

  // Delete a client
  deleteClient: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Get all deleted clients with pagination and filtering
  getDeletedClients: async (page: number = 1, filters?: ClientFilters): Promise<PaginatedResponse<Client>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await api.get<PaginatedResponse<Client>>(`${BASE_URL}/deleted?${params.toString()}`);
    return response.data;
  },

  // Restore a deleted client
  restoreClient: async (id: number): Promise<Client> => {
    const response = await api.post<Client>(`${BASE_URL}/${id}/restore`);
    return response.data;
  },

  // Add amount to client balance
  addToClientBalance: async (id: number, data: BalanceUpdateDTO): Promise<Client> => {
    const response = await api.post<Client>(`${BASE_URL}/${id}/add-balance`, data);
    return response.data;
  },

  // Subtract amount from client balance
  subtractFromClientBalance: async (id: number, data: BalanceUpdateDTO): Promise<Client> => {
    const response = await api.post<Client>(`${BASE_URL}/${id}/subtract-balance`, data);
    return response.data;
  }
};
