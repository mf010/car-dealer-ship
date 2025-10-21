import { Modal, Badge, Button } from 'flowbite-react';
import { HiX, HiUser, HiClock, HiCheckCircle } from 'react-icons/hi';
import type { AccountWithdrawal } from '../../models/AccountWithdrawal';

interface AccountWithdrawalInfoModalProps {
  withdrawal: AccountWithdrawal;
  onClose: () => void;
}

export function AccountWithdrawalInfoModal({ withdrawal, onClose }: AccountWithdrawalInfoModalProps) {
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

  const handleViewAccount = () => {
    console.log('Navigate to Account #', withdrawal.account_id);
    alert(`Navigation to Account #${withdrawal.account_id} - Implementation pending`);
  };

  const account = withdrawal.account;

  return (
    <Modal show onClose={onClose} size="3xl">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Withdrawal Details
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Withdrawal ID: #{withdrawal.id}
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
          {/* Withdrawal Details Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Withdrawal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Withdrawal ID</p>
                <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                  #{withdrawal.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(withdrawal.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Withdrawal Date</p>
                <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                  {formatDate(withdrawal.withdrawal_date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <div className="mt-1">
                  <Badge color="success" size="sm">
                    Completed
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information Section */}
          {account && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-300">
                  Account Information
                </h4>
                <Button
                  size="sm"
                  color="blue"
                  onClick={handleViewAccount}
                  className="flex items-center gap-2"
                >
                  <HiUser className="h-4 w-4" />
                  View Account Details
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Account Name</p>
                  <p className="mt-1 text-base font-medium text-blue-900 dark:text-blue-300">
                    {account.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Phone</p>
                  <p className="mt-1 text-base font-medium text-blue-900 dark:text-blue-300">
                    {account.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Account ID</p>
                  <p className="mt-1 text-base font-medium text-blue-900 dark:text-blue-300">
                    #{account.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Current Balance</p>
                  <p className={`mt-1 text-lg font-bold ${
                    (account.balance || 0) >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(account.balance || 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Withdrawal Timeline
            </h4>
            <div className="space-y-4">
              {/* Withdrawal Processed */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <HiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Withdrawal Processed
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(withdrawal.withdrawal_date)}
                  </p>
                </div>
              </div>

              {/* Withdrawal Recorded */}
              {withdrawal.created_at && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <HiClock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Withdrawal Recorded
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDateTime(withdrawal.created_at)}
                    </p>
                  </div>
                </div>
              )}

              {/* Last Updated */}
              {withdrawal.updated_at && withdrawal.updated_at !== withdrawal.created_at && (
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
                      {formatDateTime(withdrawal.updated_at)}
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
