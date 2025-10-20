import { useState, useEffect } from "react";
import { Button, TextInput, Pagination, Card, Badge } from "flowbite-react";
import { HiPlus, HiPencil, HiTrash, HiSearch, HiUser, HiPhone, HiInformationCircle } from "react-icons/hi";
import { accountServices } from "../../services/accountServices";
import type { Account } from "../../models/Account";
import { AccountForm } from "./AccountForm";
import { AccountUpdate } from "./AccountUpdate";
import { AccountInfoModal } from "./AccountInfoModal";

export function AccountList() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // Fetch accounts from API
  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = searchName ? { name: searchName } : undefined;
      const response = await accountServices.getAllAccounts(currentPage, filters);
      setAccounts(response.data);
      setTotalPages(response.last_page);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch accounts. Please check if the API server is running.";
      setError(errorMessage);
      setAccounts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch accounts when page or search changes
  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchName]);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        await accountServices.deleteAccount(id);
        fetchAccounts();
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  // Handle add account
  const handleAddAccount = () => {
    setIsAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (account: Account) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  // Handle view account info
  const handleViewAccount = (account: Account) => {
    setSelectedAccount(account);
    setIsAccountInfoOpen(true);
  };

  // Handle page change
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employee Accounts
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage employee account information and balances
          </p>
        </div>
        <Button onClick={handleAddAccount} color="blue" size="md">
          <HiPlus className="mr-2 h-5 w-5" />
          Add Account
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <span className="font-medium">Error!</span> {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="max-w-md">
        <TextInput
          icon={HiSearch}
          placeholder="Search by name..."
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setCurrentPage(1);
          }}
          sizing="md"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500 dark:text-gray-400">
            Loading accounts...
          </span>
        </div>
      ) : !accounts || accounts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No accounts found
          </p>
        </div>
      ) : (
        <>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <Card key={account.id} className="hover:shadow-lg transition-shadow duration-200">
                <div className="space-y-4">
                  {/* Header with Name and Balance Badge */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <HiUser className="h-5 w-5 text-gray-400" />
                      <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {account.name}
                      </h5>
                    </div>
                    {account.balance < 0 && (
                      <Badge color="failure" size="sm">
                        Debt
                      </Badge>
                    )}
                  </div>

                  {/* Account Details */}
                  <div className="space-y-2">
                    {account.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <HiPhone className="h-4 w-4" />
                        <span>{account.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <HiInformationCircle className="h-4 w-4" />
                      <span>Account ID: {account.id}</span>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Balance:
                      </span>
                      <span className={`text-lg font-bold ${
                        account.balance < 0 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {formatCurrency(account.balance)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      size="sm"
                      color="info"
                      className="flex-1"
                      onClick={() => handleViewAccount(account)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      color="gray"
                      onClick={() => handleEdit(account)}
                    >
                      <HiPencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      color="failure"
                      onClick={() => handleDelete(account.id)}
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

      {/* Add Account Modal */}
      <AccountForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchAccounts}
      />

      {/* Edit Account Modal */}
      <AccountUpdate
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchAccounts}
        account={selectedAccount}
      />

      {/* Account Info Modal */}
      <AccountInfoModal
        isOpen={isAccountInfoOpen}
        onClose={() => setIsAccountInfoOpen(false)}
        account={selectedAccount}
        onAccountUpdate={fetchAccounts}
      />
    </div>
  );
}
