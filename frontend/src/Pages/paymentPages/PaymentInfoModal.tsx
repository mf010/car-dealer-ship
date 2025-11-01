import { Modal, Badge, Button } from 'flowbite-react';
import { HiX, HiUser, HiClock, HiCheckCircle } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import type { Payment } from '../../models/Payment';
import { formatCurrency as formatCurrencyUtil, formatDate as formatDateUtil, formatDateTime as formatDateTimeUtil } from '../../utils/formatters';

interface PaymentInfoModalProps {
  payment: Payment;
  onClose: () => void;
}

export function PaymentInfoModal({ payment, onClose }: PaymentInfoModalProps) {
  const { t, i18n } = useTranslation();
  
  const formatCurrency = (amount: number) => {
    return formatCurrencyUtil(amount, i18n.language);
  };

  const formatDate = (dateString: string) => {
    return formatDateUtil(dateString, i18n.language);
  };

  const formatDateTime = (dateString: string) => {
    return formatDateTimeUtil(dateString, i18n.language);
  };

  const handleViewClient = () => {
    const clientId = payment.invoice?.client_id;
    console.log('Navigate to Client #', clientId);
    alert(t('messages.navigationPending', { type: 'Client', id: clientId }));
  };

  const invoice = payment.invoice;
  const client = invoice?.client;
  const remainingBalance = invoice ? (invoice.amount || 0) - (invoice.payed || 0) : 0;

  return (
    <Modal show onClose={onClose} size="4xl">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('payment.paymentDetails')}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('payment.paymentIdLabel', { id: payment.id })}
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
          {/* Payment Details Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('payment.paymentInformation')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('payment.paymentId')}</p>
                <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                  #{payment.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('invoice.invoice')}</p>
                <p className="mt-1 text-base font-medium text-blue-600 dark:text-blue-400">
                  {t('invoice.invoiceNumber', { number: payment.invoice_id })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('payment.amount')}</p>
                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('payment.paymentDate')}</p>
                <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                  {formatDate(payment.payment_date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('common.status')}</p>
                <div className="mt-1">
                  <Badge color="success" size="sm">
                    {t('payment.completed')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Information Section */}
          {invoice && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">
                {t('invoice.invoiceInformation')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">{t('invoice.invoiceId')}</p>
                  <p className="mt-1 text-base font-medium text-blue-900 dark:text-blue-300">
                    #{invoice.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">{t('invoice.invoiceDate')}</p>
                  <p className="mt-1 text-base font-medium text-blue-900 dark:text-blue-300">
                    {formatDate(invoice.invoice_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">{t('invoice.totalAmount')}</p>
                  <p className="mt-1 text-lg font-bold text-blue-900 dark:text-blue-300">
                    {formatCurrency(invoice.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">{t('invoice.amountPaid')}</p>
                  <p className="mt-1 text-lg font-bold text-blue-900 dark:text-blue-300">
                    {formatCurrency(invoice.payed)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">{t('invoice.remainingBalance')}</p>
                  <p className={`mt-1 text-lg font-bold ${
                    remainingBalance > 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {formatCurrency(remainingBalance)}
                  </p>
                </div>
                {invoice.car && (
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-400">{t('car.car')}</p>
                    <p className="mt-1 text-base font-medium text-blue-900 dark:text-blue-300">
                      {invoice.car.carModel?.make?.name} {invoice.car.carModel?.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Client Information Section */}
          {client && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-300">
                  {t('client.clientInformation')}
                </h4>
                <Button
                  size="sm"
                  color="purple"
                  onClick={handleViewClient}
                  className="flex items-center gap-2"
                >
                  <HiUser className="h-4 w-4" />
                  {t('client.viewClientDetails')}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-400">{t('client.clientName')}</p>
                  <p className="mt-1 text-base font-medium text-purple-900 dark:text-purple-300">
                    {client.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-400">{t('client.phone')}</p>
                  <p className="mt-1 text-base font-medium text-purple-900 dark:text-purple-300">
                    {client.phone || t('common.notAvailable')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-400">{t('client.personalId')}</p>
                  <p className="mt-1 text-base font-medium text-purple-900 dark:text-purple-300">
                    {client.personal_id || t('common.notAvailable')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-400">{t('client.address')}</p>
                  <p className="mt-1 text-base font-medium text-purple-900 dark:text-purple-300">
                    {client.address || t('common.notAvailable')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-400">{t('client.clientBalance')}</p>
                  <p className={`mt-1 text-lg font-bold ${
                    (client.balance || 0) >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(client.balance || 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('payment.paymentTimeline')}
            </h4>
            <div className="space-y-4">
              {/* Payment Received */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <HiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('payment.paymentReceived')}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(payment.payment_date)}
                  </p>
                </div>
              </div>

              {/* Payment Recorded */}
              {payment.created_at && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <HiClock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('payment.paymentRecorded')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDateTime(payment.created_at)}
                    </p>
                  </div>
                </div>
              )}

              {/* Last Updated */}
              {payment.updated_at && payment.updated_at !== payment.created_at && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <HiClock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('common.lastUpdated')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDateTime(payment.updated_at)}
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
            {t('common.close')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
