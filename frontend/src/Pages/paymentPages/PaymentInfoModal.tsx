import { Modal, Badge, Button } from 'flowbite-react';
import { HiX, HiUser, HiClock, HiCheckCircle } from 'react-icons/hi';
import type { Payment } from '../../models/Payment';

interface PaymentInfoModalProps {
  payment: Payment;
  onClose: () => void;
}

export function PaymentInfoModal({ payment, onClose }: PaymentInfoModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewClient = () => {
    const clientId = payment.invoice?.client_id;
    console.log('Navigate to Client #', clientId);
    alert(`Navigation to Client #${clientId} - Implementation pending`);
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
              Payment Details
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Payment ID: #{payment.id}
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
              Payment Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Payment ID</p>
                <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                  #{payment.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Invoice</p>
                <p className="mt-1 text-base font-medium text-blue-600 dark:text-blue-400">
                  Invoice #{payment.invoice_id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Payment Date</p>
                <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                  {formatDate(payment.payment_date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <div className="mt-1">
                  <Badge color="success" size="sm">
                    Completed
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Information Section */}
          {invoice && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">
                Invoice Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Invoice ID</p>
                  <p className="mt-1 text-base font-medium text-blue-900 dark:text-blue-300">
                    #{invoice.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Invoice Date</p>
                  <p className="mt-1 text-base font-medium text-blue-900 dark:text-blue-300">
                    {formatDate(invoice.invoice_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Total Amount</p>
                  <p className="mt-1 text-lg font-bold text-blue-900 dark:text-blue-300">
                    {formatCurrency(invoice.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Paid Amount</p>
                  <p className="mt-1 text-lg font-bold text-blue-900 dark:text-blue-300">
                    {formatCurrency(invoice.payed)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Remaining Balance</p>
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
                    <p className="text-sm text-blue-700 dark:text-blue-400">Car</p>
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
                  Client Information
                </h4>
                <Button
                  size="sm"
                  color="purple"
                  onClick={handleViewClient}
                  className="flex items-center gap-2"
                >
                  <HiUser className="h-4 w-4" />
                  View Client Details
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-400">Client Name</p>
                  <p className="mt-1 text-base font-medium text-purple-900 dark:text-purple-300">
                    {client.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-400">Phone</p>
                  <p className="mt-1 text-base font-medium text-purple-900 dark:text-purple-300">
                    {client.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-400">Personal ID</p>
                  <p className="mt-1 text-base font-medium text-purple-900 dark:text-purple-300">
                    {client.personal_id || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-400">Address</p>
                  <p className="mt-1 text-base font-medium text-purple-900 dark:text-purple-300">
                    {client.address || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-400">Client Balance</p>
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
              Payment Timeline
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
                    Payment Received
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
                      Payment Recorded
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
                      Last Updated
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
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
