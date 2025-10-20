import api from '../helper/api';
import type { Payment, CreatePaymentDTO, UpdatePaymentDTO, PaymentFilters } from '../models/Payment';
import type { PaginatedResponse } from '../models/Make';

const BASE_URL = '/api/payments'; // Adjust this based on your API base URL

export const paymentServices = {
  // Get all payments with pagination and filtering
  getAllPayments: async (page: number = 1, filters?: PaymentFilters): Promise<PaginatedResponse<Payment>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await api.get<PaginatedResponse<Payment>>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  // Create a new payment
  createPayment: async (paymentData: CreatePaymentDTO): Promise<Payment> => {
    const response = await api.post<Payment>(BASE_URL, paymentData);
    return response.data;
  },

  // Get a single payment by ID
  getPaymentById: async (id: number): Promise<Payment> => {
    const response = await api.get<Payment>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Update a payment
  updatePayment: async (id: number, paymentData: UpdatePaymentDTO): Promise<Payment> => {
    const response = await api.put<Payment>(`${BASE_URL}/${id}`, paymentData);
    return response.data;
  },

  // Delete a payment
  deletePayment: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Get all deleted payments with pagination and filtering
  getDeletedPayments: async (page: number = 1, filters?: PaymentFilters): Promise<PaginatedResponse<Payment>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await api.get<PaginatedResponse<Payment>>(`${BASE_URL}/deleted?${params.toString()}`);
    return response.data;
  },

  // Restore a deleted payment
  restorePayment: async (id: number): Promise<Payment> => {
    const response = await api.post<Payment>(`${BASE_URL}/${id}/restore`);
    return response.data;
  }
};
