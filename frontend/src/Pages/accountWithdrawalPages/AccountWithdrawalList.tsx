import { useState, useEffect } from 'react';
import { Button, Badge, Pagination, Spinner } from 'flowbite-react';
import { HiPlus, HiEye, HiPencil, HiTrash, HiFilter } from 'react-icons/hi';
import { accountWithdrawalServices } from '../../services/accountWithdrawalServices';
import { accountServices } from '../../services/accountServices';
import type { AccountWithdrawal, AccountWithdrawalFilters } from '../../models/AccountWithdrawal';
import type { Account } from '../../models/Account';
import { AccountWithdrawalForm } from './AccountWithdrawalForm';
import { AccountWithdrawalUpdate } from './AccountWithdrawalUpdate';
import { AccountWithdrawalInfoModal } from './AccountWithdrawalInfoModal';

export function AccountWithdrawalList() {
  const [withdrawals, setWithdrawals] = useState<AccountWithdrawal[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<AccountWithdrawal | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AccountWithdrawalFilters>({});

  useEffect(() => {
    fetchWithdrawals();
    fetchAccounts();
  }, [currentPage, filters]);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const response = await accountWithdrawalServices.getAllWithdrawals(currentPage, filters);
      setWithdrawals(response.data);
      setTotalPages(response.last_page);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await accountServices.getAllAccounts(1, {});
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this withdrawal?')) {
      try {
        await accountWithdrawalServices.deleteWithdrawal(id);
        fetchWithdrawals();
      } catch (error) {
        console.error('Error deleting withdrawal:', error);
      }
    }
  };

  const handleView = (withdrawal: AccountWithdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowInfoModal(true);
  };

  const handleEdit = (withdrawal: AccountWithdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowUpdateModal(true);
  };

  const handleFilterChange = (key: keyof AccountWithdrawalFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Account Withdrawals
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage employee account withdrawals and track balances
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            color="light"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <HiFilter className="h-5 w-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <HiPlus className="h-5 w-5" />
            Add Withdrawal
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Account Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account
              </label>
              <select
                value={filters.account_id || ''}
                onChange={(e) =>
                  handleFilterChange('account_id', e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Accounts</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Withdrawal Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Withdrawal Date
              </label>
              <input
                type="date"
                value={filters.withdrawal_date || ''}
                onChange={(e) => handleFilterChange('withdrawal_date', e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Min Amount Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Amount
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={filters.min_amount || ''}
                onChange={(e) =>
                  handleFilterChange('min_amount', e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Max Amount Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Amount
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={filters.max_amount || ''}
                onChange={(e) =>
                  handleFilterChange('max_amount', e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">
            <Button color="light" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">No withdrawals found</p>
            <p className="text-sm mt-2">Try adjusting your filters or add a new withdrawal</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Withdrawal ID</th>
                  <th scope="col" className="px-6 py-3">Account</th>
                  <th scope="col" className="px-6 py-3">Amount</th>
                  <th scope="col" className="px-6 py-3">Withdrawal Date</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr
                    key={withdrawal.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      #{withdrawal.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {withdrawal.account?.name || 'N/A'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {withdrawal.account?.phone || 'No phone'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(withdrawal.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatDate(withdrawal.withdrawal_date)}</td>
                    <td className="px-6 py-4">
                      <Badge color="success" size="sm">
                        Completed
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          color="info"
                          onClick={() => handleView(withdrawal)}
                          className="flex items-center gap-1"
                        >
                          <HiEye className="h-4 w-4" />
                          View
                        </Button>
                        <Button
                          size="xs"
                          color="gray"
                          onClick={() => handleEdit(withdrawal)}
                          className="flex items-center gap-1"
                        >
                          <HiPencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => handleDelete(withdrawal.id)}
                          className="flex items-center gap-1"
                        >
                          <HiTrash className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center p-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showIcons
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AccountWithdrawalForm
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchWithdrawals();
          }}
        />
      )}

      {showUpdateModal && selectedWithdrawal && (
        <AccountWithdrawalUpdate
          withdrawal={selectedWithdrawal}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedWithdrawal(null);
          }}
          onSuccess={() => {
            setShowUpdateModal(false);
            setSelectedWithdrawal(null);
            fetchWithdrawals();
          }}
        />
      )}

      {showInfoModal && selectedWithdrawal && (
        <AccountWithdrawalInfoModal
          withdrawal={selectedWithdrawal}
          onClose={() => {
            setShowInfoModal(false);
            setSelectedWithdrawal(null);
          }}
        />
      )}
    </div>
  );
}
