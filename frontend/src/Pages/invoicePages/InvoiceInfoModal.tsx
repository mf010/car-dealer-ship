import { useState, useEffect, useRef, useMemo } from "react";
import { Modal, Button, Badge } from "flowbite-react";
import { HiX, HiPlus, HiPrinter } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { paymentServices } from "../../services/paymentServices";
import type { Invoice } from "../../models/Invoice";
import type { Payment } from "../../models/Payment";
import { formatCurrency as formatCurrencyUtil, formatDate as formatDateUtil } from "../../utils/formatters";
import { PrintableInvoice } from "../../components/PrintableInvoice";

interface InvoiceInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onInvoiceUpdate: () => void;
}

export function InvoiceInfoModal({
  isOpen,
  onClose,
  invoice,
  onInvoiceUpdate,
}: InvoiceInfoModalProps) {
  const { t, i18n } = useTranslation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [addingPayment, setAddingPayment] = useState(false);
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [newPaymentDate, setNewPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && invoice) {
      fetchPayments();
    }
  }, [isOpen, invoice]);

  const fetchPayments = async () => {
    if (!invoice) return;
    setLoadingPayments(true);
    try {
      const response = await paymentServices.getAllPayments(1, {
        invoice_id: invoice.id,
      });
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleAddPayment = async () => {
    if (!invoice || !newPaymentAmount || parseFloat(newPaymentAmount) <= 0) {
      alert(t('validation.validPaymentAmount'));
      return;
    }

    const amount = parseFloat(newPaymentAmount);
    const remainingBalance = getRemainingBalance(invoice);

    if (amount > remainingBalance) {
      alert(t('validation.paymentExceedsBalance', { balance: formatCurrencyUtil(remainingBalance, i18n.language) }));
      return;
    }

    try {
      await paymentServices.createPayment({
        invoice_id: invoice.id,
        amount: amount,
        payment_date: newPaymentDate,
      });
      
      // Reset form
      setNewPaymentAmount("");
      setNewPaymentDate(new Date().toISOString().split("T")[0]);
      setAddingPayment(false);
      
      // Refresh data
      fetchPayments();
      onInvoiceUpdate();
    } catch (error) {
      console.error("Error adding payment:", error);
      alert(t('messages.addPaymentFailed'));
    }
  };

  const handleDeletePayment = async (paymentId: number) => {
    if (!window.confirm(t('messages.confirmDeletePayment'))) {
      return;
    }

    try {
      await paymentServices.deletePayment(paymentId);
      fetchPayments();
      onInvoiceUpdate();
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert(t('messages.deletePaymentFailed'));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return formatCurrencyUtil(amount, i18n.language);
  };

  const formatDate = (dateString: string) => {
    return formatDateUtil(dateString, i18n.language);
  };

  // Calculate total paid from actual payments - memoized to avoid re-calculation
  const totalPaid = useMemo(() => {
    if (!payments || payments.length === 0) return 0;
    // Convert to number to avoid string concatenation
    const total = payments.reduce((sum, payment) => sum + parseFloat(String(payment.amount || 0)), 0);
    return total;
  }, [payments]);

  const isFullyPaid = (inv: Invoice) => {
    const remaining = inv.amount - totalPaid;
    // Consider fully paid if remaining is less than 0.01 (1 cent)
    return remaining <= 0.01;
  };

  const getRemainingBalance = (inv: Invoice) => {
    const remaining = inv.amount - totalPaid;
    // Return 0 if remaining is very small (less than 1 cent)
    return remaining < 0.01 ? 0 : remaining;
  };

  if (!invoice) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="3xl">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-container,
            .print-container * {
              visibility: visible;
            }
            .print-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}
      </style>
      <div className="p-6 print:hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('invoice.invoiceDetailsId', { id: invoice.id })}
          </h3>
          <Button
            size="sm"
            color="blue"
            onClick={handlePrint}
          >
            <HiPrinter className="mr-2 h-4 w-4" />
            {t('common.print')}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Payment Status Badge */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('invoice.paymentStatus')}
            </h3>
            {isFullyPaid(invoice) ? (
              <Badge color="success" size="lg">
                {t('invoice.fullyPaid')}
              </Badge>
            ) : totalPaid > 0 ? (
              <Badge color="warning" size="lg">
                {t('invoice.partiallyPaid')}
              </Badge>
            ) : (
              <Badge color="failure" size="lg">
                {t('invoice.unpaid')}
              </Badge>
            )}
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('client.client')}</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {invoice.client?.name || t('common.notAvailable')}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('car.car')}</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {invoice.car?.carModel?.make?.name} {invoice.car?.carModel?.name}
              </p>
            </div>

            <div className="print:hidden">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('account.account')}
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {invoice.account?.name || t('account.noAccount')}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('invoice.invoiceDate')}
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatDate(invoice.invoice_date)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('invoice.totalAmount')}
              </p>
              <p className="font-semibold text-green-600 dark:text-green-400 text-lg">
                {formatCurrency(invoice.amount)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('invoice.amountPaid')}
              </p>
              <p className="font-semibold text-blue-600 dark:text-blue-400 text-lg">
                {formatCurrency(totalPaid)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('invoice.remainingBalance')}
              </p>
              <p className="font-semibold text-orange-600 dark:text-orange-400 text-lg">
                {formatCurrency(getRemainingBalance(invoice))}
              </p>
            </div>

            <div className="print:hidden">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('invoice.accountCut')}
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(invoice.account_cut)}
              </p>
            </div>
          </div>

          {/* Payment History */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('payment.paymentHistory')}
              </h3>
              {!isFullyPaid(invoice) && (
                <Button
                  size="sm"
                  color="blue"
                  onClick={() => setAddingPayment(!addingPayment)}
                >
                  {addingPayment ? (
                    <>
                      <HiX className="mr-2 h-4 w-4" />
                      {t('common.cancel')}
                    </>
                  ) : (
                    <>
                      <HiPlus className="mr-2 h-4 w-4" />
                      {t('payment.addPayment')}
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Add Payment Form */}
            {addingPayment && (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('payment.paymentAmount')}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newPaymentAmount}
                      onChange={(e) => setNewPaymentAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {t('payment.maxAmount')}: {formatCurrency(getRemainingBalance(invoice))}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('payment.paymentDate')}
                    </label>
                    <input
                      type="date"
                      value={newPaymentDate}
                      onChange={(e) => setNewPaymentDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                </div>
                <Button size="sm" color="blue" onClick={handleAddPayment}>
                  {t('payment.submitPayment')}
                </Button>
              </div>
            )}

            {/* Payments Table */}
            {loadingPayments ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : payments.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                {t('payment.noPaymentsRecorded')}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-4 py-3">{t('payment.paymentNumber')}</th>
                      <th className="px-4 py-3">{t('payment.amount')}</th>
                      <th className="px-4 py-3">{t('payment.date')}</th>
                      <th className="px-4 py-3">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-4 py-3 font-medium">
                          #{payment.id}
                        </td>
                        <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-4 py-3">
                          {formatDate(payment.payment_date)}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            size="xs"
                            color="failure"
                            onClick={() => handleDeletePayment(payment.id)}
                          >
                            {t('common.delete')}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <td className="px-4 py-3">{t('payment.totalPaid')}</td>
                      <td className="px-4 py-3 text-blue-600 dark:text-blue-400">
                        {formatCurrency(totalPaid)}
                      </td>
                      <td className="px-4 py-3" colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button color="gray" onClick={onClose}>
            {t('common.close')}
          </Button>
        </div>
      </div>

      {/* Hidden Printable Invoice */}
      <PrintableInvoice ref={printRef} invoice={invoice} payments={payments} />
    </Modal>
  );
}
