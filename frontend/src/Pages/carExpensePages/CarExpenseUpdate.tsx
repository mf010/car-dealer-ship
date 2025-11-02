import { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput, Textarea } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { carExpenseServices } from '../../services/carExpensServices';
import { carServices } from '../../services/carServices';
import { formatCurrency as formatCurrencyUtil } from '../../utils/formatters';
import type { CarExpense, UpdateCarExpenseDTO } from '../../models/CarExpens';
import type { Car } from '../../models/Car';

interface CarExpenseUpdateProps {
  expense: CarExpense;
  onClose: () => void;
  onSuccess: () => void;
}

export function CarExpenseUpdate({ expense, onClose, onSuccess }: CarExpenseUpdateProps) {
  const { t, i18n } = useTranslation();
  const [cars, setCars] = useState<Car[]>([]);
  const [formData, setFormData] = useState<UpdateCarExpenseDTO>({
    car_id: expense.car_id,
    description: expense.description,
    amount: expense.amount,
    expense_date: expense.expense_date,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await carServices.getAllCars(1, undefined);
        setCars(response.data);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError(t('messages.loadingError'));
      }
    };
    fetchCars();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.car_id || formData.car_id === 0) {
      setError(t('validation.selectCar'));
      return;
    }
    if (!formData.amount || formData.amount <= 0) {
      setError(t('validation.amountGreaterThanZero'));
      return;
    }
    if (!formData.description?.trim()) {
      setError(t('validation.descriptionRequired'));
      return;
    }
    if (!formData.expense_date) {
      setError(t('validation.expenseDateRequired'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await carExpenseServices.updateCarExpense(expense.id, formData);
      onSuccess();
    } catch (err) {
      console.error('Error updating expense:', err);
      setError(err instanceof Error ? err.message : t('messages.updateFailed'));
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return formatCurrencyUtil(amount, i18n.language);
  };

  const selectedCar = cars.find(c => c.id === formData.car_id);

  return (
    <Modal show onClose={onClose} size="2xl">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('carExpense.updateExpense')}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('carExpense.expenseId')}: #{expense.id}
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
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Car Selection */}
            <div>
              <Label htmlFor="car_id">
                {t('car.car')} <span className="text-red-500">*</span>
              </Label>
              <select
                id="car_id"
                value={formData.car_id}
                onChange={(e) => setFormData({ ...formData, car_id: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                required
              >
                <option value="0">{t('car.selectCar')}</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.carModel?.make?.name} {car.carModel?.name} (#{car.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Car Info Display */}
            {selectedCar && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  {t('car.carInformation')}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-blue-700 dark:text-blue-400">{t('make.make')}:</span>
                    <span className="ml-2 text-blue-900 dark:text-blue-300 font-medium">
                      {selectedCar.carModel?.make?.name || t('common.notAvailable')}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-400">{t('carModel.model')}:</span>
                    <span className="ml-2 text-blue-900 dark:text-blue-300 font-medium">
                      {selectedCar.carModel?.name || t('common.notAvailable')}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-400">{t('common.status')}:</span>
                    <span className="ml-2 text-blue-900 dark:text-blue-300 font-medium capitalize">
                      {selectedCar.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-400">{t('carExpense.totalExpenses')}:</span>
                    <span className={`ml-2 font-bold ${
                      selectedCar.total_expenses > 0 
                        ? 'text-orange-600 dark:text-orange-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {formatCurrency(selectedCar.total_expenses)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Amount */}
            <div>
              <Label htmlFor="amount">
                {t('carExpense.amount')} <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder={t('carExpense.enterAmount')}
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            {/* Expense Date */}
            <div>
              <Label htmlFor="expense_date">
                {t('carExpense.expenseDate')} <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="expense_date"
                type="date"
                value={formData.expense_date}
                onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">
                {t('common.description')} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder={t('carExpense.enterDescription')}
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('carExpense.descriptionHelp')}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button color="gray" onClick={onClose} disabled={loading}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('common.updating') : t('carExpense.updateExpense')}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
