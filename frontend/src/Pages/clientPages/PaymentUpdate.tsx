import { useState, useEffect } from "react";
import { Button, Label, TextInput, Select, Modal } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { paymentServices } from "../../services/paymentServices";
import { invoiceServices } from "../../services/invoiceServices";
import type { Payment, UpdatePaymentDTO } from "../../models/Payment";
import type { Invoice } from "../../models/Invoice";

interface PaymentUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  payment: Payment | null;
}

export function PaymentUpdate({ isOpen, onClose, onSuccess, payment }: PaymentUpdateProps) {
  const [formData, setFormData] = useState<UpdatePaymentDTO>({
    invoice_id: 0,
    amount: 0,
    payment_date: "",
  });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [errors, setErrors] = useState<{
    invoice_id?: string;
    amount?: string;
    payment_date?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch invoices when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchInvoices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Update form when payment changes
  useEffect(() => {
    if (payment) {
      setFormData({
        invoice_id: payment.invoice_id,
        amount: payment.amount,
        payment_date: payment.payment_date,
      });
    }
  }, [payment]);

  const fetchInvoices = async () => {
    setLoadingInvoices(true);
    try {
      const response = await invoiceServices.getAllInvoices(1);
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setErrors({ invoice_id: "Failed to load invoices" });
    } finally {
      setLoadingInvoices(false);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (formData.invoice_id !== undefined && (!formData.invoice_id || formData.invoice_id === 0)) {
      newErrors.invoice_id = "Please select an invoice";
    }

    if (formData.amount !== undefined) {
      if (formData.amount <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      } else if (isNaN(formData.amount)) {
        newErrors.amount = "Amount must be a valid number";
      }
    }

    if (formData.payment_date !== undefined && !formData.payment_date) {
      newErrors.payment_date = "Payment date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!payment) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      await paymentServices.updatePayment(payment.id, formData);
      setSuccessMessage("Payment updated successfully!");
      
      setErrors({});
      
      // Wait a moment to show success message, then close and refresh
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccessMessage(null);
      }, 1500);
    } catch (error) {
      console.error("Error updating payment:", error);
      setErrors({ amount: "Failed to update payment. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "invoice_id" ? parseInt(value) : name === "amount" ? parseFloat(value) : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle modal close
  const handleClose = () => {
    setFormData({
      invoice_id: 0,
      amount: 0,
      payment_date: "",
    });
    setErrors({});
    setSuccessMessage(null);
    onClose();
  };

  if (!payment) return null;

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Edit Payment
        </h3>

        {successMessage && (
          <div className="mb-4 p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 flex items-center">
            <HiCheck className="h-5 w-5 mr-2" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Invoice Selection */}
          <div>
            <Label htmlFor="edit-invoice_id" className="mb-2 block">
              Invoice <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              id="edit-invoice_id"
              name="invoice_id"
              value={formData.invoice_id}
              onChange={handleChange}
              color={errors.invoice_id ? "failure" : undefined}
              disabled={isSubmitting || loadingInvoices}
            >
              <option value={0}>
                {loadingInvoices ? "Loading invoices..." : "Select an invoice"}
              </option>
              {invoices.map((invoice) => (
                <option key={invoice.id} value={invoice.id}>
                  Invoice #{invoice.id} - {invoice.client?.name} - ${invoice.amount}
                </option>
              ))}
            </Select>
            {errors.invoice_id && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.invoice_id}
              </p>
            )}
          </div>

          {/* Amount Field */}
          <div>
            <Label htmlFor="edit-amount" className="mb-2 block">
              Amount <span className="text-red-500 ml-1">*</span>
            </Label>
            <TextInput
              id="edit-amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Enter payment amount"
              value={formData.amount}
              onChange={handleChange}
              color={errors.amount ? "failure" : undefined}
              disabled={isSubmitting}
              autoFocus
            />
            {errors.amount && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.amount}
              </p>
            )}
          </div>

          {/* Payment Date Field */}
          <div>
            <Label htmlFor="edit-payment_date" className="mb-2 block">
              Payment Date <span className="text-red-500 ml-1">*</span>
            </Label>
            <TextInput
              id="edit-payment_date"
              name="payment_date"
              type="date"
              value={formData.payment_date}
              onChange={handleChange}
              color={errors.payment_date ? "failure" : undefined}
              disabled={isSubmitting}
            />
            {errors.payment_date && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.payment_date}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <Button color="gray" onClick={handleClose} disabled={isSubmitting}>
              <HiX className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              color="blue"
              disabled={isSubmitting || loadingInvoices}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                "Update Payment"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
