import api from '../helper/api';
import type { Car, CreateCarDTO, UpdateCarDTO, CarFilters, ExpenseUpdateDTO } from '../models/Car';
import type { PaginatedResponse } from '../models/Make';

const BASE_URL = '/cars'; // Adjust this based on your API base URL

export const carServices = {
  /**
   * Fast search for cars by name, make, model or ID
   * Used for autocomplete in expense forms, invoices, etc.
   * @param query - Search query string
   * @param limit - Maximum number of results (default 10, max 50)
   * @param status - Optional status filter ('available' | 'sold')
   */
  searchCars: async (query: string, limit: number = 10, status?: string): Promise<Car[]> => {
    if (!query || query.trim() === '') {
      return [];
    }
    
    const params = new URLSearchParams();
    params.append('q', query.trim());
    params.append('limit', limit.toString());
    
    if (status) {
      params.append('status', status);
    }
    
    const response = await api.get<Car[]>(`${BASE_URL}/search?${params.toString()}`);
    return response.data;
  },

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
  },

  // Report: Cars not sold before a starting date
  reportCarsNotSoldBeforeStartDate: async (startingDate: string): Promise<{
    starting_date: string;
    total_cars: number;
    cars: Array<{
      id: number;
      make: string | null;
      model: string | null;
      name: string;
      status: string;
      purchase_price: number;
      total_expenses: number;
      created_at: string;
      sold_after_starting_date: boolean;
      sold_date: string | null;
      selling_price: number | null;
    }>;
  }> => {
    const params = new URLSearchParams();
    params.append('starting_date', startingDate);

    const response = await api.get(`/reports/cars-not-sold-before-date?${params.toString()}`);
    return response.data;
  },

  // Report: Cars sold between dates
  reportCarsSoldBetweenDates: async (startingDate: string, endingDate: string): Promise<{
    starting_date: string;
    ending_date: string;
    total_cars: number;
    cars: Array<{
      id: number;
      make: string | null;
      model: string | null;
      status: string;
      purchase_price: number;
      total_expenses: number;
      created_at: string;
      sold_date: string;
      invoice_id: number;
      invoice_amount: number;
      client_id: number;
      total_invoices_in_range: number;
    }>;
  }> => {
    const params = new URLSearchParams();
    params.append('starting_date', startingDate);
    params.append('ending_date', endingDate);

    const response = await api.get(`/reports/cars-sold-between-dates?${params.toString()}`);
    return response.data;
  },

  // Report: All Cars purchased between dates
  reportInvoicesBetweenDates: async (startingDate: string, endingDate: string): Promise<{
    starting_date: string;
    ending_date: string;
    total_cars: number;
    total_invoice_amount: number;
    total_purchase_price: number;
    total_expenses: number;
    total_profit: number;
    cars: Array<{
      car_id: number;
      car_name: string | null;
      car_make: string | null;
      car_model: string | null;
      car_purchase_price: number;
      car_total_expenses: number;
      car_created_at: string;
      invoice_id: number | null;
      invoice_date: string | null;
      invoice_amount: number;
      profit: number;
      client_id: number | null;
      client_name: string | null;
    }>;
  }> => {
    const params = new URLSearchParams();
    params.append('starting_date', startingDate);
    params.append('ending_date', endingDate);

    const response = await api.get(`/reports/invoices-between-dates?${params.toString()}`);
    return response.data;
  },

  // Report: Unsold Cars (cars with status 'available' and no invoices) within date range
  reportUnsoldCars: async (startingDate: string, endingDate: string): Promise<{
    starting_date: string;
    ending_date: string;
    total_cars: number;
    total_purchase_price: number;
    total_expenses: number;
    total_cost: number;
    cars: Array<{
      car_id: number;
      car_name: string | null;
      car_make: string | null;
      car_model: string | null;
      car_status: string;
      car_purchase_price: number;
      car_total_expenses: number;
      car_total_cost: number;
      car_created_at: string;
    }>;
  }> => {
    const params = new URLSearchParams();
    params.append('starting_date', startingDate);
    params.append('ending_date', endingDate);

    const response = await api.get(`/reports/unsold-cars?${params.toString()}`);
    return response.data;
  },

  // Report: Sold Cars (cars with invoices) within date range
  reportSoldCars: async (startingDate: string, endingDate: string): Promise<{
    starting_date: string;
    ending_date: string;
    total_cars: number;
    total_purchase_price: number;
    total_expenses: number;
    total_invoice_amount: number;
    total_profit: number;
    cars: Array<{
      car_id: number;
      car_name: string | null;
      car_make: string | null;
      car_model: string | null;
      car_status: string;
      car_purchase_price: number;
      car_total_expenses: number;
      car_created_at: string;
      invoice_id: number;
      invoice_date: string;
      invoice_amount: number;
      profit: number;
      client_id: number;
      client_name: string | null;
    }>;
  }> => {
    const params = new URLSearchParams();
    params.append('starting_date', startingDate);
    params.append('ending_date', endingDate);

    const response = await api.get(`/reports/sold-cars?${params.toString()}`);
    return response.data;
  }
};
