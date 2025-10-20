import { useState, useEffect } from "react";
import { Button, TextInput, Pagination, Badge, Select } from "flowbite-react";
import { HiPlus, HiPencil, HiTrash, HiInformationCircle, HiFilter } from "react-icons/hi";
import { invoiceServices } from "../../services/invoiceServices";
import { clientServices } from "../../services/clientServices";
import { carServices } from "../../services/carServices";
import type { Invoice, InvoiceFilters } from "../../models/Invoice";
import type { Client } from "../../models/Client";
import type { Car } from "../../models/Car";
import { InvoiceForm } from "./InvoiceForm";
import { InvoiceUpdate } from "./InvoiceUpdate";
import { InvoiceInfoModal } from "./InvoiceInfoModal";

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<InvoiceFilters>({});
  const [clients, setClients] = useState<Client[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchClients();
    fetchCars();
  }, []);

  // Fetch invoices from API
  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await invoiceServices.getAllInvoices(currentPage, filters);
      setInvoices(response.data);
      setTotalPages(response.last_page);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch invoices. Please check if the API server is running.";
      setError(errorMessage);
      setInvoices([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await clientServices.getAllClients(1);
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await carServices.getAllCars(1);
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  // Fetch invoices when page or filters change
  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await invoiceServices.deleteInvoice(id);
        fetchInvoices();
      } catch (error) {
        console.error("Error deleting invoice:", error);
      }
    }
  };

  // Handle add invoice
  const handleAddInvoice = () => {
    setIsAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditModalOpen(true);
  };

  // Handle view invoice info
  const handleViewInfo = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsInfoModalOpen(true);
  };

  // Handle page change
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle filter change
  const handleFilterChange = (key: keyof InvoiceFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "" || value === "all" ? undefined : value
    }));
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Check if invoice is fully paid
  const isFullyPaid = (invoice: Invoice) => {
    return invoice.payed >= invoice.amount;
  };

  // Calculate remaining balance
  const getRemainingBalance = (invoice: Invoice) => {
    return invoice.amount - invoice.payed;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Invoices
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage sales invoices and track payments
          </p>
        </div>
        <Button onClick={handleAddInvoice} color="blue" size="md">
          <HiPlus className="mr-2 h-5 w-5" />
          Add Invoice
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <span className="font-medium">Error!</span> {error}
        </div>
      )}

      {/* Filter Toggle Button */}
      <div className="flex gap-4 items-center">
        <Button
          color="gray"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <HiFilter className="mr-2 h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
        {Object.keys(filters).length > 0 && (
          <Button
            color="light"
            size="sm"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Client Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client
              </label>
              <Select
                value={filters.client_id || "all"}
                onChange={(e) => handleFilterChange('client_id', e.target.value === "all" ? undefined : parseInt(e.target.value))}
                sizing="sm"
              >
                <option value="all">All Clients</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Car Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Car
              </label>
              <Select
                value={filters.car_id || "all"}
                onChange={(e) => handleFilterChange('car_id', e.target.value === "all" ? undefined : parseInt(e.target.value))}
                sizing="sm"
              >
                <option value="all">All Cars</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.carModel?.make?.name} {car.carModel?.name} (#{car.id})
                  </option>
                ))}
              </Select>
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Status
              </label>
              <Select
                value={filters.paid === undefined ? "all" : filters.paid ? "paid" : "unpaid"}
                onChange={(e) => handleFilterChange('paid', e.target.value === "all" ? undefined : e.target.value === "paid")}
                sizing="sm"
              >
                <option value="all">All Invoices</option>
                <option value="paid">Fully Paid</option>
                <option value="unpaid">Unpaid/Partial</option>
              </Select>
            </div>

            {/* Invoice Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Invoice Date
              </label>
              <TextInput
                type="date"
                value={filters.invoice_date || ""}
                onChange={(e) => handleFilterChange('invoice_date', e.target.value)}
                sizing="sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500 dark:text-gray-400">
            Loading invoices...
          </span>
        </div>
      ) : !invoices || invoices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No invoices found
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">ID</th>
                  <th scope="col" className="px-6 py-3">Client</th>
                  <th scope="col" className="px-6 py-3">Car</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Amount</th>
                  <th scope="col" className="px-6 py-3">Paid</th>
                  <th scope="col" className="px-6 py-3">Balance</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      #{invoice.id}
                    </td>
                    <td className="px-6 py-4">
                      {invoice.client?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {invoice.car?.carModel?.make?.name} {invoice.car?.carModel?.name}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(invoice.invoice_date)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">
                      {formatCurrency(invoice.payed)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-orange-600 dark:text-orange-400">
                      {formatCurrency(getRemainingBalance(invoice))}
                    </td>
                    <td className="px-6 py-4">
                      {isFullyPaid(invoice) ? (
                        <Badge color="success" size="sm">Paid</Badge>
                      ) : invoice.payed > 0 ? (
                        <Badge color="warning" size="sm">Partial</Badge>
                      ) : (
                        <Badge color="failure" size="sm">Unpaid</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          color="info"
                          onClick={() => handleViewInfo(invoice)}
                        >
                          <HiInformationCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="xs"
                          color="gray"
                          onClick={() => handleEdit(invoice)}
                        >
                          <HiPencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => handleDelete(invoice.id)}
                        >
                          <HiTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                showIcons={true}
              />
            </div>
          )}
        </>
      )}

      {/* Add Invoice Modal */}
      <InvoiceForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchInvoices}
      />

      {/* Edit Invoice Modal */}
      <InvoiceUpdate
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchInvoices}
        invoice={selectedInvoice}
      />

      {/* Invoice Info Modal */}
      <InvoiceInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        invoice={selectedInvoice}
        onInvoiceUpdate={fetchInvoices}
      />
    </div>
  );
}
