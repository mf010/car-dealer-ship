
import type { Account } from './Account';

export interface AccountWithdrawal {
  id: number;
  account_id: number;
  amount: number;
  withdrawal_date: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  
  // Relations
  account?: Account;
}

export interface CreateAccountWithdrawalDTO {
  account_id: number;
  amount: number;
  withdrawal_date: string;
}

export interface UpdateAccountWithdrawalDTO {
  account_id?: number;
  amount?: number;
  withdrawal_date?: string;
}

export interface AccountWithdrawalFilters {
  account_id?: number;
  withdrawal_date?: string;
  min_amount?: number;
  max_amount?: number;
  // Add any other filter parameters you need
}