import { useState, useEffect, useRef } from 'react';
import { Modal, Button, Label, TextInput, Textarea, Spinner } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { carExpenseServices } from '../../services/carExpensServices';
import { carServices } from '../../services/carServices';
import { formatCurrency as formatCurrencyUtil } from '../../utils/formatters';
import type { CreateCarExpenseDTO } from '../../models/CarExpens';
import type { Car } from '../../models/Car';

interface CarExpenseFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function CarExpenseForm({ onClose, onSuccess }: CarExpenseFormProps) {
  const { t, i18n } = useTranslation();
  const [searchResults, setSearchResults] = useState<Car[]>([]);
  const [formData, setFormData] = useState<CreateCarExpenseDTO>({
    car_id: 0,
    description: '',
    amount: 0,
    expense_date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [carSearch, setCarSearch] = useState<string>('');
  const [showCarDropdown, setShowCarDropdown] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const carDropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search query - wait 300ms after user stops typing
  const debouncedSearchQuery = useDebounce(carSearch, 300);

  // Search cars when debounced query changes
  useEffect(() => {
    const searchCars = async () => {
      if (!debouncedSearchQuery || debouncedSearchQuery.trim() === '' || selectedCar) {
        setSearchResults([]);
        setSearching(false);
        return;
      }

      setSearching(true);
      try {
        const results = await carServices.searchCars(debouncedSearchQuery, 15);
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching cars:', err);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    };

    searchCars();
  }, [debouncedSearchQuery, selectedCar]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (carDropdownRef.current && !carDropdownRef.current.contains(event.target as Node)) {
        setShowCarDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
    if (!formData.description.trim()) {
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
      await carExpenseServices.createCarExpense(formData);
      onSuccess();
    } catch (err) {
      console.error('Error creating expense:', err);
      setError(err instanceof Error ? err.message : t('messages.createFailed'));
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return formatCurrencyUtil(amount, i18n.language);
  };

  return (
    <Modal show onClose={onClose} size="2xl">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('carExpense.addExpense')}
          </h3>
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

            {/* Car Selection - Searchable with API */}
            <div ref={carDropdownRef}>
              <Label htmlFor="car_search">
                {t('car.carName')} <span className="text-red-500">*</span>
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
                    if (selectedCar) {
                      setSelectedCar(null);
                      setFormData({ ...formData, car_id: 0 });
                    }
                  }}
                  onFocus={() => setShowCarDropdown(true)}
                />
                {/* Search indicator */}
                {searching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Spinner size="sm" />
                  </div>
                )}
                {showCarDropdown && carSearch && !selectedCar && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {searching ? (
                      <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <Spinner size="sm" />
                        <span>{t('common.searching')}...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((car) => {
                        const carModelData = car.carModel || car.car_model;
                        const displayName = car.name || `${carModelData?.make?.name || ''} ${carModelData?.name || ''}`.trim();
                        
                        return (
                          <button
                            key={car.id}
                            type="button"
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-900 dark:text-white"
                            onClick={() => {
                              setFormData({ ...formData, car_id: car.id });
                              setCarSearch(displayName);
                              setSelectedCar(car);
                              setShowCarDropdown(false);
                            }}
                          >
                            <div className="font-medium">
                              {displayName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: #{car.id} • {carModelData?.make?.name || ''} {carModelData?.name || ''}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {t('car.noCarsFound')}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {formData.car_id > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, car_id: 0 });
                    setCarSearch("");
                    setSelectedCar(null);
                    setShowCarDropdown(false);
                  }}
                  className="mt-1 text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                >
                  {t('common.clearSelection')}
                </button>
              )}
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
                      {(selectedCar.carModel || selectedCar.car_model)?.make?.name || t('common.notAvailable')}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-400">{t('carModel.model')}:</span>
                    <span className="ml-2 text-blue-900 dark:text-blue-300 font-medium">
                      {(selectedCar.carModel || selectedCar.car_model)?.name || t('common.notAvailable')}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-400">{t('common.status')}:</span>
                    <span className="ml-2 text-blue-900 dark:text-blue-300 font-medium">
                      {selectedCar.status === 'available' ? t('car.available') : t('car.sold')}
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
              {loading ? t('common.creating') : t('carExpense.addExpense')}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
