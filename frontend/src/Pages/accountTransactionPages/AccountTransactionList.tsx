import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Badge, Pagination, Spinner } from 'flowbite-react';
import { HiEye, HiPencil, HiTrash, HiFilter, HiArrowDown, HiArrowUp } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

// Withdrawal imports
import { accountWithdrawalServices } from '../../services/accountWithdrawalServices';
import type { AccountWithdrawal, AccountWithdrawalFilters } from '../../models/AccountWithdrawal';
import { AccountWithdrawalForm } from '../accountWithdrawalPages/AccountWithdrawalForm';
import { AccountWithdrawalUpdate } from '../accountWithdrawalPages/AccountWithdrawalUpdate';
import { AccountWithdrawalInfoModal } from '../accountWithdrawalPages/AccountWithdrawalInfoModal';

// Deposit imports
import { accountDepositServices } from '../../services/accountDepositServices';
import type { AccountDeposit, AccountDepositFilters } from '../../models/AccountDeposit';
import { AccountDepositForm } from '../accountDepositPages/AccountDepositForm';
import { AccountDepositUpdate } from '../accountDepositPages/AccountDepositUpdate';
import { AccountDepositInfoModal } from '../accountDepositPages/AccountDepositInfoModal';

// Common imports
import { accountServices } from '../../services/accountServices';
import type { Account } from '../../models/Account';
import { formatCurrency as formatCurrencyUtil, formatDate as formatDateUtil } from '../../utils/formatters';

type TransactionType = 'withdrawals' | 'deposits';

