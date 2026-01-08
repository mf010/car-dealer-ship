
import type { Account } from './Account';

export interface AccountDeposit {
  id: number;
  account_id: number;
  amount: number;
  deposit_date: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  
  // Relations
  account?: Account;
}

export interface CreateAccountDepositDTO {
  account_id: number;
  amount: number;
  deposit_date: string;
}

export interface UpdateAccountDepositDTO {
  account_id?: number;
  amount?: number;
  deposit_date?: string;
}

export interface AccountDepositFilters {
  account_id?: number;
  deposit_date?: string;
  amount_from?: number;
  amount_to?: number;
}
