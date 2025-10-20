import { useState, useEffect } from "react";
import { Modal, Button, Badge } from "flowbite-react";
import { HiX, HiPlus } from "react-icons/hi";
import { paymentServices } from "../../services/paymentServices";
import type { Invoice } from "../../models/Invoice";
import type { Payment } from "../../models/Payment";

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
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [addingPayment, setAddingPayment] = useState(false);
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [newPaymentDate, setNewPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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
      alert("Please enter a valid payment amount");
      return;
    }

    const amount = parseFloat(newPaymentAmount);
    const remainingBalance = invoice.amount - invoice.payed;

    if (amount > remainingBalance) {
      alert(`Payment amount cannot exceed remaining balance: $${remainingBalance.toFixed(2)}`);
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
      alert("Failed to add payment. Please try again.");
    }
  };

  const handleDeletePayment = async (paymentId: number) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) {
      return;
    }

    try {
      await paymentServices.deletePayment(paymentId);
      fetchPayments();
      onInvoiceUpdate();
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Failed to delete payment. Please try again.");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isFullyPaid = (inv: Invoice) => {
    return inv.payed >= inv.amount;
  };

  const getRemainingBalance = (inv: Invoice) => {
    return inv.amount - inv.payed;
  };

  if (!invoice) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="3xl">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Invoice Details - #{invoice.id}
        </h3>

        <div className="space-y-6">
          {/* Payment Status Badge */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Payment Status
            </h3>
            {isFullyPaid(invoice) ? (
              <Badge color="success" size="lg">
                Fully Paid
              </Badge>
            ) : invoice.payed > 0 ? (
              <Badge color="warning" size="lg">
                Partially Paid
              </Badge>
            ) : (
              <Badge color="failure" size="lg">
                Unpaid
              </Badge>
            )}
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Client</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {invoice.client?.name || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Car</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {invoice.car?.carModel?.make?.name} {invoice.car?.carModel?.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Account
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {invoice.account?.name || "No account"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Invoice Date
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatDate(invoice.invoice_date)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Amount
              </p>
              <p className="font-semibold text-green-600 dark:text-green-400 text-lg">
                {formatCurrency(invoice.amount)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Amount Paid
              </p>
              <p className="font-semibold text-blue-600 dark:text-blue-400 text-lg">
                {formatCurrency(invoice.payed)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Remaining Balance
              </p>
              <p className="font-semibold text-orange-600 dark:text-orange-400 text-lg">
                {formatCurrency(getRemainingBalance(invoice))}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Account Cut
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
                Payment History
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
                      Cancel
                    </>
                  ) : (
                    <>
                      <HiPlus className="mr-2 h-4 w-4" />
                      Add Payment
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
                      Payment Amount
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
                      Max: {formatCurrency(getRemainingBalance(invoice))}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Date
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
                  Submit Payment
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
                No payments recorded yet
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-4 py-3">Payment #</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Actions</th>
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
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <td className="px-4 py-3">Total Paid</td>
                      <td className="px-4 py-3 text-blue-600 dark:text-blue-400">
                        {formatCurrency(invoice.payed)}
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
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
