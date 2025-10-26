import { useState, useEffect, useRef } from "react";
import { Modal, Button, Label, TextInput, Select } from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import { invoiceServices } from "../../services/invoiceServices";
import { clientServices } from "../../services/clientServices";
import { carServices } from "../../services/carServices";
import { accountServices } from "../../services/accountServices";
import type { Client } from "../../models/Client";
import type { Car } from "../../models/Car";
import type { Account } from "../../models/Account";

interface InvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function InvoiceForm({ isOpen, onClose, onSuccess }: InvoiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Searchable select states
  const [clientSearch, setClientSearch] = useState("");
  const [accountSearch, setAccountSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  
  // Refs for click outside detection
  const clientDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    client_id: "",
    car_id: "",
    account_id: "",
    amount: "",
    payed: "0",
    account_cut: "0",
    invoice_date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch clients, cars, and accounts on mount
  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen]);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target as Node)) {
        setShowClientDropdown(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const fetchInitialData = async () => {
    setLoadingData(true);
    try {
      const [clientsRes, carsRes, accountsRes] = await Promise.all([
        clientServices.getAllClients(1),
        carServices.getAllCars(1, { status: 'available' }),
        accountServices.getAllAccounts(1)
      ]);
      setClients(clientsRes.data);
      setCars(carsRes.data);
      setAccounts(accountsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.client_id) {
      newErrors.client_id = "Client is required";
    }

    if (!formData.car_id) {
      newErrors.car_id = "Car is required";
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (parseFloat(formData.payed) < 0) {
      newErrors.payed = "Paid amount cannot be negative";
    }

    if (parseFloat(formData.payed) > parseFloat(formData.amount)) {
      newErrors.payed = "Amount paid cannot exceed total amount";
    }

    if (parseFloat(formData.account_cut) < 0) {
      newErrors.account_cut = "Account cut cannot be negative";
    }

    if (parseFloat(formData.account_cut) > parseFloat(formData.amount)) {
      newErrors.account_cut = "Account cut cannot exceed total amount";
    }

    if (!formData.invoice_date) {
      newErrors.invoice_date = "Invoice date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await invoiceServices.createInvoice({
        client_id: parseInt(formData.client_id),
        car_id: parseInt(formData.car_id),
        account_id: formData.account_id ? parseInt(formData.account_id) : undefined,
        amount: parseFloat(formData.amount),
        payed: parseFloat(formData.payed),
        account_cut: parseFloat(formData.account_cut),
        invoice_date: formData.invoice_date,
      });

      // Reset form
      setFormData({
        client_id: "",
        car_id: "",
        account_id: "",
        amount: "",
        payed: "0",
        account_cut: "0",
        invoice_date: new Date().toISOString().split('T')[0],
      });
      setClientSearch("");
      setAccountSearch("");
      setErrors({});
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating invoice:", error);
      setErrors({ submit: "Failed to create invoice. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <HiPlus className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add New Invoice
          </h3>
        </div>

        {loadingData ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-500">Loading data...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {errors.submit && (
              <div className="p-3 text-sm text-red-800 rounded-lg bg-red-50">
                {errors.submit}
              </div>
            )}

            {/* Client Selection - Searchable */}
            <div ref={clientDropdownRef}>
              <Label htmlFor="client_id" className="mb-2 block">
                Client <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <TextInput
                  id="client_search"
                  type="text"
                  placeholder="Search client by name..."
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setShowClientDropdown(true);
                  }}
                  onFocus={() => setShowClientDropdown(true)}
                  color={errors.client_id ? "failure" : undefined}
                />
                {showClientDropdown && clientSearch && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {clients
                      .filter(client => 
                        client.name.toLowerCase().includes(clientSearch.toLowerCase())
                      )
                      .slice(0, 10)
                      .map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-900 dark:text-white"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, client_id: client.id.toString() }));
                            setClientSearch(client.name);
                            setShowClientDropdown(false);
                            if (errors.client_id) {
                              setErrors(prev => ({ ...prev, client_id: "" }));
                            }
                          }}
                        >
                          {client.name}
                        </button>
                      ))}
                    {clients.filter(client => 
                      client.name.toLowerCase().includes(clientSearch.toLowerCase())
                    ).length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        No clients found
                      </div>
                    )}
                  </div>
                )}
              </div>
              {formData.client_id && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, client_id: "" }));
                    setClientSearch("");
                    setShowClientDropdown(false);
                  }}
                  className="mt-1 text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                >
                  Clear client selection
                </button>
              )}
              {errors.client_id && (
                <p className="mt-1 text-sm text-red-600">{errors.client_id}</p>
              )}
            </div>

            {/* Car Selection */}
            <div>
              <Label htmlFor="car_id" className="mb-2 block">
                Car (Available) <span className="text-red-500">*</span>
              </Label>
              <Select
                id="car_id"
                name="car_id"
                value={formData.car_id}
                onChange={handleChange}
                color={errors.car_id ? "failure" : undefined}
                required
              >
                <option value="">Select a car</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.carModel?.make?.name} {car.carModel?.name} - #{car.id}
                  </option>
                ))}
              </Select>
              {errors.car_id && (
                <p className="mt-1 text-sm text-red-600">{errors.car_id}</p>
              )}
            </div>

            {/* Account Selection - Searchable (Optional) */}
            <div ref={accountDropdownRef}>
              <Label htmlFor="account_id" className="mb-2 block">
                Account (Optional)
              </Label>
              <div className="relative">
                <TextInput
                  id="account_search"
                  type="text"
                  placeholder="Search account by name..."
                  value={accountSearch}
                  onChange={(e) => {
                    setAccountSearch(e.target.value);
                    setShowAccountDropdown(true);
                  }}
                  onFocus={() => setShowAccountDropdown(true)}
                />
                {showAccountDropdown && accountSearch && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {accounts
                      .filter(account => 
                        account.name.toLowerCase().includes(accountSearch.toLowerCase())
                      )
                      .slice(0, 10)
                      .map((account) => (
                        <button
                          key={account.id}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-900 dark:text-white"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, account_id: account.id.toString() }));
                            setAccountSearch(account.name);
                            setShowAccountDropdown(false);
                          }}
                        >
                          {account.name}
                        </button>
                      ))}
                    {accounts.filter(account => 
                      account.name.toLowerCase().includes(accountSearch.toLowerCase())
                    ).length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        No accounts found
                      </div>
                    )}
                  </div>
                )}
              </div>
              {formData.account_id && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, account_id: "" }));
                    setAccountSearch("");
                    setShowAccountDropdown(false);
                  }}
                  className="mt-1 text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                >
                  Clear account selection
                </button>
              )}
            </div>

            {/* Amount and Paid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount" className="mb-2 block">
                  Total Amount <span className="text-red-500">*</span>
                </Label>
                <TextInput
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  color={errors.amount ? "failure" : undefined}
                  placeholder="0.00"
                  required
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>

              <div>
                <Label htmlFor="payed" className="mb-2 block">
                  Amount Paid
                </Label>
                <TextInput
                  id="payed"
                  name="payed"
                  type="number"
                  step="0.01"
                  value={formData.payed}
                  onChange={handleChange}
                  color={errors.payed ? "failure" : undefined}
                  placeholder="0.00"
                />
                {errors.payed && (
                  <p className="mt-1 text-sm text-red-600">{errors.payed}</p>
                )}
              </div>
            </div>

            {/* Account Cut and Invoice Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="account_cut" className="mb-2 block">
                  Account Cut
                </Label>
                <TextInput
                  id="account_cut"
                  name="account_cut"
                  type="number"
                  step="0.01"
                  value={formData.account_cut}
                  onChange={handleChange}
                  color={errors.account_cut ? "failure" : undefined}
                  placeholder="0.00"
                />
                {errors.account_cut && (
                  <p className="mt-1 text-sm text-red-600">{errors.account_cut}</p>
                )}
              </div>

              <div>
                <Label htmlFor="invoice_date" className="mb-2 block">
                  Invoice Date <span className="text-red-500">*</span>
                </Label>
                <TextInput
                  id="invoice_date"
                  name="invoice_date"
                  type="date"
                  value={formData.invoice_date}
                  onChange={handleChange}
                  color={errors.invoice_date ? "failure" : undefined}
                  required
                />
                {errors.invoice_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.invoice_date}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSubmit} color="blue" disabled={loading || loadingData}>
                {loading ? "Creating..." : "Create Invoice"}
              </Button>
              <Button color="gray" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
