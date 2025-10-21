import { useState } from 'react';
import { Modal, Button, Label, TextInput, Textarea } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import { dealerShipExpenseServices } from '../../services/dealerShipExpensServices';
import type { DealerShipExpense, UpdateDealerShipExpenseDTO } from '../../models/DealerShipExpenses';

interface ExpenseUpdateProps {
  expense: DealerShipExpense;
  onClose: () => void;
  onSuccess: () => void;
}

export function ExpenseUpdate({ expense, onClose, onSuccess }: ExpenseUpdateProps) {
  const [formData, setFormData] = useState<UpdateDealerShipExpenseDTO>({
    description: expense.description,
    amount: expense.amount,
    expense_date: expense.expense_date,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.amount || formData.amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!formData.description?.trim()) {
      setError('Please enter a description');
      return;
    }
    if (!formData.expense_date) {
      setError('Please select an expense date');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await dealerShipExpenseServices.updateDealerShipExpense(expense.id, formData);
      onSuccess();
    } catch (err) {
      console.error('Error updating expense:', err);
      setError(err instanceof Error ? err.message : 'Failed to update expense');
      setLoading(false);
    }
  };

  return (
    <Modal show onClose={onClose} size="2xl">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit General Expense
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Expense ID: #{expense.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Amount */}
            <div>
              <Label htmlFor="amount">
                Amount <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter expense amount"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            {/* Expense Date */}
            <div>
              <Label htmlFor="expense_date">
                Expense Date <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="expense_date"
                type="date"
                value={formData.expense_date}
                onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Enter expense description (e.g., Office supplies, Utilities, Rent, Marketing)"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Provide details about the general business expense
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button color="gray" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Expense'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
