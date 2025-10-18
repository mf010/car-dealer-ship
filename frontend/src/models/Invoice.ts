import type { Client } from './Client';
import type { Account } from './Account';
import type { Car } from './Car';

export interface Invoice {
  id: number;
  client_id: number;
  account_id?: number | null;
  amount: number;
  invoice_date: string;
  car_id: number;
  payed: number;
  account_cut: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  
  // Relations
  client?: Client;
  account?: Account;
  car?: Car;  // Will include nested carModel.make due to eager loading
}

export interface CreateInvoiceDTO {
  client_id: number;
  account_id?: number;
  amount: number;
  invoice_date: string;
  car_id: number;
  payed: number;
  account_cut: number;
}

export interface UpdateInvoiceDTO {
  client_id?: number;
  account_id?: number;
  amount?: number;
  invoice_date?: string;
  car_id?: number;
  payed?: number;
  account_cut?: number;
}

export interface InvoiceFilters {
  client_id?: number;
  account_id?: number;
  car_id?: number;
  invoice_date?: string;
  paid?: boolean;
  // Add any other filter parameters you need
}

export interface PaymentUpdateDTO {
  amount: number;
}

export interface PaymentAdjustDTO {
  old_amount: number;
  new_amount: number;
}

export interface AccountUpdateDTO {
  account_id: number;
}

export interface AccountCutUpdateDTO {
  account_cut: number;
}