export function AccountTransactionList() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<TransactionType>(() => {
    const tabParam = searchParams.get('tab');
    return tabParam === 'deposits' ? 'deposits' : 'withdrawals';
  });

  // Common state
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Withdrawal state
  const [withdrawals, setWithdrawals] = useState<AccountWithdrawal[]>([]);
  const [withdrawalPage, setWithdrawalPage] = useState(1);
  const [withdrawalTotalPages, setWithdrawalTotalPages] = useState(1);
  const [withdrawalFilters, setWithdrawalFilters] = useState<AccountWithdrawalFilters>({});
  const [showAddWithdrawalModal, setShowAddWithdrawalModal] = useState(false);
  const [showUpdateWithdrawalModal, setShowUpdateWithdrawalModal] = useState(false);
  const [showWithdrawalInfoModal, setShowWithdrawalInfoModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<AccountWithdrawal | null>(null);

  // Deposit state
  const [deposits, setDeposits] = useState<AccountDeposit[]>([]);
  const [depositPage, setDepositPage] = useState(1);
  const [depositTotalPages, setDepositTotalPages] = useState(1);
  const [depositFilters, setDepositFilters] = useState<AccountDepositFilters>({});
  const [showAddDepositModal, setShowAddDepositModal] = useState(false);
  const [showUpdateDepositModal, setShowUpdateDepositModal] = useState(false);
  const [showDepositInfoModal, setShowDepositInfoModal] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<AccountDeposit | null>(null);

  // Initialize filters from URL
  useEffect(() => {
    const accountIdParam = searchParams.get('account_id');
    if (accountIdParam) {
      const accountId = Number(accountIdParam);
      if (!isNaN(accountId)) {
        setWithdrawalFilters(prev => ({ ...prev, account_id: accountId }));
        setDepositFilters(prev => ({ ...prev, account_id: accountId }));
        setShowFilters(true);
      }
    }
  }, [searchParams]);

  // Fetch accounts on mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'withdrawals') {
      fetchWithdrawals();
    } else {
      fetchDeposits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, withdrawalPage, depositPage, withdrawalFilters, depositFilters]);

  // Update URL when tab changes
  const handleTabChange = (tab: TransactionType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const fetchAccounts = async () => {
    try {
      const response = await accountServices.getAllAccounts(1, {});
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  // ========== WITHDRAWAL FUNCTIONS ==========
  const fetchWithdrawals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountWithdrawalServices.getAllWithdrawals(withdrawalPage, withdrawalFilters);
      setWithdrawals(response.data);
      setWithdrawalTotalPages(response.last_page);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      setError(t('messages.loadingError'));
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWithdrawal = async (id: number) => {
    if (window.confirm(t('messages.confirmDeleteWithdrawal'))) {
      try {
        await accountWithdrawalServices.deleteWithdrawal(id);
        fetchWithdrawals();
      } catch (error) {
        console.error('Error deleting withdrawal:', error);
      }
    }
  };

  const handleViewWithdrawal = (withdrawal: AccountWithdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowWithdrawalInfoModal(true);
  };

  const handleEditWithdrawal = (withdrawal: AccountWithdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowUpdateWithdrawalModal(true);
  };

  const handleWithdrawalFilterChange = (key: keyof AccountWithdrawalFilters, value: any) => {
    setWithdrawalFilters(prev => ({ ...prev, [key]: value || undefined }));
    setWithdrawalPage(1);
  };

  // ========== DEPOSIT FUNCTIONS ==========
  const fetchDeposits = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountDepositServices.getAllDeposits(depositPage, depositFilters);
      setDeposits(response.data);
      setDepositTotalPages(response.last_page);
    } catch (error) {
      console.error('Error fetching deposits:', error);
      setError(t('messages.loadingError'));
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDeposit = async (id: number) => {
    if (window.confirm(t('messages.confirmDeleteDeposit'))) {
      try {
        await accountDepositServices.deleteDeposit(id);
        fetchDeposits();
      } catch (error) {
        console.error('Error deleting deposit:', error);
      }
    }
  };

  const handleViewDeposit = (deposit: AccountDeposit) => {
    setSelectedDeposit(deposit);
    setShowDepositInfoModal(true);
  };

  const handleEditDeposit = (deposit: AccountDeposit) => {
    setSelectedDeposit(deposit);
    setShowUpdateDepositModal(true);
  };

  const handleDepositFilterChange = (key: keyof AccountDepositFilters, value: any) => {
    setDepositFilters(prev => ({ ...prev, [key]: value || undefined }));
    setDepositPage(1);
  };

  // ========== COMMON FUNCTIONS ==========
  const clearFilters = () => {
    if (activeTab === 'withdrawals') {
      setWithdrawalFilters({});
      setWithdrawalPage(1);
    } else {
      setDepositFilters({});
      setDepositPage(1);
    }
  };

  const formatCurrency = (amount: number) => formatCurrencyUtil(amount, i18n.language);
  const formatDate = (dateString: string) => formatDateUtil(dateString, i18n.language);

  const currentFilters = activeTab === 'withdrawals' ? withdrawalFilters : depositFilters;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('accountTransaction.management')}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('accountTransaction.managementDescription')}
          </p>
          {/* Show filtered account info */}
          {currentFilters.account_id && (
            <div className="mt-2">
              <Badge color="info" size="sm">
                {t('accountTransaction.filteredByAccount', { 
                  account: accounts.find(a => a.id === currentFilters.account_id)?.name || `#${currentFilters.account_id}` 
                })}
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
          {activeTab === 'withdrawals' ? (
            <Button
              onClick={() => setShowAddWithdrawalModal(true)}
              className="flex items-center gap-2"
              color="failure"
            >
              <HiArrowUp className="h-5 w-5" />
              {t('accountTransaction.addWithdrawal')}
            </Button>
          ) : (
            <Button
              onClick={() => setShowAddDepositModal(true)}
              className="flex items-center gap-2"
              color="success"
            >
              <HiArrowDown className="h-5 w-5" />
              {t('accountTransaction.addDeposit')}
            </Button>
          )}
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

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li className="mr-2">
              <button
                onClick={() => handleTabChange('withdrawals')}
                className={`inline-flex items-center gap-2 p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'withdrawals'
                    ? 'text-red-600 border-red-600 dark:text-red-500 dark:border-red-500'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                <HiArrowUp className="h-5 w-5" />
                <span>{t('accountTransaction.withdrawals')}</span>
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => handleTabChange('deposits')}
                className={`inline-flex items-center gap-2 p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'deposits'
                    ? 'text-green-600 border-green-600 dark:text-green-500 dark:border-green-500'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                <HiArrowDown className="h-5 w-5" />
                <span>{t('accountTransaction.deposits')}</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Withdrawals Tab Content */}
        {activeTab === 'withdrawals' && (
          <div className="p-4">
            {/* Filters Panel for Withdrawals */}
            {showFilters && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('account.account')}
                    </label>
                    <select
                      value={withdrawalFilters.account_id || ''}
                      onChange={(e) => handleWithdrawalFilterChange('account_id', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">{t('account.allAccounts')}</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('accountWithdrawal.withdrawalDate')}
                    </label>
                    <input
                      type="date"
                      value={withdrawalFilters.withdrawal_date || ''}
                      onChange={(e) => handleWithdrawalFilterChange('withdrawal_date', e.target.value)}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('financial.amountFrom')}
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={withdrawalFilters.amount_from || ''}
                      onChange={(e) => handleWithdrawalFilterChange('amount_from', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('financial.amountTo')}
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={withdrawalFilters.amount_to || ''}
                      onChange={(e) => handleWithdrawalFilterChange('amount_to', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button color="light" size="sm" onClick={clearFilters}>
                    {t('common.clearFilters')}
                  </Button>
                </div>
              </div>
            )}

            {/* Withdrawals Table */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="xl" />
              </div>
            ) : !withdrawals || withdrawals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <HiArrowUp className="h-16 w-16 mb-4 text-gray-300" />
                <p className="text-lg font-medium">{t('accountWithdrawal.noWithdrawalsFound')}</p>
                <p className="text-sm mt-2">{t('accountWithdrawal.noWithdrawalsFoundDescription')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">{t('accountWithdrawal.withdrawalId')}</th>
                      <th scope="col" className="px-6 py-3">{t('account.account')}</th>
                      <th scope="col" className="px-6 py-3">{t('accountWithdrawal.amount')}</th>
                      <th scope="col" className="px-6 py-3">{t('accountWithdrawal.withdrawalDate')}</th>
                      <th scope="col" className="px-6 py-3">{t('common.status')}</th>
                      <th scope="col" className="px-6 py-3">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{withdrawal.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-white">{withdrawal.account?.name || t('common.notAvailable')}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{withdrawal.account?.phone || t('account.noPhone')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-red-600 dark:text-red-400">-{formatCurrency(withdrawal.amount)}</span>
                        </td>
                        <td className="px-6 py-4">{formatDate(withdrawal.withdrawal_date)}</td>
                        <td className="px-6 py-4">
                          <Badge color="failure" size="sm">{t('accountTransaction.withdrawal')}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button size="xs" color="info" onClick={() => handleViewWithdrawal(withdrawal)}>
                              <HiEye className="h-4 w-4" />
                            </Button>
                            <Button size="xs" color="gray" onClick={() => handleEditWithdrawal(withdrawal)}>
                              <HiPencil className="h-4 w-4" />
                            </Button>
                            <Button size="xs" color="failure" onClick={() => handleDeleteWithdrawal(withdrawal.id)}>
                              <HiTrash className="h-4 w-4" />
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
            {withdrawalTotalPages > 1 && (
              <div className="flex justify-center items-center p-4 border-t border-gray-200 dark:border-gray-700">
                <Pagination
                  currentPage={withdrawalPage}
                  totalPages={withdrawalTotalPages}
                  onPageChange={setWithdrawalPage}
                  showIcons
                />
              </div>
            )}
          </div>
        )}

        {/* Deposits Tab Content */}
        {activeTab === 'deposits' && (
          <div className="p-4">
            {/* Filters Panel for Deposits */}
            {showFilters && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('account.account')}
                    </label>
                    <select
                      value={depositFilters.account_id || ''}
                      onChange={(e) => handleDepositFilterChange('account_id', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">{t('account.allAccounts')}</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('accountDeposit.depositDate')}
                    </label>
                    <input
                      type="date"
                      value={depositFilters.deposit_date || ''}
                      onChange={(e) => handleDepositFilterChange('deposit_date', e.target.value)}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('financial.amountFrom')}
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={depositFilters.amount_from || ''}
                      onChange={(e) => handleDepositFilterChange('amount_from', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('financial.amountTo')}
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={depositFilters.amount_to || ''}
                      onChange={(e) => handleDepositFilterChange('amount_to', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button color="light" size="sm" onClick={clearFilters}>
                    {t('common.clearFilters')}
                  </Button>
                </div>
              </div>
            )}

            {/* Deposits Table */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="xl" />
              </div>
            ) : !deposits || deposits.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <HiArrowDown className="h-16 w-16 mb-4 text-gray-300" />
                <p className="text-lg font-medium">{t('accountDeposit.noDepositsFound')}</p>
                <p className="text-sm mt-2">{t('accountDeposit.noDepositsFoundDescription')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                    {deposits.map((deposit) => (
                      <tr key={deposit.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{deposit.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-white">{deposit.account?.name || t('common.notAvailable')}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{deposit.account?.phone || t('account.noPhone')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-green-600 dark:text-green-400">+{formatCurrency(deposit.amount)}</span>
                        </td>
                        <td className="px-6 py-4">{formatDate(deposit.deposit_date)}</td>
                        <td className="px-6 py-4">
                          <Badge color="success" size="sm">{t('accountTransaction.deposit')}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button size="xs" color="info" onClick={() => handleViewDeposit(deposit)}>
                              <HiEye className="h-4 w-4" />
                            </Button>
                            <Button size="xs" color="gray" onClick={() => handleEditDeposit(deposit)}>
                              <HiPencil className="h-4 w-4" />
                            </Button>
                            <Button size="xs" color="failure" onClick={() => handleDeleteDeposit(deposit.id)}>
                              <HiTrash className="h-4 w-4" />
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
            {depositTotalPages > 1 && (
              <div className="flex justify-center items-center p-4 border-t border-gray-200 dark:border-gray-700">
                <Pagination
                  currentPage={depositPage}
                  totalPages={depositTotalPages}
                  onPageChange={setDepositPage}
                  showIcons
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Withdrawal Modals */}
      {showAddWithdrawalModal && (
        <AccountWithdrawalForm
          onClose={() => setShowAddWithdrawalModal(false)}
          onSuccess={() => {
            setShowAddWithdrawalModal(false);
            fetchWithdrawals();
          }}
        />
      )}

      {showUpdateWithdrawalModal && selectedWithdrawal && (
        <AccountWithdrawalUpdate
          withdrawal={selectedWithdrawal}
          onClose={() => {
            setShowUpdateWithdrawalModal(false);
            setSelectedWithdrawal(null);
          }}
          onSuccess={() => {
            setShowUpdateWithdrawalModal(false);
            setSelectedWithdrawal(null);
            fetchWithdrawals();
          }}
        />
      )}

      {showWithdrawalInfoModal && selectedWithdrawal && (
        <AccountWithdrawalInfoModal
          withdrawal={selectedWithdrawal}
          onClose={() => {
            setShowWithdrawalInfoModal(false);
            setSelectedWithdrawal(null);
          }}
        />
      )}

      {/* Deposit Modals */}
      {showAddDepositModal && (
        <AccountDepositForm
          onClose={() => setShowAddDepositModal(false)}
          onSuccess={() => {
            setShowAddDepositModal(false);
            fetchDeposits();
          }}
        />
      )}

      {showUpdateDepositModal && selectedDeposit && (
        <AccountDepositUpdate
          deposit={selectedDeposit}
          onClose={() => {
            setShowUpdateDepositModal(false);
            setSelectedDeposit(null);
          }}
          onSuccess={() => {
            setShowUpdateDepositModal(false);
            setSelectedDeposit(null);
            fetchDeposits();
          }}
        />
      )}

      {showDepositInfoModal && selectedDeposit && (
        <AccountDepositInfoModal
          deposit={selectedDeposit}
          onClose={() => {
            setShowDepositInfoModal(false);
            setSelectedDeposit(null);
          }}
        />
      )}
    </div>
  );
}
