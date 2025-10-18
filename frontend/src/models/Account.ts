export interface Account {
  id: number;
  name: string;
  phone?: string | null;
  balance: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CreateAccountDTO {
  name: string;
  phone?: string;
  balance?: number;
}

export interface UpdateAccountDTO {
  name?: string;
  phone?: string;
  balance?: number;
}

export interface AccountFilters {
  name?: string;
  phone?: string;
  // Add any other filter parameters you need
}

export interface BalanceUpdateDTO {
  amount: number;
}
