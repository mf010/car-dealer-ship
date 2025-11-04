import { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput, Spinner } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { paymentServices } from '../../services/paymentServices';
import { invoiceServices } from '../../services/invoiceServices';
import type { Payment, UpdatePaymentDTO } from '../../models/Payment';
import type { Invoice } from '../../models/Invoice';
import { formatCurrency as formatCurrencyUtil } from '../../utils/formatters';

interface PaymentUpdateProps {
  payment: Payment;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentUpdate({ payment, onClose, onSuccess }: PaymentUpdateProps) {
  const { t, i18n } = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<UpdatePaymentDTO>({
    invoice_id: payment.invoice_id,
    amount: payment.amount,
    payment_date: payment.payment_date,
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await invoiceServices.getAllInvoices(1, {});
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.invoice_id || formData.invoice_id === 0) {
      newErrors.invoice_id = t('validation.selectInvoice');
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = t('validation.amountGreaterThanZero');
    }

    // Check if amount exceeds remaining balance (excluding current payment)
    const selectedInvoice = invoices.find((inv) => inv.id === formData.invoice_id);
    if (selectedInvoice && formData.amount) {
      const paidWithoutCurrent = (selectedInvoice.payed || 0) - payment.amount;
      const remainingBalance = (selectedInvoice.amount || 0) - paidWithoutCurrent;
      if (formData.amount > remainingBalance) {
        newErrors.amount = t('validation.amountExceedsBalance', { balance: formatCurrency(remainingBalance) });
      }
    }

    if (!formData.payment_date) {
      newErrors.payment_date = t('validation.paymentDateRequired');
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
      await paymentServices.updatePayment(payment.id, formData);
      onSuccess();
    } catch (error) {
      console.error('Error updating payment:', error);
      setErrors({ submit: t('messages.updatePaymentFailed') });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof UpdatePaymentDTO, value: any) => {
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

  const selectedInvoice = invoices.find((inv) => inv.id === formData.invoice_id);
  const paidWithoutCurrent = selectedInvoice ? (selectedInvoice.payed || 0) - payment.amount : 0;
  const remainingBalance = selectedInvoice
    ? (selectedInvoice.amount || 0) - paidWithoutCurrent
    : 0;

  return (
    <Modal show onClose={onClose} size="lg">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('payment.updatePayment')}
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
          {/* Invoice Information (Read-only) */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('invoice.invoiceNumber')}:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  #{payment.invoice_id}
                </span>
              </div>
              {selectedInvoice && selectedInvoice.client && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('common.client')}:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedInvoice.client.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Remaining Balance Display - Prominent */}
          {selectedInvoice && (
            <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg border-2 border-blue-300 dark:border-blue-600 shadow-sm">
              <div className="text-center">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                  {t('invoice.remainingBalance')}
                </p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(remainingBalance)}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  {t('payment.maxPaymentAmount')}
                </p>
              </div>
            </div>
          )}

          {/* Amount */}
          <div>
            <Label htmlFor="amount" className="mb-2 block">
              {t('payment.amount')} *
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

          {/* Payment Date */}
          <div>
            <Label htmlFor="payment_date" className="mb-2 block">
              {t('payment.paymentDate')} *
            </Label>
            <TextInput
              id="payment_date"
              type="date"
              value={formData.payment_date}
              onChange={(e) => handleInputChange('payment_date', e.target.value)}
              color={errors.payment_date ? 'failure' : 'gray'}
            />
            {errors.payment_date && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.payment_date}</p>
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
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  {t('common.updating')}
                </>
              ) : (
                t('payment.updatePayment')
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
