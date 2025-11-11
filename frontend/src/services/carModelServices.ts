import api from '../helper/api';
import type { CarModel, CreateCarModelDTO, UpdateCarModelDTO, CarModelFilters } from '../models/CarModel';
import type { PaginatedResponse } from '../models/Make';

const BASE_URL = '/car-models'; // Adjust this based on your API base URL

export const carModelServices = {
  // Get all car models with pagination and filtering
  getAllCarModels: async (page: number = 1, filters?: CarModelFilters): Promise<PaginatedResponse<CarModel>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await api.get<PaginatedResponse<CarModel>>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  // Create a new car model
  createCarModel: async (carModelData: CreateCarModelDTO): Promise<CarModel> => {
    const response = await api.post<CarModel>(BASE_URL, carModelData);
    return response.data;
  },

  // Get a single car model by ID
  getCarModelById: async (id: number): Promise<CarModel> => {
    const response = await api.get<CarModel>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Update a car model
  updateCarModel: async (id: number, carModelData: UpdateCarModelDTO): Promise<CarModel> => {
    const response = await api.put<CarModel>(`${BASE_URL}/${id}`, carModelData);
    return response.data;
  },

  // Delete a car model
  deleteCarModel: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Get all deleted car models with pagination and filtering
  getDeletedCarModels: async (page: number = 1, filters?: CarModelFilters): Promise<PaginatedResponse<CarModel>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await api.get<PaginatedResponse<CarModel>>(`${BASE_URL}/deleted?${params.toString()}`);
    return response.data;
  },

  // Restore a deleted car model
  restoreCarModel: async (id: number): Promise<CarModel> => {
    const response = await api.post<CarModel>(`${BASE_URL}/${id}/restore`);
    return response.data;
  }
};
