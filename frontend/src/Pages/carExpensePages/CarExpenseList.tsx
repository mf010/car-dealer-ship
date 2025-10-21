import { useState, useEffect } from "react";
import { Button, Pagination, Badge, TextInput, Label } from "flowbite-react";
import { HiPlus, HiPencil, HiTrash, HiEye, HiSearch } from "react-icons/hi";
import { carExpenseServices } from "../../services/carExpensServices";
import { carServices } from "../../services/carServices";
import type { CarExpense } from "../../models/CarExpens";
import type { Car } from "../../models/Car";
import { CarExpenseForm } from "./CarExpenseForm";
import { CarExpenseUpdate } from "./CarExpenseUpdate";
import { CarExpenseInfoModal } from "./CarExpenseInfoModal";

export function CarExpenseList() {
  const [expenses, setExpenses] = useState<CarExpense[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [filterCarId, setFilterCarId] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterMinAmount, setFilterMinAmount] = useState<string>("");
  const [filterMaxAmount, setFilterMaxAmount] = useState<string>("");
  const [filterDescription, setFilterDescription] = useState<string>("");
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<CarExpense | null>(null);

  // Fetch cars for dropdown
  const fetchCars = async () => {
    try {
      const response = await carServices.getAllCars(1, undefined);
      setCars(response.data);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  };

  // Fetch expenses from API
  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: any = {};
      
      if (filterCarId) filters.car_id = parseInt(filterCarId);
      if (filterDate) filters.expense_date = filterDate;
      if (filterMinAmount) filters.min_amount = parseFloat(filterMinAmount);
      if (filterMaxAmount) filters.max_amount = parseFloat(filterMaxAmount);
      if (filterDescription) filters.description = filterDescription;
      
      const response = await carExpenseServices.getAllCarExpenses(
        currentPage, 
        Object.keys(filters).length > 0 ? filters : undefined
      );
      setExpenses(response.data);
      setTotalPages(response.last_page);
    } catch (err) {
      console.error("Error fetching car expenses:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch car expenses. Please check if the API server is running.";
      setError(errorMessage);
      setExpenses([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cars on mount
  useEffect(() => {
    fetchCars();
  }, []);

  // Fetch expenses when page or filters change
  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterCarId, filterDate, filterMinAmount, filterMaxAmount, filterDescription]);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await carExpenseServices.deleteCarExpense(id);
        fetchExpenses();
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  // Handle edit
  const handleEdit = (expense: CarExpense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  // Handle view info
  const handleViewInfo = (expense: CarExpense) => {
    setSelectedExpense(expense);
    setIsInfoModalOpen(true);
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get car display name
  const getCarDisplayName = (expense: CarExpense) => {
    if (expense.car && expense.car.carModel) {
      const make = expense.car.carModel.make?.name || 'Unknown Make';
      const model = expense.car.carModel.name || 'Unknown Model';
      return `${make} ${model}`;
    }
    return `Car #${expense.car_id}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Car Expenses
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track and manage vehicle-related expenses
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
          <HiPlus className="mr-2 h-5 w-5" />
          Add Expense
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Car Filter */}
          <div>
            <Label htmlFor="filterCar">Filter by Car</Label>
            <select
              id="filterCar"
              value={filterCarId}
              onChange={(e) => setFilterCarId(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            >
              <option value="">All Cars</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.carModel?.make?.name} {car.carModel?.name} (#{car.id})
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <Label htmlFor="filterDate">Expense Date</Label>
            <TextInput
              id="filterDate"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          {/* Min Amount Filter */}
          <div>
            <Label htmlFor="filterMinAmount">Min Amount</Label>
            <TextInput
              id="filterMinAmount"
              type="number"
              placeholder="Min amount"
              value={filterMinAmount}
              onChange={(e) => setFilterMinAmount(e.target.value)}
            />
          </div>

          {/* Max Amount Filter */}
          <div>
            <Label htmlFor="filterMaxAmount">Max Amount</Label>
            <TextInput
              id="filterMaxAmount"
              type="number"
              placeholder="Max amount"
              value={filterMaxAmount}
              onChange={(e) => setFilterMaxAmount(e.target.value)}
            />
          </div>

          {/* Description Filter */}
          <div>
            <Label htmlFor="filterDescription">Description</Label>
            <TextInput
              id="filterDescription"
              type="text"
              placeholder="Search description"
              icon={HiSearch}
              value={filterDescription}
              onChange={(e) => setFilterDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Expenses Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading expenses...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No expenses found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Expense ID</th>
                  <th scope="col" className="px-6 py-3">Car</th>
                  <th scope="col" className="px-6 py-3">Description</th>
                  <th scope="col" className="px-6 py-3">Amount</th>
                  <th scope="col" className="px-6 py-3">Expense Date</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      #{expense.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {getCarDisplayName(expense)}
                        </div>
                        {expense.car && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Car ID: #{expense.car_id}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate" title={expense.description}>
                        {expense.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(expense.expense_date)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge color="success" size="sm">
                        Recorded
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          color="blue"
                          onClick={() => handleViewInfo(expense)}
                        >
                          <HiEye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="xs"
                          color="gray"
                          onClick={() => handleEdit(expense)}
                        >
                          <HiPencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => handleDelete(expense.id)}
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
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            showIcons
          />
        </div>
      )}

      {/* Modals */}
      {isAddModalOpen && (
        <CarExpenseForm
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchExpenses();
          }}
        />
      )}

      {isEditModalOpen && selectedExpense && (
        <CarExpenseUpdate
          expense={selectedExpense}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedExpense(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setSelectedExpense(null);
            fetchExpenses();
          }}
        />
      )}

      {isInfoModalOpen && selectedExpense && (
        <CarExpenseInfoModal
          expense={selectedExpense}
          onClose={() => {
            setIsInfoModalOpen(false);
            setSelectedExpense(null);
          }}
        />
      )}
    </div>
  );
}
