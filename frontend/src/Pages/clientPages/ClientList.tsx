import { useState, useEffect } from "react";
import { Button, TextInput, Pagination, Card, Badge } from "flowbite-react";
import { HiPlus, HiPencil, HiTrash, HiSearch, HiCreditCard, HiUser, HiPhone, HiLocationMarker } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { clientServices } from "../../services/clientServices";
import { formatCurrency } from "../../utils/formatters";
import type { Client } from "../../models/Client";
import { ClientForm } from "./ClientForm";
import { ClientUpdate } from "./ClientUpdate";
import { AccountInfoModal } from "./AccountInfoModal";

export function ClientList() {
  const { t } = useTranslation();
  const [clients, setClients] = useState<Client[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [showDebtOnly, setShowDebtOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Fetch clients from API
  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = searchName ? { name: searchName } : undefined;
      const response = await clientServices.getAllClients(currentPage, filters);
      setClients(response.data);
      setTotalPages(response.last_page);
    } catch (err) {
      console.error("Error fetching clients:", err);
      const errorMessage = err instanceof Error ? err.message : t('messages.failedLoadClients');
      setError(errorMessage);
      setClients([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch clients when page or search changes
  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchName, showDebtOnly]);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm(t('client.deleteConfirm'))) {
      try {
        await clientServices.deleteClient(id);
        fetchClients();
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  // Handle add client
  const handleAddClient = () => {
    setIsAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  // Handle view account info
  const handleViewAccount = (client: Client) => {
    setSelectedClient(client);
    setIsAccountInfoOpen(true);
  };

  // Handle page change
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter clients based on debt filter
  const filteredClients = showDebtOnly 
    ? clients.filter(client => client.balance < 0)
    : clients;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('client.management')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('client.manageDescription')}
          </p>
        </div>
        <Button onClick={handleAddClient} color="blue" size="md">
          <HiPlus className="mr-2 h-5 w-5" />
          {t('client.addClient')}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <span className="font-medium">{t('common.error')}</span> {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {t('client.clientSearch')}
          </label>
          <TextInput
            icon={HiSearch}
            placeholder={t('client.searchClientByName')}
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              setCurrentPage(1);
            }}
            sizing="md"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showDebtOnly}
              onChange={(e) => {
                setShowDebtOnly(e.target.checked);
                setCurrentPage(1);
              }}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
              {t('client.showDebtOnly')}
            </span>
          </label>
          {showDebtOnly && (
            <Badge color="failure" size="sm">
              {t('common.active')}
            </Badge>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500 dark:text-gray-400">
            {t('common.loading')}
          </span>
        </div>
      ) : !clients || clients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {t('client.noClients')}
          </p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {t('client.noClientsWithDebt')}
          </p>
        </div>
      ) : (
        <>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow duration-200">
                <div className="space-y-4">
                  {/* Header with Name and Balance Badge */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <HiUser className="h-5 w-5 text-gray-400" />
                      <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {client.name}
                      </h5>
                    </div>
                    {client.balance < 0 && (
                      <Badge color="failure" size="sm">
                        {t('client.debt')}
                      </Badge>
                    )}
                  </div>

                  {/* Client Details */}
                  <div className="space-y-2">
                    {client.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <HiPhone className="h-4 w-4" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    
                    {client.personal_id && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <HiCreditCard className="h-4 w-4" />
                        <span>{t('client.personalId')}: {client.personal_id}</span>
                      </div>
                    )}
                    
                    {client.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <HiLocationMarker className="h-4 w-4" />
                        <span className="truncate">{client.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Balance */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('client.balance')}:
                      </span>
                      <span className={`text-lg font-bold ${
                        client.balance < 0 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {formatCurrency(client.balance)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      size="sm"
                      color="info"
                      className="flex-1"
                      onClick={() => handleViewAccount(client)}
                    >
                      {t('client.viewAccount')}
                    </Button>
                    <Button
                      size="sm"
                      color="gray"
                      onClick={() => handleEdit(client)}
                    >
                      <HiPencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      color="failure"
                      onClick={() => handleDelete(client.id)}
                    >
                      <HiTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
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

      {/* Add Client Modal */}
      <ClientForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchClients}
      />

      {/* Edit Client Modal */}
      <ClientUpdate
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchClients}
        client={selectedClient}
      />

      {/* Account Info Modal */}
      <AccountInfoModal
        isOpen={isAccountInfoOpen}
        onClose={() => setIsAccountInfoOpen(false)}
        client={selectedClient}
        onClientUpdate={fetchClients}
      />
    </div>
  );
}
