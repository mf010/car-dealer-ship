export interface DealerShipExpense {
  id: number;
  description: string;
  amount: number;
  expense_date: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CreateDealerShipExpenseDTO {
  description: string;
  amount: number;
  expense_date: string;
}

export interface UpdateDealerShipExpenseDTO {
  description?: string;
  amount?: number;
  expense_date?: string;
}

export interface DealerShipExpenseFilters {
  description?: string;
  expense_date?: string;
  min_amount?: number;
  max_amount?: number;
  // Add any other filter parameters you need
}
