import { useState } from "react";
import { Button, Card, Badge, Label, TextInput, Spinner } from "flowbite-react";
import { HiCalendar, HiDocumentReport, HiPlay } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { carServices } from "../services/carServices";
import { dealerShipExpenseServices } from "../services/dealerShipExpensServices";
import { formatCurrency } from "../utils/formatters";
import type { DealerShipExpense } from "../models/DealerShipExpenses";

interface CarNotSoldReport {
  id: number;
  name: string | null;
  make: string | null;
  model: string | null;
  status: string;
  purchase_price: number;
  total_expenses: number;
  created_at: string;
  sold_after_starting_date: boolean;
  sold_date: string | null;
  selling_price: number | null;
}

interface CarSoldReport {
  id: number;
  make: string | null;
  model: string | null;
  status: string;
  purchase_price: number;
  total_expenses: number;
  created_at: string;
  sold_date: string;
  invoice_id: number;
  invoice_amount: number;
  client_id: number;
  total_invoices_in_range: number;
}

interface CarPurchasedAndSoldReport {
  car_id: number;
  car_name: string | null;
  car_make: string | null;
  car_model: string | null;
  car_purchase_price: number;
  car_total_expenses: number;
  car_created_at: string;
  invoice_id: number | null;
  invoice_date: string | null;
  invoice_amount: number;
  profit: number;
  client_id: number | null;
  client_name: string | null;
}

interface DealershipExpenseReport {
  starting_date: string;
  ending_date: string;
  total_expenses: number;
  total_amount: number;
  expenses: DealerShipExpense[];
}

