import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Badge, Pagination, Spinner } from 'flowbite-react';
import { HiPlus, HiEye, HiPencil, HiTrash, HiFilter } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { accountDepositServices } from '../../services/accountDepositServices';
import { accountServices } from '../../services/accountServices';
import type { AccountDeposit, AccountDepositFilters } from '../../models/AccountDeposit';
import type { Account } from '../../models/Account';
import { AccountDepositForm } from './AccountDepositForm';
import { AccountDepositUpdate } from './AccountDepositUpdate.tsx';
import { AccountDepositInfoModal } from './AccountDepositInfoModal';
import { formatCurrency as formatCurrencyUtil, formatDate as formatDateUtil } from '../../utils/formatters';

export function AccountDepositList() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const [deposits, setDeposits] = useState<AccountDeposit[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<AccountDeposit | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AccountDepositFilters>({});

  // Initialize filters from URL query parameters
  useEffect(() => {
    const accountIdParam = searchParams.get('account_id');
    if (accountIdParam) {
      const accountId = Number(accountIdParam);
      if (!isNaN(accountId)) {
        setFilters(prev => ({ ...prev, account_id: accountId }));
        setShowFilters(true);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDeposits();
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  const fetchDeposits = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountDepositServices.getAllDeposits(currentPage, filters);
      setDeposits(response.data);
      setTotalPages(response.last_page);
    } catch (error) {
      console.error('Error fetching deposits:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch deposits. Please check if the API server is running.';
      setError(errorMessage);
      setDeposits([]);
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
    if (window.confirm(t('messages.confirmDeleteDeposit'))) {
      try {
        await accountDepositServices.deleteDeposit(id);
        fetchDeposits();
      } catch (error) {
        console.error('Error deleting deposit:', error);
      }
    }
  };

  const handleView = (deposit: AccountDeposit) => {
    setSelectedDeposit(deposit);
    setShowInfoModal(true);
  };

  const handleEdit = (deposit: AccountDeposit) => {
    setSelectedDeposit(deposit);
    setShowUpdateModal(true);
  };

  const handleFilterChange = (key: keyof AccountDepositFilters, value: any) => {
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
    return formatCurrencyUtil(amount, i18n.language);
  };

  const formatDate = (dateString: string) => {
    return formatDateUtil(dateString, i18n.language);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('accountDeposit.management')}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('accountDeposit.managementDescription')}
          </p>
          {/* Show filtered account info */}
          {filters.account_id && (
            <div className="mt-2">
              <Badge color="info" size="sm">
                {t('accountDeposit.filteredByAccount', { account: accounts.find(a => a.id === filters.account_id)?.name || `#${filters.account_id}` })}
              </Badge>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            color="light"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <HiFilter className="h-5 w-5" />
            {showFilters ? t('common.hideFilters') : t('common.showFilters')}
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
            color="success"
          >
            <HiPlus className="h-5 w-5" />
            {t('accountDeposit.addDeposit')}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{t('common.error')}:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Account Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('account.account')}
              </label>
              <select
                value={filters.account_id || ''}
                onChange={(e) =>
                  handleFilterChange('account_id', e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{t('account.allAccounts')}</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Deposit Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('accountDeposit.depositDate')}
              </label>
              <input
                type="date"
                value={filters.deposit_date || ''}
                onChange={(e) => handleFilterChange('deposit_date', e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Amount From Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('financial.amountFrom')}
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={filters.amount_from || ''}
                onChange={(e) =>
                  handleFilterChange('amount_from', e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Amount To Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('financial.amountTo')}
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={filters.amount_to || ''}
                onChange={(e) =>
                  handleFilterChange('amount_to', e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">
            <Button color="light" size="sm" onClick={clearFilters}>
              {t('common.clearFilters')}
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
        ) : !deposits || deposits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">{t('accountDeposit.noDepositsFound')}</p>
            <p className="text-sm mt-2">{t('accountDeposit.noDepositsFoundDescription')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">{t('accountDeposit.depositId')}</th>
                  <th scope="col" className="px-6 py-3">{t('account.account')}</th>
                  <th scope="col" className="px-6 py-3">{t('accountDeposit.amount')}</th>
                  <th scope="col" className="px-6 py-3">{t('accountDeposit.depositDate')}</th>
                  <th scope="col" className="px-6 py-3">{t('common.status')}</th>
                  <th scope="col" className="px-6 py-3">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {deposits?.map((deposit) => (
                  <tr
                    key={deposit.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      #{deposit.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {deposit.account?.name || t('common.notAvailable')}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {deposit.account?.phone || t('account.noPhone')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        +{formatCurrency(deposit.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatDate(deposit.deposit_date)}</td>
                    <td className="px-6 py-4">
                      <Badge color="success" size="sm">
                        {t('accountDeposit.completed')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          color="info"
                          onClick={() => handleView(deposit)}
                          className="flex items-center gap-1"
                        >
                          <HiEye className="h-4 w-4" />
                          {t('common.view')}
                        </Button>
                        <Button
                          size="xs"
                          color="gray"
                          onClick={() => handleEdit(deposit)}
                          className="flex items-center gap-1"
                        >
                          <HiPencil className="h-4 w-4" />
                          {t('common.edit')}
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => handleDelete(deposit.id)}
                          className="flex items-center gap-1"
                        >
                          <HiTrash className="h-4 w-4" />
                          {t('common.delete')}
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
        <AccountDepositForm
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchDeposits();
          }}
        />
      )}

      {showUpdateModal && selectedDeposit && (
        <AccountDepositUpdate
          deposit={selectedDeposit}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedDeposit(null);
          }}
          onSuccess={() => {
            setShowUpdateModal(false);
            setSelectedDeposit(null);
            fetchDeposits();
          }}
        />
      )}

      {showInfoModal && selectedDeposit && (
        <AccountDepositInfoModal
          deposit={selectedDeposit}
          onClose={() => {
            setShowInfoModal(false);
            setSelectedDeposit(null);
          }}
        />
      )}
    </div>
  );
}
