import axios from 'axios';
import type { Make, CreateMakeDTO, UpdateMakeDTO, PaginatedResponse, MakeFilters } from '../models/Make';

const BASE_URL = '/api/makes'; // Adjust this based on your API base URL

export const makeServices = {
  // Get all makes with pagination and filtering
  getAllMakes: async (page: number = 1, filters?: MakeFilters): Promise<PaginatedResponse<Make>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await axios.get<PaginatedResponse<Make>>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  // Create a new make
  createMake: async (makeData: CreateMakeDTO): Promise<Make> => {
    const response = await axios.post<Make>(BASE_URL, makeData);
    return response.data;
  },

  // Get a single make by ID
  getMakeById: async (id: number): Promise<Make> => {
    const response = await axios.get<Make>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Update a make
  updateMake: async (id: number, makeData: UpdateMakeDTO): Promise<Make> => {
    const response = await axios.put<Make>(`${BASE_URL}/${id}`, makeData);
    return response.data;
  },

  // Delete a make
  deleteMake: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },

  // Get all deleted makes with pagination and filtering
  getDeletedMakes: async (page: number = 1, filters?: MakeFilters): Promise<PaginatedResponse<Make>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await axios.get<PaginatedResponse<Make>>(`${BASE_URL}/deleted?${params.toString()}`);
    return response.data;
  },

  // Restore a deleted make
  restoreMake: async (id: number): Promise<Make> => {
    const response = await axios.post<Make>(`${BASE_URL}/${id}/restore`);
    return response.data;
  }
};
