import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Badge, Button } from "flowbite-react";
import { HiX, HiCube, HiTag, HiCurrencyDollar, HiDocumentText, HiUser, HiPhone, HiLocationMarker, HiIdentification } from "react-icons/hi";
import { invoiceServices } from "../../services/invoiceServices";
import { carServices } from "../../services/carServices";
import type { Car } from "../../models/Car";
import type { Invoice } from "../../models/Invoice";

interface CarInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car | null;
  onCarUpdate: () => void;
}

export function CarInfoModal({ isOpen, onClose, car }: CarInfoModalProps) {
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [fullCarData, setFullCarData] = useState<Car | null>(null);
  const [loadingCar, setLoadingCar] = useState(false);

  const fetchCarData = async () => {
    if (!car) return;
    
    setLoadingCar(true);
    try {
      const response = await carServices.getCarById(car.id);
      console.log("Fetched car data:", response);
      
      // Handle snake_case from API - normalize to camelCase
      const apiResponse = response as any;
      const normalizedResponse: Car = {
        ...response,
        // Convert string prices to numbers
        purchase_price: typeof response.purchase_price === 'string' 
          ? parseFloat(response.purchase_price) 
          : response.purchase_price,
        total_expenses: typeof response.total_expenses === 'string' 
          ? parseFloat(response.total_expenses) 
          : response.total_expenses,
        carModel: apiResponse.car_model || response.carModel,
      };
      
      console.log("Normalized response:", normalizedResponse);
      console.log("Car Model Name:", normalizedResponse.carModel?.name);
      console.log("Make Name:", normalizedResponse.carModel?.make?.name);
      console.log("Purchase Price (number):", normalizedResponse.purchase_price);
      console.log("Total Expenses (number):", normalizedResponse.total_expenses);
      
      setFullCarData(normalizedResponse);
    } catch (error) {
      console.error("Error fetching car data:", error);
      // Fallback to the passed car data if fetch fails
      setFullCarData(car);
    } finally {
      setLoadingCar(false);
    }
  };

  const fetchInvoice = async () => {
    if (!fullCarData) return;
    
    setLoadingInvoice(true);
    try {
      // Fetch all invoices and find the one for this car
      const response = await invoiceServices.getAllInvoices(1, { car_id: fullCarData.id });
      if (response.data && response.data.length > 0) {
        setInvoice(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
    } finally {
      setLoadingInvoice(false);
    }
  };

  // Fetch complete car data when modal opens
  useEffect(() => {
    if (isOpen && car) {
      fetchCarData();
    } else {
      setFullCarData(null);
      setInvoice(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, car?.id]);

  // Fetch invoice if car is sold
  useEffect(() => {
    if (isOpen && fullCarData && fullCarData.status === "sold") {
      fetchInvoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, fullCarData?.id, fullCarData?.status]);

  const handleNavigateToInvoice = () => {
    if (invoice) {
      // Close the modal first
      onClose();
      // Navigate to invoices page
      navigate('/invoices');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!car) return null;

  // Use fullCarData if available, otherwise fallback to car prop
  const displayCar = fullCarData || car;

  return (
    <Modal show={isOpen} onClose={onClose} size="3xl">
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        {/* Loading State */}
        {loadingCar ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-500 dark:text-gray-400">
              Loading car details...
            </span>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <HiCube className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {displayCar.carModel?.make?.name} {displayCar.carModel?.name}
                </span>
              </div>
              <Badge color={displayCar.status === "sold" ? "failure" : "success"} size="lg">
                {displayCar.status === "sold" ? "Sold" : "Available"}
              </Badge>
            </div>

        <div className="space-y-6">
          {/* Car Information Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HiTag className="h-5 w-5" />
              Car Information
            </h4>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Car ID</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  #{displayCar.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Model ID</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {displayCar.car_model_id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Make (Manufacturer)</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {displayCar.carModel?.make?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Car Model</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {displayCar.carModel?.name || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Information Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HiCurrencyDollar className="h-5 w-5" />
              Financial Details
            </h4>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Purchase Price</p>
                <p className="text-base font-semibold text-blue-600 dark:text-blue-400">
                  {formatCurrency(displayCar.purchase_price)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
                <p className="text-base font-semibold text-orange-600 dark:text-orange-400">
                  {formatCurrency(displayCar.total_expenses)}
                </p>
              </div>
              <div className="col-span-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Cost</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(displayCar.purchase_price + displayCar.total_expenses)}
                </p>
              </div>
            </div>
          </div>

          {/* Invoice & Customer Information (Only for Sold Cars) */}
          {displayCar.status === "sold" && (
            <>
              {loadingInvoice ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-500 dark:text-gray-400">
                    Loading invoice details...
                  </span>
                </div>
              ) : invoice ? (
                <>
                  {/* Invoice Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <HiDocumentText className="h-5 w-5" />
                      Invoice Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Invoice ID</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          #{invoice.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Invoice Date</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {formatDate(invoice.invoice_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                        <p className="text-base font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(invoice.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Paid Amount</p>
                        <p className="text-base font-semibold text-blue-600 dark:text-blue-400">
                          {formatCurrency(invoice.payed)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Remaining Balance</p>
                        <p className="text-base font-semibold text-red-600 dark:text-red-400">
                          {formatCurrency(invoice.amount - invoice.payed)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Account Cut</p>
                        <p className="text-base font-semibold text-purple-600 dark:text-purple-400">
                          {formatCurrency(invoice.account_cut)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  {invoice.client && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <HiUser className="h-5 w-5" />
                        Customer Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Customer Name</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {invoice.client.name}
                          </p>
                        </div>
                        {invoice.client.phone && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <HiPhone className="h-4 w-4" />
                              Phone
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {invoice.client.phone}
                            </p>
                          </div>
                        )}
                        {invoice.client.personal_id && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <HiIdentification className="h-4 w-4" />
                              Personal ID
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {invoice.client.personal_id}
                            </p>
                          </div>
                        )}
                        {invoice.client.address && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <HiLocationMarker className="h-4 w-4" />
                              Address
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {invoice.client.address}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Client Balance</p>
                          <p className={`text-base font-semibold ${
                            invoice.client.balance < 0 
                              ? 'text-red-600 dark:text-red-400' 
                              : 'text-green-600 dark:text-green-400'
                          }`}>
                            {formatCurrency(invoice.client.balance)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigate to Invoice Button */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          View Full Invoice Details
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Access complete invoice information, payment history, and more
                        </p>
                      </div>
                      <Button
                        color="blue"
                        onClick={handleNavigateToInvoice}
                        size="sm"
                      >
                        <HiDocumentText className="mr-2 h-4 w-4" />
                        View Invoice
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-400">
                    No invoice found for this car. This car is marked as sold but doesn't have an associated invoice.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Timestamps */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div>
                <p className="font-medium">Created At</p>
                <p>{formatDate(displayCar.created_at)}</p>
              </div>
              <div>
                <p className="font-medium">Updated At</p>
                <p>{formatDate(displayCar.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
          <Button color="gray" onClick={onClose}>
            <HiX className="mr-2 h-5 w-5" />
            Close
          </Button>
        </div>
          </>
        )}
      </div>
    </Modal>
  );
}
