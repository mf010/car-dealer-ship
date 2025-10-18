export interface Client {
  id: number;
  name: string;
  phone?: string | null;
  personal_id?: string | null;
  address?: string | null;
  balance: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CreateClientDTO {
  name: string;
  phone?: string;
  personal_id?: string;
  address?: string;
  balance?: number;
}

export interface UpdateClientDTO {
  name?: string;
  phone?: string;
  personal_id?: string;
  address?: string;
  balance?: number;
}

export interface ClientFilters {
  name?: string;
  phone?: string;
  personal_id?: string;
  // Add any other filter parameters you need
}

export interface BalanceUpdateDTO {
  amount: number;
}