export function Dashboard() {
  const { t } = useTranslation();

  // Shared date inputs
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");

  // Loading state for all reports
  const [loadingReports, setLoadingReports] = useState(false);

  // State for first report (Cars Not Sold Before Date)
  const [notSoldReport, setNotSoldReport] = useState<{
    starting_date: string;
    total_cars: number;
    cars: CarNotSoldReport[];
  } | null>(null);

  // State for second report (Cars Sold Between Dates) - HIDDEN but kept for future use
  const [_soldReport, setSoldReport] = useState<{
    starting_date: string;
    ending_date: string;
    total_cars: number;
    cars: CarSoldReport[];
  } | null>(null);

  // State for third report (All Cars Purchased Within Period)
  const [invoicesReport, setInvoicesReport] = useState<{
    starting_date: string;
    ending_date: string;
    total_cars: number;
    total_invoice_amount: number;
    total_purchase_price: number;
    total_expenses: number;
    total_profit: number;
    cars: CarPurchasedAndSoldReport[];
  } | null>(null);

  // State for fourth report (Dealership Expenses Between Dates)
  const [expensesReport, setExpensesReport] = useState<DealershipExpenseReport | null>(null);

  // Generate all reports with single button
  const handleGenerateAllReports = async () => {
    if (!startingDate || !endingDate) {
      alert(t("validation.required"));
      return;
    }

    if (startingDate >= endingDate) {
      alert(t("validation.invalidDate"));
      return;
    }

    setLoadingReports(true);

    try {
      // Generate all reports in parallel
      const [notSoldData, soldData, invoicesData, expensesData] = await Promise.all([
        carServices.reportCarsNotSoldBeforeStartDate(startingDate),
        carServices.reportCarsSoldBetweenDates(startingDate, endingDate),
        carServices.reportInvoicesBetweenDates(startingDate, endingDate),
        dealerShipExpenseServices.reportExpensesBetweenDates(startingDate, endingDate)
      ]);

      setNotSoldReport(notSoldData);
      setSoldReport(soldData);
      setInvoicesReport(invoicesData);
      setExpensesReport(expensesData);
    } catch (error) {
      console.error("Error generating reports:", error);
      alert(t("dashboard.failedToLoadReport"));
    } finally {
      setLoadingReports(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6 p-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("dashboard.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("dashboard.overview")}
          </p>
        </div>
      </div>

      {/* Unified Report Input Panel */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-800 border-2 border-blue-200 dark:border-gray-600">
        <div className="flex items-center gap-2 mb-4">
          <HiDocumentReport className="text-2xl text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t("dashboard.reportInputPanel") || "Report Input Panel"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="startingDate" className="text-gray-700 dark:text-gray-300 font-medium">
              {t("dashboard.startingDate")}
            </Label>
            <TextInput
              id="startingDate"
              type="date"
              value={startingDate}
              onChange={(e) => setStartingDate(e.target.value)}
              placeholder={t("dashboard.selectStartDate")}
              icon={HiCalendar}
              className="mt-1"
            />

          </div>
          <div>
            <Label htmlFor="endingDate" className="text-gray-700 dark:text-gray-300 font-medium">
              {t("dashboard.endingDate")}
            </Label>
            <TextInput
              id="endingDate"
              type="date"
              value={endingDate}
              onChange={(e) => setEndingDate(e.target.value)}
              placeholder={t("dashboard.selectEndDate")}
              icon={HiCalendar}
              className="mt-1"
            />
          </div>
          <div className="flex items-center pt-6">
            <Button
              onClick={handleGenerateAllReports}
              disabled={loadingReports || !startingDate || !endingDate}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            // gradientDuoTone="purpleToBlue" // Removed to fix error

            >
              {loadingReports ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  {t("common.loading")}
                </>
              ) : (
                <>
                  <HiPlay className="mr-2 h-5 w-5" />
                  {t("dashboard.generateAllReports") || "Generate Reports"}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Space for additional reports - Add your future reports here */}
        {/* 
          Future Report Example:
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
            <p className="text-sm text-gray-500">Report 3: Your new report here</p>
          </div>
        */}
      </Card>

      {/* Report 1: Cars Not Sold Before Date - Grouped by Status */}
      {notSoldReport && (() => {
        // Separate cars by status and selling status
        const availableCars = notSoldReport.cars.filter(car => car.status === "available");
        // Unavailable includes: reserved, sold, or any status that's not available
        const unavailableCars = notSoldReport.cars.filter(car => car.status !== "available");
        
        // Further separate unavailable cars into actually sold (with invoice) and others
        const soldCars = unavailableCars.filter(car => car.selling_price !== null);
        
        // Calculate totals for available cars
        const availableTotalPurchase = availableCars.reduce((sum, car) => sum + Number(car.purchase_price), 0);
        const availableTotalExpenses = availableCars.reduce((sum, car) => sum + Number(car.total_expenses), 0);
        
        // Calculate totals for sold cars (unavailable with selling_price)
        const soldTotalPurchase = soldCars.reduce((sum, car) => sum + Number(car.purchase_price), 0);
        const soldTotalExpenses = soldCars.reduce((sum, car) => sum + Number(car.total_expenses), 0);
        const soldTotalSelling = soldCars.reduce((sum, car) => sum + Number(car.selling_price), 0);
        const soldTotalProfit = soldTotalSelling - soldTotalPurchase - soldTotalExpenses;

        // Table header component to avoid repetition
        const TableHeader = () => (
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="bg-blue-50 dark:bg-blue-900/20">
              <th scope="col" className="px-6 py-3">{t("dashboard.carId")}</th>
              <th scope="col" className="px-6 py-3">{t("car.make")}</th>
              <th scope="col" className="px-6 py-3">{t("car.model")}</th>
              <th scope="col" className="px-6 py-3">{t("car.name")}</th>
              <th scope="col" className="px-6 py-3">{t("car.purchasePrice")}</th>
              <th scope="col" className="px-6 py-3">{t("car.totalExpenses")}</th>
              <th scope="col" className="px-6 py-3">{t("dashboard.sellingPrice")}</th>
              <th scope="col" className="px-6 py-3">{t("common.createdAt")}</th>
              <th scope="col" className="px-6 py-3">{t("dashboard.soldDate")}</th>
            </tr>
          </thead>
        );

        // Car row component
        const CarRow = ({ car }: { car: CarNotSoldReport }) => (
          <tr key={car.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
              #{car.id}
            </td>
            <td className="px-6 py-4">{car.make || t("common.notAvailable")}</td>
            <td className="px-6 py-4">{car.model || t("common.notAvailable")}</td>
            <td className="px-6 py-4">{car.name || t("common.notAvailable")}</td>
            <td className="px-6 py-4">{formatCurrency(car.purchase_price)}</td>
            <td className="px-6 py-4">{formatCurrency(car.total_expenses)}</td>
            <td className="px-6 py-4">
              {car.selling_price ? formatCurrency(car.selling_price) : "-"}
            </td>
            <td className="px-6 py-4">{formatDate(car.created_at)}</td>
            <td className="px-6 py-4">
              {car.sold_date ? formatDate(car.sold_date) : t("dashboard.notSoldYet")}
            </td>
          </tr>
        );

        return (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <HiDocumentReport className="text-2xl text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("dashboard.carsNotSoldBeforeDate")}
              </h2>
              <Badge color="blue" className="ml-auto">
                {t("dashboard.startingDate")}: {formatDate(notSoldReport.starting_date)}
              </Badge>
            </div>

            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{t("dashboard.totalCars")}:</span>{" "}
                {notSoldReport.total_cars}
              </p>
            </div>

            {notSoldReport.cars.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  {t("dashboard.noReportData")}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Available Cars Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-300 dark:border-green-700">
                    <Badge color="success" size="lg">
                      {t("dashboard.availableCars")}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({availableCars.length} {t("dashboard.totalCars").toLowerCase()})
                    </span>
                  </div>
                  
                  {availableCars.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {t("dashboard.noReportData")}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <TableHeader />
                        <tbody>
                          {availableCars.map((car) => (
                            <CarRow key={car.id} car={car} />
                          ))}
                          {/* Subtotal row for available cars */}
                          <tr className="bg-green-50 dark:bg-green-900/30 font-bold border-t-2 border-green-200 dark:border-green-700">
                            <td colSpan={4} className="px-6 py-4 text-right text-gray-900 dark:text-white">
                              {t("dashboard.subtotal")}:
                            </td>
                            <td className="px-6 py-4 text-green-600 dark:text-green-400">
                              {formatCurrency(availableTotalPurchase)}
                            </td>
                            <td className="px-6 py-4 text-green-600 dark:text-green-400">
                              {formatCurrency(availableTotalExpenses)}
                            </td>
                            <td colSpan={3}></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {/* Summary for available cars */}
                  {availableCars.length > 0 && (
                    <div className="mt-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.totalPurchasePrice")}</p>
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">{formatCurrency(availableTotalPurchase)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.totalExpensesSum")}</p>
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">{formatCurrency(availableTotalExpenses)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Unavailable (Sold) Cars Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-gray-300 dark:border-gray-600">
                    <Badge color="gray" size="lg">
                      {t("dashboard.unavailableCars")}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({soldCars.length} {t("dashboard.totalCars").toLowerCase()})
                    </span>
                  </div>
                  
                  {soldCars.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {t("dashboard.noReportData")}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <TableHeader />
                        <tbody>
                          {soldCars.map((car) => (
                            <CarRow key={car.id} car={car} />
                          ))}
                          {/* Subtotal row for sold cars */}
                          <tr className="bg-gray-100 dark:bg-gray-700 font-bold border-t-2 border-gray-300 dark:border-gray-600">
                            <td colSpan={4} className="px-6 py-4 text-right text-gray-900 dark:text-white">
                              {t("dashboard.subtotal")}:
                            </td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                              {formatCurrency(soldTotalPurchase)}
                            </td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                              {formatCurrency(soldTotalExpenses)}
                            </td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                              {formatCurrency(soldTotalSelling)}
                            </td>
                            <td colSpan={2}></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {/* Summary for sold cars */}
                  {soldCars.length > 0 && (
                    <div className="mt-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.totalPurchasePrice")}</p>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(soldTotalPurchase)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.totalExpensesSum")}</p>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(soldTotalExpenses)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.totalSellingPrice")}</p>
                        <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">{formatCurrency(soldTotalSelling)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.totalProfit")}</p>
                        <p className={`text-lg font-semibold ${soldTotalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {formatCurrency(soldTotalProfit)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        );
      })()}

      {/* Report 2: Cars Sold Between Dates - HIDDEN
      {soldReport && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <HiDocumentReport className="text-2xl text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("dashboard.carsSoldBetweenDates")}
            </h2>
            <Badge color="green" className="ml-auto">
              {formatDate(soldReport.starting_date)} - {formatDate(soldReport.ending_date)}
            </Badge>
          </div>

          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">{t("dashboard.totalCars")}:</span>{" "}
              {soldReport.total_cars}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">{t("dashboard.carId")}</th>
                  <th scope="col" className="px-6 py-3">{t("car.make")}</th>
                  <th scope="col" className="px-6 py-3">{t("car.model")}</th>
                  <th scope="col" className="px-6 py-3">{t("car.purchasePrice")}</th>
                  <th scope="col" className="px-6 py-3">{t("car.totalExpenses")}</th>
                  <th scope="col" className="px-6 py-3">{t("dashboard.soldDate")}</th>
                  <th scope="col" className="px-6 py-3">{t("dashboard.invoiceId")}</th>
                  <th scope="col" className="px-6 py-3">{t("dashboard.invoiceAmount")}</th>
                  <th scope="col" className="px-6 py-3">{t("dashboard.clientId")}</th>
                </tr>
              </thead>
              <tbody>
                {soldReport.cars.length === 0 ? (
                  <tr className="bg-white dark:bg-gray-800">
                    <td colSpan={9} className="px-6 py-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        {t("dashboard.noReportData")}
                      </p>
                    </td>
                  </tr>
                ) : (
                  soldReport.cars.map((car) => (
                    <tr key={car.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        #{car.id}
                      </td>
                      <td className="px-6 py-4">{car.make || t("common.notAvailable")}</td>
                      <td className="px-6 py-4">{car.model || t("common.notAvailable")}</td>
                      <td className="px-6 py-4">{formatCurrency(car.purchase_price)}</td>
                      <td className="px-6 py-4">{formatCurrency(car.total_expenses)}</td>
                      <td className="px-6 py-4">{formatDate(car.sold_date)}</td>
                      <td className="px-6 py-4 font-medium">#{car.invoice_id}</td>
                      <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(car.invoice_amount)}
                      </td>
                      <td className="px-6 py-4">#{car.client_id}</td>
                    </tr>
                  ))
                )}
                {soldReport.cars.length > 0 && (
                  <>
                    <tr className="bg-gray-50 dark:bg-gray-700 font-bold">
                      <td colSpan={7} className="px-6 py-4 text-right text-gray-900 dark:text-white">
                        {t("dashboard.totalInvoiceAmount")}:
                      </td>
                      <td className="px-6 py-4 text-green-600 dark:text-green-400">
                        {formatCurrency(soldReport.cars.reduce((sum, car) => sum + Number(car.invoice_amount), 0))}
                      </td>
                      <td></td>
                    </tr>
                    <tr className="bg-green-100 dark:bg-green-900/40 font-bold border-t-2 border-green-300 dark:border-green-700">
                      <td colSpan={7} className="px-6 py-4 text-right text-gray-900 dark:text-white">
                        {t("dashboard.totalProfit")}:
                      </td>
                      <td className="px-6 py-4 text-green-700 dark:text-green-300 text-lg">
                        {formatCurrency(soldReport.cars.reduce((sum, car) =>
                          sum + (Number(car.invoice_amount) - Number(car.purchase_price) - Number(car.total_expenses)), 0))}
                      </td>
                      <td></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      */}

      {/* Report 3: Invoices Between Dates - Grouped by Status */}
      {invoicesReport && (() => {
        // Separate cars by sold status (has invoice = sold, no invoice = available)
        const availableCars = invoicesReport.cars.filter(car => car.invoice_id === null);
        const soldCars = invoicesReport.cars.filter(car => car.invoice_id !== null);
        
        // Calculate totals for available cars
        const availableTotalPurchase = availableCars.reduce((sum, car) => sum + Number(car.car_purchase_price), 0);
        const availableTotalExpenses = availableCars.reduce((sum, car) => sum + Number(car.car_total_expenses), 0);
        
        // Calculate totals for sold cars
        const soldTotalPurchase = soldCars.reduce((sum, car) => sum + Number(car.car_purchase_price), 0);
        const soldTotalExpenses = soldCars.reduce((sum, car) => sum + Number(car.car_total_expenses), 0);
        const soldTotalSelling = soldCars.reduce((sum, car) => sum + Number(car.invoice_amount), 0);
        const soldTotalProfit = soldCars.reduce((sum, car) => sum + Number(car.profit), 0);

        // Table header component for available cars
        const AvailableTableHeader = () => (
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="bg-green-50 dark:bg-green-900/20">
              <th scope="col" className="px-6 py-3">{t("dashboard.carId")}</th>
              <th scope="col" className="px-6 py-3">{t("car.name")}</th>
              <th scope="col" className="px-6 py-3">{t("car.make")}</th>
              <th scope="col" className="px-6 py-3">{t("car.model")}</th>
              <th scope="col" className="px-6 py-3">{t("car.purchasePrice")}</th>
              <th scope="col" className="px-6 py-3">{t("car.totalExpenses")}</th>
              <th scope="col" className="px-6 py-3">{t("common.createdAt")}</th>
            </tr>
          </thead>
        );

        // Table header component for sold cars
        const SoldTableHeader = () => (
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="bg-purple-50 dark:bg-purple-900/20">
              <th scope="col" className="px-6 py-3">{t("dashboard.carId")}</th>
              <th scope="col" className="px-6 py-3">{t("car.name")}</th>
              <th scope="col" className="px-6 py-3">{t("car.make")}</th>
              <th scope="col" className="px-6 py-3">{t("car.model")}</th>
              <th scope="col" className="px-6 py-3">{t("car.purchasePrice")}</th>
              <th scope="col" className="px-6 py-3">{t("car.totalExpenses")}</th>
              <th scope="col" className="px-6 py-3">{t("dashboard.invoiceAmount")}</th>
              <th scope="col" className="px-6 py-3">{t("dashboard.profit")}</th>
              <th scope="col" className="px-6 py-3">{t("dashboard.clientName")}</th>
            </tr>
          </thead>
        );

        // Car row component for available cars
        const AvailableCarRow = ({ car }: { car: CarPurchasedAndSoldReport }) => (
          <tr key={car.car_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
              #{car.car_id}
            </td>
            <td className="px-6 py-4">{car.car_name || t("common.notAvailable")}</td>
            <td className="px-6 py-4">{car.car_make || t("common.notAvailable")}</td>
            <td className="px-6 py-4">{car.car_model || t("common.notAvailable")}</td>
            <td className="px-6 py-4">{formatCurrency(car.car_purchase_price)}</td>
            <td className="px-6 py-4">{formatCurrency(car.car_total_expenses)}</td>
            <td className="px-6 py-4">{formatDate(car.car_created_at)}</td>
          </tr>
        );

        // Car row component for sold cars
        const SoldCarRow = ({ car }: { car: CarPurchasedAndSoldReport }) => (
          <tr key={car.car_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
              #{car.car_id}
            </td>
            <td className="px-6 py-4">{car.car_name || t("common.notAvailable")}</td>
            <td className="px-6 py-4">{car.car_make || t("common.notAvailable")}</td>
            <td className="px-6 py-4">{car.car_model || t("common.notAvailable")}</td>
            <td className="px-6 py-4">{formatCurrency(car.car_purchase_price)}</td>
            <td className="px-6 py-4">{formatCurrency(car.car_total_expenses)}</td>
            <td className="px-6 py-4 font-semibold text-purple-600 dark:text-purple-400">
              {formatCurrency(car.invoice_amount)}
            </td>
            <td className={`px-6 py-4 font-semibold ${car.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(car.profit)}
            </td>
            <td className="px-6 py-4">{car.client_name || t("common.notAvailable")}</td>
          </tr>
        );

        return (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <HiDocumentReport className="text-2xl text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("dashboard.carsPurchasedWithinPeriod") || "Cars Purchased Within Period"}
              </h2>
              <Badge color="purple" className="ml-auto">
                {formatDate(invoicesReport.starting_date)} - {formatDate(invoicesReport.ending_date)}
              </Badge>
            </div>

            <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{t("dashboard.totalCars")}:</span>{" "}
                {invoicesReport.total_cars}
              </p>
            </div>

            {invoicesReport.cars.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  {t("dashboard.noReportData")}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Available Cars Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-300 dark:border-green-700">
                    <Badge color="success" size="lg">
                      {t("dashboard.availableCars")}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({availableCars.length} {t("dashboard.totalCars").toLowerCase()})
                    </span>
                  </div>
                  
                  {availableCars.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {t("dashboard.noReportData")}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <AvailableTableHeader />
                        <tbody>
                          {availableCars.map((car) => (
                            <AvailableCarRow key={car.car_id} car={car} />
                          ))}
                          {/* Subtotal row for available cars */}
                          <tr className="bg-green-50 dark:bg-green-900/30 font-bold border-t-2 border-green-200 dark:border-green-700">
                            <td colSpan={4} className="px-6 py-4 text-right text-gray-900 dark:text-white">
                              {t("dashboard.subtotal")}:
                            </td>
                            <td className="px-6 py-4 text-green-600 dark:text-green-400">
                              {formatCurrency(availableTotalPurchase)}
                            </td>
                            <td className="px-6 py-4 text-green-600 dark:text-green-400">
                              {formatCurrency(availableTotalExpenses)}
                            </td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {/* Summary for available cars */}
                  {availableCars.length > 0 && (
                    <div className="mt-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.totalPurchasePrice")}</p>
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">{formatCurrency(availableTotalPurchase)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.totalExpensesSum")}</p>
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">{formatCurrency(availableTotalExpenses)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sold Cars Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-gray-300 dark:border-gray-600">
                    <Badge color="gray" size="lg">
                      {t("dashboard.unavailableCars")}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({soldCars.length} {t("dashboard.totalCars").toLowerCase()})
                    </span>
                  </div>
                  
                  {soldCars.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {t("dashboard.noReportData")}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <SoldTableHeader />
                        <tbody>
                          {soldCars.map((car) => (
                            <SoldCarRow key={car.car_id} car={car} />
                          ))}
                          {/* Subtotal row for sold cars */}
                          <tr className="bg-gray-100 dark:bg-gray-700 font-bold border-t-2 border-gray-300 dark:border-gray-600">
                            <td colSpan={4} className="px-6 py-4 text-right text-gray-900 dark:text-white">
                              {t("dashboard.subtotal")}:
                            </td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                              {formatCurrency(soldTotalPurchase)}
                            </td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                              {formatCurrency(soldTotalExpenses)}
                            </td>
                            <td className="px-6 py-4 text-purple-600 dark:text-purple-400">
                              {formatCurrency(soldTotalSelling)}
                            </td>
                            <td className={`px-6 py-4 font-semibold ${soldTotalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {formatCurrency(soldTotalProfit)}
                            </td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {/* Summary for sold cars */}
                  {soldCars.length > 0 && (
                    <div className="mt-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.totalPurchasePrice")}</p>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(soldTotalPurchase)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.totalExpensesSum")}</p>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(soldTotalExpenses)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.totalSellingPrice")}</p>
                        <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">{formatCurrency(soldTotalSelling)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.totalProfit")}</p>
                        <p className={`text-lg font-semibold ${soldTotalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {formatCurrency(soldTotalProfit)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        );
      })()}

      {/* Report 4: Dealership Expenses Between Dates */}
      {expensesReport && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <HiDocumentReport className="text-2xl text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("dashboard.dealershipExpenses") || "Dealership Expenses"}
            </h2>
            <Badge color="red" className="ml-auto">
              {formatDate(expensesReport.starting_date)} - {formatDate(expensesReport.ending_date)}
            </Badge>
          </div>

          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.totalExpensesCount") || "Total Expenses Count"}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{expensesReport.total_expenses}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.totalAmount")}</p>
              <p className="text-lg font-semibold text-red-600 dark:text-red-400">{formatCurrency(expensesReport.total_amount)}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr className="bg-red-50 dark:bg-red-900/20">
                  <th scope="col" className="px-6 py-3">{t("common.id")}</th>
                  <th scope="col" className="px-6 py-3">{t("common.description")}</th>
                  <th scope="col" className="px-6 py-3">{t("common.date")}</th>
                  <th scope="col" className="px-6 py-3">{t("common.amount")}</th>
                </tr>
              </thead>
              <tbody>
                {expensesReport.expenses.length === 0 ? (
                  <tr className="bg-white dark:bg-gray-800">
                    <td colSpan={4} className="px-6 py-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        {t("dashboard.noReportData")}
                      </p>
                    </td>
                  </tr>
                ) : (
                  expensesReport.expenses.map((expense) => (
                    <tr key={expense.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        #{expense.id}
                      </td>
                      <td className="px-6 py-4">{expense.description}</td>
                      <td className="px-6 py-4">{formatDate(expense.expense_date)}</td>
                      <td className="px-6 py-4 font-semibold text-red-600 dark:text-red-400">
                        {formatCurrency(expense.amount)}
                      </td>
                    </tr>
                  ))
                )}
                {expensesReport.expenses.length > 0 && (
                  <tr className="bg-red-50 dark:bg-red-900/30 font-bold border-t-2 border-red-200 dark:border-red-700">
                    <td colSpan={3} className="px-6 py-4 text-right text-gray-900 dark:text-white">
                      {t("dashboard.total")}:
                    </td>
                    <td className="px-6 py-4 text-red-600 dark:text-red-400">
                      {formatCurrency(expensesReport.total_amount)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
