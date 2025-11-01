import { Button, Modal, Badge } from "flowbite-react";
import { HiX, HiUser, HiPhone, HiCash, HiArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import type { Account } from "../../models/Account";

interface AccountInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account | null;
  onAccountUpdate: () => void;
}

export function AccountInfoModal({ isOpen, onClose, account }: AccountInfoModalProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleNavigateToWithdrawals = () => {
    if (account) {
      // Close the modal first
      onClose();
      // Navigate to withdrawals page with account filter
      navigate(`/account-withdrawals?account_id=${account.id}`);
    }
  };

  if (!account) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('account.accountDetails')}
            </h3>
            <div className="flex items-center gap-2">
              <Badge color={account.balance < 0 ? "failure" : "success"} size="lg">
                {t('account.balance')}: {formatCurrency(account.balance, i18n.language)}
              </Badge>
            </div>
          </div>
          <Button color="gray" size="sm" onClick={onClose}>
            <HiX className="h-5 w-5" />
          </Button>
        </div>

        {/* Account Information */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('account.accountInformation')}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account ID */}
            <div className="flex items-center gap-3">
              <HiCash className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('account.accountId')}</p>
                <p className="font-medium text-gray-900 dark:text-white">#{account.id}</p>
              </div>
            </div>

            {/* Name */}
            <div className="flex items-center gap-3">
              <HiUser className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('account.accountHolder')}</p>
                <p className="font-medium text-gray-900 dark:text-white">{account.name}</p>
              </div>
            </div>

            {/* Phone */}
            {account.phone && (
              <div className="flex items-center gap-3">
                <HiPhone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('account.phone')}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{account.phone}</p>
                </div>
              </div>
            )}

            {/* Balance Details */}
            <div className="flex items-center gap-3">
              <HiCash className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('account.currentBalance')}</p>
                <p className={`font-bold text-lg ${
                  account.balance < 0 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {formatCurrency(account.balance, i18n.language)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawals Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('accountWithdrawal.accountWithdrawals')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('account.viewWithdrawalsDescription')}
              </p>
            </div>
          </div>
          
          <Button
            color="blue"
            onClick={handleNavigateToWithdrawals}
            className="w-full sm:w-auto"
          >
            {t('account.viewWithdrawals')}
            <HiArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Account Status */}
        {account.balance < 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Badge color="failure">{t('common.notice')}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-400">
                  {t('account.negativeBalanceNotice')}
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {t('account.outstandingAmount')}: {formatCurrency(Math.abs(account.balance), i18n.language)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timestamps */}
        {(account.created_at || account.updated_at) && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
              {account.created_at && (
                <div>
                  <span className="font-medium">{t('common.created')}:</span>{" "}
                  {formatDateTime(account.created_at, i18n.language)}
                </div>
              )}
              {account.updated_at && (
                <div>
                  <span className="font-medium">{t('common.lastUpdated')}:</span>{" "}
                  {formatDateTime(account.updated_at, i18n.language)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-600 mt-6">
          <Button color="gray" onClick={onClose}>
            {t('common.close')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
