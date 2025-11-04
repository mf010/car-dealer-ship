import { useState, useEffect } from 'react';
import { Button, Badge, Pagination, Spinner } from 'flowbite-react';
import { HiPlus, HiEye, HiTrash, HiFilter } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { paymentServices } from '../../services/paymentServices';
import type { Payment, PaymentFilters } from '../../models/Payment';
import { PaymentForm } from './PaymentForm';
import { PaymentUpdate } from './PaymentUpdate';
import { PaymentInfoModal } from './PaymentInfoModal';
import { formatCurrency as formatCurrencyUtil, formatDate as formatDateUtil } from '../../utils/formatters';

export function PaymentList() {
  const { t, i18n } = useTranslation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PaymentFilters>({});

  useEffect(() => {
    fetchPayments();
  }, [currentPage, filters]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await paymentServices.getAllPayments(currentPage, filters);
      setPayments(response.data);
      setTotalPages(response.last_page);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t('messages.confirmDeletePayment'))) {
      try {
        await paymentServices.deletePayment(id);
        fetchPayments();
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowInfoModal(true);
  };

  const handleFilterChange = (key: keyof PaymentFilters, value: any) => {
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
            {t('payment.management')}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('payment.managementDescription')}
          </p>
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
          >
            <HiPlus className="h-5 w-5" />
            {t('payment.addPayment')}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Invoice Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('invoice.invoiceNumber')}
              </label>
              <input
                type="text"
                placeholder={t('payment.enterInvoiceNumber')}
                value={filters.invoice_id || ''}
                onChange={(e) =>
                  handleFilterChange('invoice_id', e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Payment Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('payment.paymentDate')}
              </label>
              <input
                type="date"
                value={filters.payment_date || ''}
                onChange={(e) => handleFilterChange('payment_date', e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Min Amount Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('financial.minAmount')}
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

            {/* Max Amount Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('financial.maxAmount')}
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
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">{t('payment.noPaymentsFound')}</p>
            <p className="text-sm mt-2">{t('payment.noPaymentsFoundDescription')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">{t('payment.paymentId')}</th>
                  <th scope="col" className="px-6 py-3">{t('invoice.invoice')}</th>
                  <th scope="col" className="px-6 py-3">{t('client.client')}</th>
                  <th scope="col" className="px-6 py-3">{t('payment.amount')}</th>
                  <th scope="col" className="px-6 py-3">{t('payment.paymentDate')}</th>
                  <th scope="col" className="px-6 py-3">{t('common.status')}</th>
                  <th scope="col" className="px-6 py-3">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      #{payment.id}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        #{payment.invoice_id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {payment.invoice?.client?.name || t('common.notAvailable')}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {payment.invoice?.client?.phone || t('client.noPhone')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatDate(payment.payment_date)}</td>
                    <td className="px-6 py-4">
                      <Badge color="success" size="sm">
                        {t('payment.paid')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          color="info"
                          onClick={() => handleView(payment)}
                          className="flex items-center gap-1"
                        >
                          <HiEye className="h-4 w-4" />
                          {t('common.view')}
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => handleDelete(payment.id)}
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
        <PaymentForm
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchPayments();
          }}
        />
      )}

      {showUpdateModal && selectedPayment && (
        <PaymentUpdate
          payment={selectedPayment}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedPayment(null);
          }}
          onSuccess={() => {
            setShowUpdateModal(false);
            setSelectedPayment(null);
            fetchPayments();
          }}
        />
      )}

      {showInfoModal && selectedPayment && (
        <PaymentInfoModal
          payment={selectedPayment}
          onClose={() => {
            setShowInfoModal(false);
            setSelectedPayment(null);
          }}
        />
      )}
    </div>
  );
}
