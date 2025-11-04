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
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [validatingInvoice, setValidatingInvoice] = useState(false);

  const [formData, setFormData] = useState<CreatePaymentDTO>({
    invoice_id: 0,
    amount: 0,
    payment_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
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
    }
  };

  const validateInvoiceNumber = async (invoiceNum: string) => {
    if (!invoiceNum || invoiceNum.trim() === '') {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.invoice_id;
        return newErrors;
      });
      setFormData((prev) => ({ ...prev, invoice_id: 0 }));
      return;
    }

    setValidatingInvoice(true);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.invoice_id;
      return newErrors;
    });

    try {
      const invoiceId = parseInt(invoiceNum);
      if (isNaN(invoiceId)) {
        setErrors((prev) => ({
          ...prev,
          invoice_id: t('validation.invalidInvoiceNumber'),
        }));
        setFormData((prev) => ({ ...prev, invoice_id: 0 }));
        return;
      }

      // Check if invoice exists in the fetched invoices
      const invoice = invoices.find((inv) => inv.id === invoiceId);
      
      if (!invoice) {
        // Try to fetch the specific invoice
        try {
          const fetchedInvoice = await invoiceServices.getInvoiceById(invoiceId);
          
          // Check if invoice is fully paid
          const totalAmount = fetchedInvoice.amount || 0;
          const paidAmount = fetchedInvoice.payed || 0;
          const remaining = totalAmount - paidAmount;
          
          if (remaining <= 0) {
            setErrors((prev) => ({
              ...prev,
              invoice_id: t('validation.invoiceFullyPaid'),
            }));
            setFormData((prev) => ({ ...prev, invoice_id: 0 }));
          } else {
            // Invoice exists and has remaining balance
            setFormData((prev) => ({ ...prev, invoice_id: invoiceId }));
            // Add to invoices list if not already there
            if (!invoices.find((inv) => inv.id === invoiceId)) {
              setInvoices((prev) => [...prev, fetchedInvoice]);
            }
          }
        } catch (error) {
          setErrors((prev) => ({
            ...prev,
            invoice_id: t('validation.invoiceNotFound'),
          }));
          setFormData((prev) => ({ ...prev, invoice_id: 0 }));
        }
      } else {
        // Invoice found in the list
        const remaining = (invoice.amount || 0) - (invoice.payed || 0);
        if (remaining <= 0) {
          setErrors((prev) => ({
            ...prev,
            invoice_id: t('validation.invoiceFullyPaid'),
          }));
          setFormData((prev) => ({ ...prev, invoice_id: 0 }));
        } else {
          setFormData((prev) => ({ ...prev, invoice_id: invoiceId }));
        }
      }
    } catch (error) {
      console.error('Error validating invoice:', error);
      setErrors((prev) => ({
        ...prev,
        invoice_id: t('validation.errorValidatingInvoice'),
      }));
      setFormData((prev) => ({ ...prev, invoice_id: 0 }));
    } finally {
      setValidatingInvoice(false);
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
          {/* Invoice Number Input */}
          <div>
            <Label htmlFor="invoice_number" className="mb-2 block">
              {t('payment.invoiceNumber')} *
            </Label>
            <div className="relative">
              <TextInput
                id="invoice_number"
                type="text"
                placeholder={t('payment.enterInvoiceNumber')}
                value={invoiceNumber}
                onChange={(e) => {
                  setInvoiceNumber(e.target.value);
                  validateInvoiceNumber(e.target.value);
                }}
                color={errors.invoice_id ? 'failure' : 'gray'}
                disabled={submitting}
                icon={validatingInvoice ? () => <Spinner size="sm" /> : undefined}
              />
            </div>
            {errors.invoice_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.invoice_id}</p>
            )}
            {formData.invoice_id > 0 && !errors.invoice_id && (
              <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{t('validation.invoiceValid')}</span>
                </div>
                {invoices.find((inv) => inv.id === formData.invoice_id) && (
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <p>
                      {t('common.client')}:{' '}
                      <span className="font-semibold">
                        {invoices.find((inv) => inv.id === formData.invoice_id)?.client?.name}
                      </span>
                    </p>
                    <p>
                      {t('invoice.remainingBalance')}:{' '}
                      <span className="font-semibold">
                        {formatCurrency(
                          (invoices.find((inv) => inv.id === formData.invoice_id)?.amount || 0) -
                          (invoices.find((inv) => inv.id === formData.invoice_id)?.payed || 0)
                        )}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

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
