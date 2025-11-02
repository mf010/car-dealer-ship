import { useState, useEffect } from "react";
import { Button, Pagination, Badge, TextInput, Label, Card } from "flowbite-react";
import { HiPlus, HiPencil, HiTrash, HiEye, HiSearch } from "react-icons/hi";
import { useTranslation } from 'react-i18next';
import { formatCurrency as formatCurrencyUtil, formatDate as formatDateUtil } from '../../utils/formatters';
import { dealerShipExpenseServices } from "../../services/dealerShipExpensServices";
import type { DealerShipExpense } from "../../models/DealerShipExpenses";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseUpdate } from "./ExpenseUpdate";
import { ExpenseInfoModal } from "./ExpenseInfoModal";

interface MonthlyExpenseData {
  month: string;
  total: number;
  count: number;
}

export function ExpenseList() {
  const { t, i18n } = useTranslation();
  const [expenses, setExpenses] = useState<DealerShipExpense[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterAmountFrom, setFilterAmountFrom] = useState<string>("");
  const [filterAmountTo, setFilterAmountTo] = useState<string>("");
  const [filterDescription, setFilterDescription] = useState<string>("");
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<DealerShipExpense | null>(null);

  // Monthly data for graph
  const [monthlyData, setMonthlyData] = useState<MonthlyExpenseData[]>([]);

  // Fetch expenses from API
  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: any = {};
      
      if (filterDate) filters.expense_date = filterDate;
      if (filterAmountFrom) filters.amount_from = parseFloat(filterAmountFrom);
      if (filterAmountTo) filters.amount_to = parseFloat(filterAmountTo);
      if (filterDescription) filters.description = filterDescription;
      
      const response = await dealerShipExpenseServices.getAllDealerShipExpenses(
        currentPage, 
        Object.keys(filters).length > 0 ? filters : undefined
      );
      
      // Normalize the API response to handle string amounts
      const normalizedExpenses = response.data.map((expense: any) => ({
        ...expense,
        amount: typeof expense.amount === 'string' 
          ? parseFloat(expense.amount) 
          : expense.amount,
      }));
      
      setExpenses(normalizedExpenses);
      setTotalPages(response.last_page);
      
      // Calculate monthly data
      calculateMonthlyData(normalizedExpenses);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch expenses. Please check if the API server is running.";
      setError(errorMessage);
      setExpenses([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Calculate monthly expense data for graph
  const calculateMonthlyData = (expenseData: DealerShipExpense[]) => {
    const monthMap = new Map<string, { total: number; count: number }>();
    
    expenseData.forEach(expense => {
      const date = new Date(expense.expense_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { total: 0, count: 0 });
      }
      
      const data = monthMap.get(monthKey)!;
      data.total += expense.amount;
      data.count += 1;
    });
    
    // Convert to array and sort by month
    const monthlyArray: MonthlyExpenseData[] = Array.from(monthMap.entries())
      .map(([key, value]) => {
        const [year, month] = key.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return {
          month: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
          total: value.total,
          count: value.count
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });
    
    setMonthlyData(monthlyArray.slice(-12)); // Last 12 months
  };

  // Fetch expenses when page or filters change
  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterDate, filterAmountFrom, filterAmountTo, filterDescription]);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm(t('messages.confirmDeleteExpense'))) {
      try {
        await dealerShipExpenseServices.deleteDealerShipExpense(id);
        fetchExpenses();
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  // Handle edit
  const handleEdit = (expense: DealerShipExpense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  // Handle view info
  const handleViewInfo = (expense: DealerShipExpense) => {
    setSelectedExpense(expense);
    setIsInfoModalOpen(true);
  };

  // Handle page change
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return formatCurrencyUtil(amount, i18n.language);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return formatDateUtil(dateString, i18n.language);
  };

  // Calculate max value for graph scaling
  const maxExpense = Math.max(...monthlyData.map(d => d.total), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('expense.management')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('expense.manageDescription')}
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
          <HiPlus className="mr-2 h-5 w-5" />
          {t('expense.addExpense')}
        </Button>
      </div>

      {/* Monthly Expense Graph */}
      {monthlyData.length > 0 && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('expense.monthlyExpensesOverview')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('expense.expenseTrends')}
            </p>
          </div>
          
          {/* Graph */}
          <div className="space-y-4">
            {monthlyData.map((data, index) => {
              const percentage = maxExpense > 0 ? (data.total / maxExpense) * 100 : 0;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[80px]">
                      {data.month}
                    </span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage > 15 && (
                            <span className="text-xs font-semibold text-white">
                              {formatCurrency(data.total)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(data.total)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {data.count} {data.count !== 1 ? t('expense.expenses') : t('expense.expense')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('expense.totalForDisplayedPeriod')}
              </span>
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(monthlyData.reduce((sum, d) => sum + d.total, 0))}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Filter */}
          <div>
            <Label htmlFor="filterDate">{t('expense.expenseDate')}</Label>
            <TextInput
              id="filterDate"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          {/* Amount From Filter */}
          <div>
            <Label htmlFor="filterAmountFrom">{t('financial.amountFrom')}</Label>
            <TextInput
              id="filterAmountFrom"
              type="number"
              placeholder={t('financial.minAmount')}
              value={filterAmountFrom}
              onChange={(e) => setFilterAmountFrom(e.target.value)}
            />
          </div>

          {/* Amount To Filter */}
          <div>
            <Label htmlFor="filterAmountTo">{t('financial.amountTo')}</Label>
            <TextInput
              id="filterAmountTo"
              type="number"
              placeholder={t('financial.maxAmount')}
              value={filterAmountTo}
              onChange={(e) => setFilterAmountTo(e.target.value)}
            />
          </div>

          {/* Description Filter */}
          <div>
            <Label htmlFor="filterDescription">{t('common.description')}</Label>
            <TextInput
              id="filterDescription"
              type="text"
              placeholder={t('common.searchDescription')}
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
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('common.loading')}...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{t('expense.noExpensesFound')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">{t('expense.expenseId')}</th>
                  <th scope="col" className="px-6 py-3">{t('common.description')}</th>
                  <th scope="col" className="px-6 py-3">{t('expense.amount')}</th>
                  <th scope="col" className="px-6 py-3">{t('expense.expenseDate')}</th>
                  <th scope="col" className="px-6 py-3">{t('common.status')}</th>
                  <th scope="col" className="px-6 py-3">{t('common.actions')}</th>
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
                      <Badge color="info" size="sm">
                        {t('expense.recorded')}
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
        <ExpenseForm
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchExpenses();
          }}
        />
      )}

      {isEditModalOpen && selectedExpense && (
        <ExpenseUpdate
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
        <ExpenseInfoModal
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
