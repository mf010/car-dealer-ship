import type { Invoice } from './Invoice';

export interface Payment {
  id: number;
  invoice_id: number;
  amount: number;
  payment_date: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  
  // Relations
  invoice?: Invoice; // Will include nested client and car due to eager loading
}

export interface CreatePaymentDTO {
  invoice_id: number;
  amount: number;
  payment_date: string;
}

export interface UpdatePaymentDTO {
  invoice_id?: number;
  amount?: number;
  payment_date?: string;
}

export interface PaymentFilters {
  invoice_id?: number;
  payment_date?: string;
  min_amount?: number;
  max_amount?: number;
  // Add any other filter parameters you need
}
