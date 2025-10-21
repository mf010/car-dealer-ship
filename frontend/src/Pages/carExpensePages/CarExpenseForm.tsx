import { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput, Textarea } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import { carExpenseServices } from '../../services/carExpensServices';
import { carServices } from '../../services/carServices';
import type { CreateCarExpenseDTO } from '../../models/CarExpens';
import type { Car } from '../../models/Car';

interface CarExpenseFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CarExpenseForm({ onClose, onSuccess }: CarExpenseFormProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [formData, setFormData] = useState<CreateCarExpenseDTO>({
    car_id: 0,
    description: '',
    amount: 0,
    expense_date: new Date().toISOString().split('T')[0], // Today's date
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
        setError('Failed to load cars');
      }
    };
    fetchCars();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.car_id || formData.car_id === 0) {
      setError('Please select a car');
      return;
    }
    if (!formData.amount || formData.amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }
    if (!formData.expense_date) {
      setError('Please select an expense date');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await carExpenseServices.createCarExpense(formData);
      onSuccess();
    } catch (err) {
      console.error('Error creating expense:', err);
      setError(err instanceof Error ? err.message : 'Failed to create expense');
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const selectedCar = cars.find(c => c.id === formData.car_id);

  return (
    <Modal show onClose={onClose} size="2xl">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Car Expense
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

            {/* Car Selection */}
            <div>
              <Label htmlFor="car_id">
                Car <span className="text-red-500">*</span>
              </Label>
              <select
                id="car_id"
                value={formData.car_id}
                onChange={(e) => setFormData({ ...formData, car_id: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                required
              >
                <option value="0">Select a car...</option>
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
                  Car Information
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-blue-700 dark:text-blue-400">Make:</span>
                    <span className="ml-2 text-blue-900 dark:text-blue-300 font-medium">
                      {selectedCar.carModel?.make?.name || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-400">Model:</span>
                    <span className="ml-2 text-blue-900 dark:text-blue-300 font-medium">
                      {selectedCar.carModel?.name || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-400">Status:</span>
                    <span className="ml-2 text-blue-900 dark:text-blue-300 font-medium capitalize">
                      {selectedCar.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-400">Total Expenses:</span>
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
                Amount <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter expense amount"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            {/* Expense Date */}
            <div>
              <Label htmlFor="expense_date">
                Expense Date <span className="text-red-500">*</span>
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
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Enter expense description (e.g., Oil change, Tire replacement, Body repair)"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Provide details about the expense, service, or repair
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button color="gray" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
