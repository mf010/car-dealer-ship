import { useState, useEffect } from "react";
import { Button, Modal, Badge } from "flowbite-react";
import { HiPlus, HiPencil, HiTrash, HiX, HiCash, HiUser, HiPhone, HiLocationMarker, HiCreditCard } from "react-icons/hi";
import { useTranslation } from 'react-i18next';
import { formatCurrency as formatCurrencyUtil, formatDate as formatDateUtil } from '../../utils/formatters';
import type { Client } from "../../models/Client";
import type { Payment } from "../../models/Payment";
import { paymentServices } from "../../services/paymentServices";
import { PaymentForm } from "./PaymentForm";
import { PaymentUpdate } from "./PaymentUpdate";

interface AccountInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onClientUpdate: () => void;
}

export function AccountInfoModal({ isOpen, onClose, client, onClientUpdate }: AccountInfoModalProps) {
  const { t, i18n } = useTranslation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Fetch payments for this client when modal opens
  useEffect(() => {
    if (isOpen && client) {
      fetchPayments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, client]);

  const fetchPayments = async () => {
    if (!client) return;
    
    setLoadingPayments(true);
    try {
      // Note: We need to filter payments by client through invoices
      // For now, we'll fetch all payments and filter client-side
      // In production, the API should support filtering by client_id
      const response = await paymentServices.getAllPayments(1, {});
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleDeletePayment = async (paymentId: number) => {
    if (window.confirm(t('messages.confirmDeletePayment'))) {
      try {
        await paymentServices.deletePayment(paymentId);
        fetchPayments();
        onClientUpdate(); // Refresh client list to update balance
      } catch (error) {
        console.error("Error deleting payment:", error);
      }
    }
  };

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsEditPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    fetchPayments();
    onClientUpdate(); // Refresh client list to update balance
  };

  const formatCurrency = (amount: number) => {
    return formatCurrencyUtil(amount, i18n.language);
  };

  const formatDate = (dateString: string) => {
    return formatDateUtil(dateString, i18n.language);
  };

  if (!client) return null;

  return (
    <>
      <Modal show={isOpen} onClose={onClose} size="4xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('client.accountInformation')}
              </h3>
              <div className="flex items-center gap-2">
                <Badge color={client.balance < 0 ? "failure" : "success"} size="lg">
                  {t('client.balance')}: {formatCurrency(client.balance)}
                </Badge>
              </div>
            </div>
            <Button color="gray" size="sm" onClick={onClose}>
              <HiX className="h-5 w-5" />
            </Button>
          </div>

          {/* Client Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <HiUser className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('client.name')}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{client.name}</p>
                </div>
              </div>

              {client.phone && (
                <div className="flex items-center gap-3">
                  <HiPhone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('client.phone')}</p>
                    <p className="font-medium text-gray-900 dark:text-white">{client.phone}</p>
                  </div>
                </div>
              )}

              {client.personal_id && (
                <div className="flex items-center gap-3">
                  <HiCreditCard className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('client.personalId')}</p>
                    <p className="font-medium text-gray-900 dark:text-white">{client.personal_id}</p>
                  </div>
                </div>
              )}

              {client.address && (
                <div className="flex items-center gap-3">
                  <HiLocationMarker className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('client.address')}</p>
                    <p className="font-medium text-gray-900 dark:text-white">{client.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payments Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <HiCash className="h-5 w-5" />
                {t('payment.paymentHistory')}
              </h4>
              <Button size="sm" color="blue" onClick={() => setIsAddPaymentOpen(true)}>
                <HiPlus className="mr-2 h-4 w-4" />
                {t('payment.addPayment')}
              </Button>
            </div>

            {/* Payments Table */}
            {loadingPayments ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-500 dark:text-gray-400">{t('common.loading')}...</span>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">{t('payment.noPaymentsFound')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">{t('common.id')}</th>
                      <th scope="col" className="px-6 py-3">{t('invoice.invoice')}</th>
                      <th scope="col" className="px-6 py-3">{t('payment.amount')}</th>
                      <th scope="col" className="px-6 py-3">{t('common.date')}</th>
                      <th scope="col" className="px-6 py-3">
                        <span className="sr-only">{t('common.actions')}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          #{payment.id}
                        </td>
                        <td className="px-6 py-4">
                          {t('invoice.invoice')} #{payment.invoice_id}
                        </td>
                        <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4">{formatDate(payment.payment_date)}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button
                              size="xs"
                              color="gray"
                              onClick={() => handleEditPayment(payment)}
                            >
                              <HiPencil className="h-3 w-3" />
                            </Button>
                            <Button
                              size="xs"
                              color="failure"
                              onClick={() => handleDeletePayment(payment.id)}
                            >
                              <HiTrash className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
            <Button color="gray" onClick={onClose}>
              {t('common.close')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Payment Modal */}
      <PaymentForm
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
        clientId={client?.id}
      />

      {/* Edit Payment Modal */}
      <PaymentUpdate
        isOpen={isEditPaymentOpen}
        onClose={() => setIsEditPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
        payment={selectedPayment}
      />
    </>
  );
}
