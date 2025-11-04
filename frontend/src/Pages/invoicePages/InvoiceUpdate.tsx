import { useState, useEffect } from "react";
import { Modal, Button, Label, TextInput, Select } from "flowbite-react";
import { HiPencil } from "react-icons/hi";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { invoiceServices } from "../../services/invoiceServices";
import { clientServices } from "../../services/clientServices";
import { carServices } from "../../services/carServices";
import { accountServices } from "../../services/accountServices";
import type { Invoice } from "../../models/Invoice";
import type { Client } from "../../models/Client";
import type { Car } from "../../models/Car";
import type { Account } from "../../models/Account";

interface InvoiceUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  invoice: Invoice | null;
}

export function InvoiceUpdate({
  isOpen,
  onClose,
  onSuccess,
  invoice,
}: InvoiceUpdateProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    client_id: "",
    car_id: "",
    account_id: "",
    amount: "",
    payed: "",
    account_cut: "",
    invoice_date: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load data when modal opens and invoice changes
  useEffect(() => {
    if (isOpen && invoice) {
      fetchInitialData();
      setFormData({
        client_id: invoice.client_id.toString(),
        car_id: invoice.car_id.toString(),
        account_id: invoice.account_id?.toString() || "",
        amount: invoice.amount.toString(),
        payed: invoice.payed.toString(),
        account_cut: invoice.account_cut.toString(),
        invoice_date: invoice.invoice_date,
      });
    }
  }, [isOpen, invoice]);

  const fetchInitialData = async () => {
    setLoadingData(true);
    try {
      const [clientsRes, carsRes, accountsRes] = await Promise.all([
        clientServices.getAllClients(1),
        carServices.getAllCars(1),
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

    if (!formData.invoice_date) {
      newErrors.invoice_date = t('validation.invoiceDateRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoice || !validate()) {
      return;
    }

    setLoading(true);

    try {
      await invoiceServices.updateInvoice(invoice.id, {
        client_id: parseInt(formData.client_id),
        car_id: parseInt(formData.car_id),
        account_id: formData.account_id ? parseInt(formData.account_id) : undefined,
        amount: parseFloat(formData.amount),
        payed: parseFloat(formData.payed),
        account_cut: parseFloat(formData.account_cut),
        invoice_date: formData.invoice_date,
      });

      setErrors({});
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating invoice:", error);
      
      // Handle validation error from backend (422)
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const backendMessage = error.response?.data?.message;
        if (backendMessage) {
          alert(backendMessage);
          setErrors({ submit: backendMessage });
        } else {
          setErrors({ submit: t('validation.validationFailed') });
        }
      } else {
        setErrors({ submit: t('messages.updateFailed') });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!invoice) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <HiPencil className="h-6 w-6 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('invoice.updateInvoiceId', { id: invoice.id })}
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

            {/* Client Selection */}
            <div>
              <Label htmlFor="client_id" className="mb-2 block">
                {t('client.client')} <span className="text-red-500">*</span>
              </Label>
              <Select
                id="client_id"
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
                color={errors.client_id ? "failure" : undefined}
                required
              >
                <option value="">{t('client.selectClient')}</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Select>
              {errors.client_id && (
                <p className="mt-1 text-sm text-red-600">{errors.client_id}</p>
              )}
            </div>

            {/* Car Selection */}
            <div>
              <Label htmlFor="car_id" className="mb-2 block">
                {t('car.car')} <span className="text-red-500">*</span>
              </Label>
              <Select
                id="car_id"
                name="car_id"
                value={formData.car_id}
                onChange={handleChange}
                color={errors.car_id ? "failure" : undefined}
                disabled
                required
              >
                <option value="">{t('car.selectCar')}</option>
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

            {/* Account Selection (Optional) */}
            <div>
              <Label htmlFor="account_id" className="mb-2 block">
                {t('account.accountOptional')}
              </Label>
              <Select
                id="account_id"
                name="account_id"
                value={formData.account_id}
                onChange={handleChange}
              >
                <option value="">{t('account.noAccount')}</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </Select>
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
              </div>

              <div>
                <Label htmlFor="payed" className="mb-2 block">
                  {t('invoice.amountPaidReadOnly')}
                </Label>
                <TextInput
                  id="payed"
                  name="payed"
                  type="number"
                  step="0.01"
                  value={formData.payed}
                  onChange={handleChange}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
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
                {loading ? t('common.updating') : t('invoice.updateInvoice')}
              </Button>
              <Button color="gray" onClick={onClose} disabled={loading}>
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
