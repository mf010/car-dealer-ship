import { useState, useEffect, useRef } from 'react';
import { Modal, Button, Label, TextInput, Spinner } from 'flowbite-react';
import { HiX, HiSearch } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { accountDepositServices } from '../../services/accountDepositServices';
import { accountServices } from '../../services/accountServices';
import type { CreateAccountDepositDTO } from '../../models/AccountDeposit';
import type { Account } from '../../models/Account';
import { formatCurrency as formatCurrencyUtil } from '../../utils/formatters';

interface AccountDepositFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AccountDepositForm({ onClose, onSuccess }: AccountDepositFormProps) {
  const { t, i18n } = useTranslation();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<CreateAccountDepositDTO>({
    account_id: 0,
    amount: 0,
    deposit_date: new Date().toISOString().split('T')[0],
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search accounts when search term changes
  useEffect(() => {
    const searchAccounts = async () => {
      if (searchTerm.length >= 1) {
        setLoadingAccounts(true);
        try {
          const results = await accountServices.searchAccounts(searchTerm);
          setAccounts(results);
          setShowDropdown(true);
        } catch (error) {
          console.error('Error searching accounts:', error);
        } finally {
          setLoadingAccounts(false);
        }
      } else if (searchTerm.length === 0 && showDropdown) {
        // Load all accounts when search is empty and dropdown is open
        setLoadingAccounts(true);
        try {
          const results = await accountServices.searchAccounts('');
          setAccounts(results);
        } catch (error) {
          console.error('Error fetching accounts:', error);
        } finally {
          setLoadingAccounts(false);
        }
      }
    };

    const debounceTimer = setTimeout(searchAccounts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
    setFormData(prev => ({ ...prev, account_id: account.id }));
    setSearchTerm(account.name);
    setShowDropdown(false);
    // Clear error for this field
    if (errors.account_id) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.account_id;
        return newErrors;
      });
    }
  };

  const handleSearchFocus = async () => {
    setShowDropdown(true);
    if (accounts.length === 0) {
      setLoadingAccounts(true);
      try {
        const results = await accountServices.searchAccounts('');
        setAccounts(results);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoadingAccounts(false);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.account_id || formData.account_id === 0) {
      newErrors.account_id = t('validation.selectAccount');
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = t('validation.amountGreaterThanZero');
    }

    if (!formData.deposit_date) {
      newErrors.deposit_date = t('validation.depositDateRequired');
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
      await accountDepositServices.createDeposit(formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating deposit:', error);
      setErrors({ submit: t('messages.createDepositFailed') });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateAccountDepositDTO, value: any) => {
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
    return formatCurrencyUtil(amount, i18n.language);
  };

  return (
    <Modal show onClose={onClose} size="lg">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('accountDeposit.addNewDeposit')}
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
          {/* Account Search */}
          <div ref={searchRef} className="relative">
            <Label htmlFor="account_search" className="mb-2 block">
              {t('account.account')} *
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <HiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                id="account_search"
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (selectedAccount && e.target.value !== selectedAccount.name) {
                    setSelectedAccount(null);
                    setFormData(prev => ({ ...prev, account_id: 0 }));
                  }
                }}
                onFocus={handleSearchFocus}
                placeholder={t('account.searchAccount')}
                className={`w-full ps-10 rounded-lg border ${
                  errors.account_id
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                } dark:bg-gray-700 dark:text-white`}
              />
            </div>
            
            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {loadingAccounts ? (
                  <div className="flex items-center justify-center p-4">
                    <Spinner size="sm" />
                    <span className="ms-2 text-sm text-gray-500">{t('common.loading')}</span>
                  </div>
                ) : accounts.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    {t('account.noAccountsFound')}
                  </div>
                ) : (
                  accounts.map((account) => (
                    <div
                      key={account.id}
                      onClick={() => handleSelectAccount(account)}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900 dark:text-white">{account.name}</span>
                        <span className={`text-sm font-semibold ${
                          (account.balance || 0) >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatCurrency(account.balance || 0)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
            {errors.account_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.account_id}</p>
            )}
          </div>

          {/* Account Balance Display */}
          {selectedAccount && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-900 dark:text-green-300">
                  {t('account.currentBalance')}:
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
              {t('accountDeposit.amount')} *
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

          {/* Deposit Date */}
          <div>
            <Label htmlFor="deposit_date" className="mb-2 block">
              {t('accountDeposit.depositDate')} *
            </Label>
            <TextInput
              id="deposit_date"
              type="date"
              value={formData.deposit_date}
              onChange={(e) => handleInputChange('deposit_date', e.target.value)}
              color={errors.deposit_date ? 'failure' : 'gray'}
            />
            {errors.deposit_date && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.deposit_date}</p>
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
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={submitting} color="success">
              {submitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  {t('common.creating')}
                </>
              ) : (
                t('accountDeposit.createDeposit')
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
