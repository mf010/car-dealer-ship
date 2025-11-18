import { useState, useEffect } from "react";
import { Button, TextInput, Pagination, Badge, Select } from "flowbite-react";
import { HiPlus, HiPencil, HiTrash, HiInformationCircle, HiFilter } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { invoiceServices } from "../../services/invoiceServices";
import { clientServices } from "../../services/clientServices";
import type { Invoice, InvoiceFilters } from "../../models/Invoice";
import type { Client } from "../../models/Client";
import { InvoiceForm } from "./InvoiceForm";
import { InvoiceUpdate } from "./InvoiceUpdate";
import { InvoiceInfoModal } from "./InvoiceInfoModal";

export function InvoiceList() {
  const { t, i18n } = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<InvoiceFilters>({});
  const [clients, setClients] = useState<Client[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [carNameSearch, setCarNameSearch] = useState("");
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Fetch invoices from API
  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build filters object with only defined values
      const activeFilters: InvoiceFilters = {};
      
      if (filters.client_id) activeFilters.client_id = filters.client_id;
      if (filters.car_id) activeFilters.car_id = filters.car_id;
      if (filters.account_id) activeFilters.account_id = filters.account_id;
      if (filters.invoice_date) activeFilters.invoice_date = filters.invoice_date;
      if (filters.paid !== undefined) activeFilters.paid = filters.paid;
      
      const response = await invoiceServices.getAllInvoices(
        currentPage, 
        Object.keys(activeFilters).length > 0 ? activeFilters : undefined
      );
      
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

  // Fetch invoices when page or filters change
  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm(t('invoice.deleteConfirm'))) {
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
    setClientSearch("");
    setCarNameSearch("");
    setCurrentPage(1);
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
            {t('invoice.management')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('invoice.manageDescription')}
          </p>
        </div>
        <Button onClick={handleAddInvoice} color="blue" size="md">
          <HiPlus className="mr-2 h-5 w-5" />
          {t('invoice.addInvoice')}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <span className="font-medium">{t('common.error')}</span> {error}
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
          {showFilters ? t('common.hideFilters') : t('common.showFilters')}
        </Button>
        {Object.keys(filters).length > 0 && (
          <Button
            color="light"
            size="sm"
            onClick={clearFilters}
          >
            {t('common.clearFilters')}
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Client Filter - Searchable */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('client.clientSearch')}
              </label>
              <div className="relative">
                <TextInput
                  type="text"
                  placeholder={t('client.searchClientByName')}
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  sizing="sm"
                />
                {clientSearch && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {clients
                      .filter(client => 
                        client.name.toLowerCase().includes(clientSearch.toLowerCase())
                      )
                      .slice(0, 10)
                      .map((client) => (
                        <button
                          key={client.id}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-900 dark:text-white"
                          onClick={() => {
                            handleFilterChange('client_id', client.id);
                            setClientSearch(client.name);
                          }}
                        >
                          {client.name}
                        </button>
                      ))}
                    {clients.filter(client => 
                      client.name.toLowerCase().includes(clientSearch.toLowerCase())
                    ).length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {t('common.noClientsFound')}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {filters.client_id && (
                <button
                  onClick={() => {
                    handleFilterChange('client_id', undefined);
                    setClientSearch("");
                  }}
                  className="mt-1 text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                >
                  {t('common.clearClientFilter')}
                </button>
              )}
            </div>

            {/* Car Name Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('car.carName')}
              </label>
              <TextInput
                type="text"
                placeholder={t('car.enterCarId')}
                value={carNameSearch}
                onChange={(e) => {
                  setCarNameSearch(e.target.value);
                  handleFilterChange('car_id', e.target.value ? parseInt(e.target.value) || undefined : undefined);
                }}
                sizing="sm"
              />
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('invoice.paymentStatus')}
              </label>
              <Select
                value={filters.paid === undefined ? "all" : filters.paid ? "paid" : "unpaid"}
                onChange={(e) => handleFilterChange('paid', e.target.value === "all" ? undefined : e.target.value === "paid")}
                sizing="sm"
              >
                <option value="all">{t('invoice.allInvoices')}</option>
                <option value="paid">{t('invoice.fullyPaid')}</option>
                <option value="unpaid">{t('invoice.unpaidPartial')}</option>
              </Select>
            </div>

            {/* Invoice Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('invoice.invoiceDate')}
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
            {t('invoice.loadingInvoices')}
          </span>
        </div>
      ) : !invoices || invoices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {t('invoice.noInvoices')}
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">{t('common.id')}</th>
                  <th scope="col" className="px-6 py-3">{t('client.client')}</th>
                  <th scope="col" className="px-6 py-3">{t('car.carId')}</th>
                  <th scope="col" className="px-6 py-3">{t('common.date')}</th>
                  <th scope="col" className="px-6 py-3">{t('invoice.amount')}</th>
                  <th scope="col" className="px-6 py-3">{t('invoice.paid')}</th>
                  <th scope="col" className="px-6 py-3">{t('invoice.balance')}</th>
                  <th scope="col" className="px-6 py-3">{t('common.status')}</th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">{t('common.actions')}</span>
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
                      {invoice.client?.name || t('common.notAvailable')}
                    </td>
                    <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">
                      #{invoice.car_id || t('common.notAvailable')}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(invoice.invoice_date, i18n.language)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(invoice.amount, i18n.language)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">
                      {formatCurrency(invoice.payed, i18n.language)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-orange-600 dark:text-orange-400">
                      {formatCurrency(getRemainingBalance(invoice), i18n.language)}
                    </td>
                    <td className="px-6 py-4">
                      {isFullyPaid(invoice) ? (
                        <Badge color="success" size="sm">{t('invoice.paid')}</Badge>
                      ) : invoice.payed > 0 ? (
                        <Badge color="warning" size="sm">{t('invoice.partial')}</Badge>
                      ) : (
                        <Badge color="failure" size="sm">{t('invoice.unpaid')}</Badge>
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
