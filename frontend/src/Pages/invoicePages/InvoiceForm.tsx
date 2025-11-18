import { useState, useEffect, useRef } from "react";
import { Modal, Button, Label, TextInput } from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Searchable select states
  const [clientSearch, setClientSearch] = useState("");
  const [carSearch, setCarSearch] = useState("");
  const [accountSearch, setAccountSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showCarDropdown, setShowCarDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  
  // Refs for click outside detection
  const clientDropdownRef = useRef<HTMLDivElement>(null);
  const carDropdownRef = useRef<HTMLDivElement>(null);
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
      if (carDropdownRef.current && !carDropdownRef.current.contains(event.target as Node)) {
        setShowCarDropdown(false);
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

  // Calculate net profit
  const calculateNetProfit = (): number => {
    if (!selectedCar || !formData.amount) return 0;
    
    const invoiceAmount = parseFloat(formData.amount) || 0;
    const purchasePrice = parseFloat(String(selectedCar.purchase_price)) || 0;
    const totalExpenses = parseFloat(String(selectedCar.total_expenses)) || 0;
    const accountCut = parseFloat(formData.account_cut) || 0;
    
    return invoiceAmount - purchasePrice - totalExpenses - accountCut;
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.client_id) {
      newErrors.client_id = t('validation.clientRequired');
    }

    if (!formData.car_id) {
      newErrors.car_id = t('validation.carRequired');
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = t('validation.amountGreaterThanZero');
    }

    if (parseFloat(formData.payed) < 0) {
      newErrors.payed = t('validation.paidAmountNonNegative');
    }

    if (parseFloat(formData.payed) > parseFloat(formData.amount)) {
      newErrors.payed = t('validation.paidExceedsTotal');
    }

    if (parseFloat(formData.account_cut) < 0) {
      newErrors.account_cut = t('validation.accountCutNonNegative');
    }

    if (parseFloat(formData.account_cut) > parseFloat(formData.amount)) {
      newErrors.account_cut = t('validation.accountCutExceedsTotal');
    }

    if (!formData.invoice_date) {
      newErrors.invoice_date = t('validation.invoiceDateRequired');
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
      setCarSearch("");
      setAccountSearch("");
      setSelectedCar(null);
      setErrors({});
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating invoice:", error);
      setErrors({ submit: t('messages.createFailed') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="xl">
      <div className="max-h-[85vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <HiPlus className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('invoice.addInvoice')}
          </h3>
        </div>

        {loadingData ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-500">{t('common.loadingData')}</span>
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
                {t('client.client')} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <TextInput
                  id="client_search"
                  type="text"
                  placeholder={t('client.searchByName')}
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
                        {t('common.noClientsFound')}
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
                  {t('common.clearClientSelection')}
                </button>
              )}
              {errors.client_id && (
                <p className="mt-1 text-sm text-red-600">{errors.client_id}</p>
              )}
            </div>

            {/* Car Selection - Searchable */}
            <div ref={carDropdownRef}>
              <Label htmlFor="car_id" className="mb-2 block">
                {t('car.carAvailable')} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <TextInput
                  id="car_search"
                  type="text"
                  placeholder={t('car.searchByName')}
                  value={carSearch}
                  onChange={(e) => {
                    setCarSearch(e.target.value);
                    setShowCarDropdown(true);
                  }}
                  onFocus={() => setShowCarDropdown(true)}
                  color={errors.car_id ? "failure" : undefined}
                />
                {showCarDropdown && carSearch && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {cars
                      .filter(car => {
                        const searchLower = carSearch.toLowerCase();
                        const carName = car.name?.toLowerCase() || '';
                        const carModelData = car.carModel || car.car_model;
                        const makeName = carModelData?.make?.name?.toLowerCase() || '';
                        const modelName = carModelData?.name?.toLowerCase() || '';
                        const carId = car.id.toString();
                        
                        return carName.includes(searchLower) ||
                               makeName.includes(searchLower) ||
                               modelName.includes(searchLower) ||
                               carId.includes(searchLower);
                      })
                      .slice(0, 10)
                      .map((car) => {
                        const carModelData = car.carModel || car.car_model;
                        return (
                        <button
                          key={car.id}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-900 dark:text-white"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, car_id: car.id.toString() }));
                            setCarSearch(car.name || `${carModelData?.make?.name} ${carModelData?.name}`);
                            setSelectedCar(car);
                            setShowCarDropdown(false);
                            if (errors.car_id) {
                              setErrors(prev => ({ ...prev, car_id: "" }));
                            }
                          }}
                        >
                          <div className="font-medium">
                            {car.name || `${carModelData?.make?.name} ${carModelData?.name}`}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: #{car.id} • {carModelData?.make?.name} {carModelData?.name}
                          </div>
                        </button>
                        );
                      })}
                    {cars.filter(car => {
                      const searchLower = carSearch.toLowerCase();
                      const carName = car.name?.toLowerCase() || '';
                      const carModelData = car.carModel || car.car_model;
                      const makeName = carModelData?.make?.name?.toLowerCase() || '';
                      const modelName = carModelData?.name?.toLowerCase() || '';
                      const carId = car.id.toString();
                      
                      return carName.includes(searchLower) ||
                             makeName.includes(searchLower) ||
                             modelName.includes(searchLower) ||
                             carId.includes(searchLower);
                    }).length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {t('car.noCarsFound')}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {formData.car_id && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, car_id: "" }));
                    setCarSearch("");
                    setSelectedCar(null);
                    setShowCarDropdown(false);
                  }}
                  className="mt-1 text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                >
                  {t('common.clearSelection')}
                </button>
              )}
              {errors.car_id && (
                <p className="mt-1 text-sm text-red-600">{errors.car_id}</p>
              )}
              
              {/* Selected Car Info Display */}
              {selectedCar && (
                <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    {t('car.carInformation')}
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">{t('car.carId')}:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">#{selectedCar.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">{t('car.make')}:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {(selectedCar.carModel || selectedCar.car_model)?.make?.name || t('common.notAvailable')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">{t('car.model')}:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {(selectedCar.carModel || selectedCar.car_model)?.name || t('common.notAvailable')}
                      </span>
                    </div>
                    {selectedCar.name && (
                      <div className="col-span-3">
                        <span className="text-gray-600 dark:text-gray-400">{t('car.carName')}:</span>
                        <span className="ml-1 font-medium text-gray-900 dark:text-white">{selectedCar.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Account Selection - Searchable (Optional) */}
            <div ref={accountDropdownRef}>
              <Label htmlFor="account_id" className="mb-2 block">
                {t('account.accountOptional')}
              </Label>
              <div className="relative">
                <TextInput
                  id="account_search"
                  type="text"
                  placeholder={t('account.searchByName')}
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
                  {t('common.clearAccountSelection')}
                </button>
              )}
            </div>

            {/* Amount and Paid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount" className="mb-2 block">
                  {t('invoice.totalAmount')} <span className="text-red-500">*</span>
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
                
                {/* Net Profit Display */}
                {selectedCar && formData.amount && parseFloat(formData.amount) > 0 && (
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t('common.netProfit')}:</span>
                      <span className={`font-semibold ${
                        calculateNetProfit() >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-LY' : 'en-US', {
                          style: 'currency',
                          currency: 'LYD',
                          minimumFractionDigits: 2
                        }).format(calculateNetProfit())}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="payed" className="mb-2 block">
                  {t('invoice.amountPaid')}
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
                  {t('invoice.accountCut')}
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
                  {t('invoice.invoiceDate')} <span className="text-red-500">*</span>
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
                {loading ? t('common.creating') : t('invoice.createInvoice')}
              </Button>
              <Button color="gray" onClick={onClose} disabled={loading}>
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        )}
      </div>
      </div>
    </Modal>
  );
}
