import api from '../helper/api';
import type { Car, CreateCarDTO, UpdateCarDTO, CarFilters, ExpenseUpdateDTO } from '../models/Car';
import type { PaginatedResponse } from '../models/Make';

const BASE_URL = '/api/cars'; // Adjust this based on your API base URL

export const carServices = {
  // Get all cars with pagination and filtering
  getAllCars: async (page: number = 1, filters?: CarFilters): Promise<PaginatedResponse<Car>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      // Send filters as individual query parameters instead of JSON string
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.car_model_id) {
        params.append('car_model_id', filters.car_model_id.toString());
      }
    }
    
    const response = await api.get<PaginatedResponse<Car>>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  // Create a new car
  createCar: async (carData: CreateCarDTO): Promise<Car> => {
    const response = await api.post<Car>(BASE_URL, carData);
    return response.data;
  },

  // Get a single car by ID
  getCarById: async (id: number): Promise<Car> => {
    const response = await api.get<Car>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Update a car
  updateCar: async (id: number, carData: UpdateCarDTO): Promise<Car> => {
    const response = await api.put<Car>(`${BASE_URL}/${id}`, carData);
    return response.data;
  },

  // Delete a car
  deleteCar: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Get all deleted cars with pagination and filtering
  getDeletedCars: async (page: number = 1, filters?: CarFilters): Promise<PaginatedResponse<Car>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      // Send filters as individual query parameters instead of JSON string
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.car_model_id) {
        params.append('car_model_id', filters.car_model_id.toString());
      }
    }
    
    const response = await api.get<PaginatedResponse<Car>>(`${BASE_URL}/deleted?${params.toString()}`);
    return response.data;
  },

  // Restore a deleted car
  restoreCar: async (id: number): Promise<Car> => {
    const response = await api.post<Car>(`${BASE_URL}/${id}/restore`);
    return response.data;
  },

  // Add expense to car
  addExpenseToCar: async (id: number, data: ExpenseUpdateDTO): Promise<Car> => {
    const response = await api.post<Car>(`${BASE_URL}/${id}/add-expense`, data);
    return response.data;
  },

  // Remove expense from car
  removeExpenseFromCar: async (id: number, data: ExpenseUpdateDTO): Promise<Car> => {
    const response = await api.post<Car>(`${BASE_URL}/${id}/remove-expense`, data);
    return response.data;
  }
};
