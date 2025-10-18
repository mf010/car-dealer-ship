import axios from 'axios';
import type { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO, InvoiceFilters, 
  PaymentUpdateDTO, PaymentAdjustDTO, AccountUpdateDTO, AccountCutUpdateDTO } from '../models/Invoice';
import type { PaginatedResponse } from '../models/Make';

const BASE_URL = '/api/invoices'; // Adjust this based on your API base URL

export const invoiceServices = {
  // Get all invoices with pagination and filtering
  getAllInvoices: async (page: number = 1, filters?: InvoiceFilters): Promise<PaginatedResponse<Invoice>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await axios.get<PaginatedResponse<Invoice>>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  // Create a new invoice
  createInvoice: async (invoiceData: CreateInvoiceDTO): Promise<Invoice> => {
    const response = await axios.post<Invoice>(BASE_URL, invoiceData);
    return response.data;
  },

  // Get a single invoice by ID
  getInvoiceById: async (id: number): Promise<Invoice> => {
    const response = await axios.get<Invoice>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Update an invoice
  updateInvoice: async (id: number, invoiceData: UpdateInvoiceDTO): Promise<Invoice> => {
    const response = await axios.put<Invoice>(`${BASE_URL}/${id}`, invoiceData);
    return response.data;
  },

  // Delete an invoice
  deleteInvoice: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },

  // Get all deleted invoices with pagination and filtering
  getDeletedInvoices: async (page: number = 1, filters?: InvoiceFilters): Promise<PaginatedResponse<Invoice>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }
    
    const response = await axios.get<PaginatedResponse<Invoice>>(`${BASE_URL}/deleted?${params.toString()}`);
    return response.data;
  },

  // Restore a deleted invoice
  restoreInvoice: async (id: number): Promise<Invoice> => {
    const response = await axios.post<Invoice>(`${BASE_URL}/${id}/restore`);
    return response.data;
  },

  // Mark invoice as paid
  markAsPaid: async (id: number): Promise<Invoice> => {
    const response = await axios.post<Invoice>(`${BASE_URL}/${id}/mark-as-paid`);
    return response.data;
  },

  // Get total account cut for an account
  getAccountCutTotal: async (accountId: number): Promise<{ total_account_cut: number }> => {
    const response = await axios.get<{ total_account_cut: number }>(`${BASE_URL}/account/${accountId}/total-cut`);
    return response.data;
  },

  // Get all unpaid invoices for a client
  getUnpaidInvoices: async (clientId: number): Promise<Invoice[]> => {
    const response = await axios.get<Invoice[]>(`${BASE_URL}/client/${clientId}/unpaid`);
    return response.data;
  },

  // Set account for an invoice
  setInvoiceAccount: async (id: number, data: AccountUpdateDTO): Promise<Invoice> => {
    const response = await axios.post<Invoice>(`${BASE_URL}/${id}/set-account`, data);
    return response.data;
  },

  // Set account cut value
  setAccountCutValue: async (id: number, data: AccountCutUpdateDTO): Promise<Invoice> => {
    const response = await axios.post<Invoice>(`${BASE_URL}/${id}/set-account-cut`, data);
    return response.data;
  },

  // Add payment to invoice
  addPayment: async (id: number, data: PaymentUpdateDTO): Promise<Invoice> => {
    const response = await axios.post<Invoice>(`${BASE_URL}/${id}/add-payment`, data);
    return response.data;
  },

  // Remove payment from invoice
  removePayment: async (id: number, data: PaymentUpdateDTO): Promise<Invoice> => {
    const response = await axios.post<Invoice>(`${BASE_URL}/${id}/remove-payment`, data);
    return response.data;
  },

  // Update payment amount
  updatePayment: async (id: number, data: PaymentAdjustDTO): Promise<Invoice> => {
    const response = await axios.post<Invoice>(`${BASE_URL}/${id}/update-payment`, data);
    return response.data;
  }
};
