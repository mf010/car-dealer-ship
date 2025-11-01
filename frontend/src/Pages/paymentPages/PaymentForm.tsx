import { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput, Spinner } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { paymentServices } from '../../services/paymentServices';
import { invoiceServices } from '../../services/invoiceServices';
import type { CreatePaymentDTO } from '../../models/Payment';
import type { Invoice } from '../../models/Invoice';
import { formatCurrency as formatCurrencyUtil } from '../../utils/formatters';

interface PaymentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentForm({ onClose, onSuccess }: PaymentFormProps) {
  const { t, i18n } = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreatePaymentDTO>({
    invoice_id: 0,
    amount: 0,
    payment_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoadingInvoices(true);
    try {
      const response = await invoiceServices.getAllInvoices(1, {});
      // Filter invoices that have remaining balance
      const unpaidInvoices = response.data.filter((inv: Invoice) => {
        const totalAmount = inv.amount || 0;
        const paidAmount = inv.payed || 0;
        return totalAmount > paidAmount;
      });
      setInvoices(unpaidInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoadingInvoices(false);
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

    // Check if amount exceeds remaining balance
    const selectedInvoice = invoices.find((inv) => inv.id === formData.invoice_id);
    if (selectedInvoice) {
      const remainingBalance = (selectedInvoice.amount || 0) - (selectedInvoice.payed || 0);
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
      await paymentServices.createPayment(formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating payment:', error);
      setErrors({ submit: t('messages.createPaymentFailed') });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreatePaymentDTO, value: any) => {
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
  const remainingBalance = selectedInvoice
    ? (selectedInvoice.amount || 0) - (selectedInvoice.payed || 0)
    : 0;

  return (
    <Modal show onClose={onClose} size="lg">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('payment.addNewPayment')}
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
          {/* Invoice Selection */}
          <div>
            <Label htmlFor="invoice_id" className="mb-2 block">
              {t('invoice.invoice')} *
            </Label>
            {loadingInvoices ? (
              <div className="flex items-center justify-center p-4">
                <Spinner size="md" />
              </div>
            ) : (
              <select
                id="invoice_id"
                value={formData.invoice_id}
                onChange={(e) => handleInputChange('invoice_id', Number(e.target.value))}
                className={`w-full rounded-lg border ${
                  errors.invoice_id
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                } dark:bg-gray-700 dark:text-white`}
              >
                <option value={0}>{t('invoice.selectInvoice')}</option>
                {invoices.map((invoice) => {
                  const remaining = (invoice.amount || 0) - (invoice.payed || 0);
                  return (
                    <option key={invoice.id} value={invoice.id}>
                      {t('invoice.invoiceNumberClientBalance', { 
                        number: invoice.id, 
                        client: invoice.client?.name,
                        balance: formatCurrency(remaining)
                      })}
                    </option>
                  );
                })}
              </select>
            )}
            {errors.invoice_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.invoice_id}</p>
            )}
          </div>

          {/* Remaining Balance Display */}
          {selectedInvoice && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  {t('invoice.remainingBalance')}:
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(remainingBalance)}
                </span>
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
                  {t('common.creating')}
                </>
              ) : (
                t('payment.createPayment')
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
