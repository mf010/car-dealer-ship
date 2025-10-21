import { Modal, Badge, Button } from 'flowbite-react';
import { HiX, HiClock, HiCheckCircle } from 'react-icons/hi';
import type { DealerShipExpense } from '../../models/DealerShipExpenses';

interface ExpenseInfoModalProps {
  expense: DealerShipExpense;
  onClose: () => void;
}

export function ExpenseInfoModal({ expense, onClose }: ExpenseInfoModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal show onClose={onClose} size="3xl">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Expense Details
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
        <div className="p-6 space-y-6">
          {/* Expense Details Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Expense Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expense ID</p>
                <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                  #{expense.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(expense.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expense Date</p>
                <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                  {formatDate(expense.expense_date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <div className="mt-1">
                  <Badge color="info" size="sm">
                    Recorded
                  </Badge>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                <p className="mt-1 text-base text-gray-900 dark:text-white whitespace-pre-wrap">
                  {expense.description}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Expense Timeline
            </h4>
            <div className="space-y-4">
              {/* Expense Incurred */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <HiCheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Expense Incurred
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(expense.expense_date)}
                  </p>
                </div>
              </div>

              {/* Expense Recorded */}
              {expense.created_at && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                      <HiClock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Expense Recorded in System
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDateTime(expense.created_at)}
                    </p>
                  </div>
                </div>
              )}

              {/* Last Updated */}
              {expense.updated_at && expense.updated_at !== expense.created_at && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <HiClock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Last Updated
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDateTime(expense.updated_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button color="gray" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
