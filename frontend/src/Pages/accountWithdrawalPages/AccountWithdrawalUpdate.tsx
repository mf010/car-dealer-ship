import { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput, Spinner } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import { accountWithdrawalServices } from '../../services/accountWithdrawalServices';
import { accountServices } from '../../services/accountServices';
import type { AccountWithdrawal, UpdateAccountWithdrawalDTO } from '../../models/AccountWithdrawal';
import type { Account } from '../../models/Account';

interface AccountWithdrawalUpdateProps {
  withdrawal: AccountWithdrawal;
  onClose: () => void;
  onSuccess: () => void;
}

export function AccountWithdrawalUpdate({ withdrawal, onClose, onSuccess }: AccountWithdrawalUpdateProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<UpdateAccountWithdrawalDTO>({
    account_id: withdrawal.account_id,
    amount: withdrawal.amount,
    withdrawal_date: withdrawal.withdrawal_date,
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const response = await accountServices.getAllAccounts(1, {});
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.account_id || formData.account_id === 0) {
      newErrors.account_id = 'Please select an account';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.withdrawal_date) {
      newErrors.withdrawal_date = 'Withdrawal date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await accountWithdrawalServices.updateWithdrawal(withdrawal.id, formData);
      onSuccess();
    } catch (error) {
      console.error('Error updating withdrawal:', error);
      setErrors({ submit: 'Failed to update withdrawal. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof UpdateAccountWithdrawalDTO, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const selectedAccount = accounts.find((acc) => acc.id === formData.account_id);

  return (
    <Modal show onClose={onClose} size="lg">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Withdrawal #{withdrawal.id}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Account Selection */}
          <div>
            <Label htmlFor="account_id" className="mb-2 block">
              Account *
            </Label>
            {loadingAccounts ? (
              <div className="flex items-center justify-center p-4">
                <Spinner size="md" />
              </div>
            ) : (
              <select
                id="account_id"
                value={formData.account_id}
                onChange={(e) => handleInputChange('account_id', Number(e.target.value))}
                className={`w-full rounded-lg border ${
                  errors.account_id
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                } dark:bg-gray-700 dark:text-white`}
              >
                <option value={0}>Select an account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} - Balance: {formatCurrency(account.balance || 0)}
                  </option>
                ))}
              </select>
            )}
            {errors.account_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.account_id}</p>
            )}
          </div>

          {/* Account Balance Display */}
          {selectedAccount && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  Current Balance:
                </span>
                <span className={`text-lg font-bold ${
                  (selectedAccount.balance || 0) >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatCurrency(selectedAccount.balance || 0)}
                </span>
              </div>
            </div>
          )}

          {/* Amount */}
          <div>
            <Label htmlFor="amount" className="mb-2 block">
              Amount *
            </Label>
            <TextInput
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount || ''}
              onChange={(e) => handleInputChange('amount', Number(e.target.value))}
              color={errors.amount ? 'failure' : 'gray'}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
            )}
          </div>

          {/* Withdrawal Date */}
          <div>
            <Label htmlFor="withdrawal_date" className="mb-2 block">
              Withdrawal Date *
            </Label>
            <TextInput
              id="withdrawal_date"
              type="date"
              value={formData.withdrawal_date}
              onChange={(e) => handleInputChange('withdrawal_date', e.target.value)}
              color={errors.withdrawal_date ? 'failure' : 'gray'}
            />
            {errors.withdrawal_date && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.withdrawal_date}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button color="gray" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Updating...
                </>
              ) : (
                'Update Withdrawal'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
