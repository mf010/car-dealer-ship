import { useState } from "react";
import { Button, Card, Badge, Label, TextInput, Spinner } from "flowbite-react";
import { HiCalendar, HiDocumentReport } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { carServices } from "../services/carServices";
import { formatCurrency } from "../utils/formatters";

interface CarNotSoldReport {
  id: number;
  make: string | null;
  model: string | null;
  status: string;
  purchase_price: number;
  total_expenses: number;
  created_at: string;
  sold_after_starting_date: boolean;
  sold_date: string | null;
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

export function Dashboard() {
  const { t } = useTranslation();
  
  // State for first report (Cars Not Sold Before Date)
  const [startingDate, setStartingDate] = useState("");
  const [notSoldReport, setNotSoldReport] = useState<{
    starting_date: string;
    total_cars: number;
    cars: CarNotSoldReport[];
  } | null>(null);
  const [loadingNotSold, setLoadingNotSold] = useState(false);

  // State for second report (Cars Sold Between Dates)
  const [startingDate2, setStartingDate2] = useState("");
  const [endingDate2, setEndingDate2] = useState("");
  const [soldReport, setSoldReport] = useState<{
    starting_date: string;
    ending_date: string;
    total_cars: number;
    cars: CarSoldReport[];
  } | null>(null);
  const [loadingSold, setLoadingSold] = useState(false);

  // Generate first report
  const handleGenerateNotSoldReport = async () => {
    if (!startingDate) {
      alert(t("validation.required"));
      return;
    }

    setLoadingNotSold(true);
    try {
      const data = await carServices.reportCarsNotSoldBeforeStartDate(startingDate);
      setNotSoldReport(data);
    } catch (error) {
      console.error("Error generating report:", error);
      alert(t("dashboard.failedToLoadReport"));
    } finally {
      setLoadingNotSold(false);
    }
  };

  // Generate second report
  const handleGenerateSoldReport = async () => {
    if (!startingDate2 || !endingDate2) {
      alert(t("validation.required"));
      return;
    }

    if (startingDate2 >= endingDate2) {
      alert(t("validation.invalidDate"));
      return;
    }

    setLoadingSold(true);
    try {
      const data = await carServices.reportCarsSoldBetweenDates(startingDate2, endingDate2);
      setSoldReport(data);
    } catch (error) {
      console.error("Error generating report:", error);
      alert(t("dashboard.failedToLoadReport"));
    } finally {
      setLoadingSold(false);
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

      {/* Report 1: Cars Not Sold Before Date */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <HiDocumentReport className="text-2xl text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t("dashboard.carsNotSoldBeforeDate")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="startingDate">{t("dashboard.startingDate")}</Label>
            <TextInput
              id="startingDate"
              type="date"
              value={startingDate}
              onChange={(e) => setStartingDate(e.target.value)}
              placeholder={t("dashboard.selectStartDate")}
              icon={HiCalendar}
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleGenerateNotSoldReport}
              disabled={loadingNotSold || !startingDate}
              className="w-full"
              color="blue"
            >
              {loadingNotSold ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  {t("common.loading")}
                </>
              ) : (
                t("dashboard.generateReport")
              )}
            </Button>
          </div>
        </div>

        {/* Report Results */}
        {notSoldReport && (
          <div className="mt-6">
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{t("dashboard.totalCars")}:</span>{" "}
                {notSoldReport.total_cars}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{t("dashboard.startingDate")}:</span>{" "}
                {formatDate(notSoldReport.starting_date)}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">{t("dashboard.carId")}</th>
                    <th scope="col" className="px-6 py-3">{t("car.make")}</th>
                    <th scope="col" className="px-6 py-3">{t("car.model")}</th>
                    <th scope="col" className="px-6 py-3">{t("car.status")}</th>
                    <th scope="col" className="px-6 py-3">{t("car.purchasePrice")}</th>
                    <th scope="col" className="px-6 py-3">{t("car.totalExpenses")}</th>
                    <th scope="col" className="px-6 py-3">{t("common.createdAt")}</th>
                    <th scope="col" className="px-6 py-3">{t("dashboard.soldAfterDate")}</th>
                    <th scope="col" className="px-6 py-3">{t("dashboard.soldDate")}</th>
                  </tr>
                </thead>
                <tbody>
                  {notSoldReport.cars.length === 0 ? (
                    <tr className="bg-white dark:bg-gray-800">
                      <td colSpan={9} className="px-6 py-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                          {t("dashboard.noReportData")}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    notSoldReport.cars.map((car) => (
                      <tr key={car.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          #{car.id}
                        </td>
                        <td className="px-6 py-4">{car.make || t("common.notAvailable")}</td>
                        <td className="px-6 py-4">{car.model || t("common.notAvailable")}</td>
                        <td className="px-6 py-4">
                          <Badge color={car.status === "available" ? "success" : "gray"}>
                            {t(`car.${car.status}`)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">{formatCurrency(car.purchase_price)}</td>
                        <td className="px-6 py-4">{formatCurrency(car.total_expenses)}</td>
                        <td className="px-6 py-4">{formatDate(car.created_at)}</td>
                        <td className="px-6 py-4">
                          <Badge color={car.sold_after_starting_date ? "success" : "failure"}>
                            {car.sold_after_starting_date ? t("common.yes") : t("common.no")}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {car.sold_date ? formatDate(car.sold_date) : t("dashboard.notSoldYet")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      {/* Report 2: Cars Sold Between Dates */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <HiDocumentReport className="text-2xl text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t("dashboard.carsSoldBetweenDates")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="startingDate2">{t("dashboard.startingDate")}</Label>
            <TextInput
              id="startingDate2"
              type="date"
              value={startingDate2}
              onChange={(e) => setStartingDate2(e.target.value)}
              placeholder={t("dashboard.selectStartDate")}
              icon={HiCalendar}
            />
          </div>
          <div>
            <Label htmlFor="endingDate2">{t("dashboard.endingDate")}</Label>
            <TextInput
              id="endingDate2"
              type="date"
              value={endingDate2}
              onChange={(e) => setEndingDate2(e.target.value)}
              placeholder={t("dashboard.selectEndDate")}
              icon={HiCalendar}
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleGenerateSoldReport}
              disabled={loadingSold || !startingDate2 || !endingDate2}
              className="w-full"
              color="green"
            >
              {loadingSold ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  {t("common.loading")}
                </>
              ) : (
                t("dashboard.generateReport")
              )}
            </Button>
          </div>
        </div>

        {/* Report Results */}
        {soldReport && (
          <div className="mt-6">
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{t("dashboard.totalCars")}:</span>{" "}
                {soldReport.total_cars}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{t("dashboard.startingDate")}:</span>{" "}
                {formatDate(soldReport.starting_date)}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{t("dashboard.endingDate")}:</span>{" "}
                {formatDate(soldReport.ending_date)}
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
                    <tr className="bg-gray-50 dark:bg-gray-700 font-bold">
                      <td colSpan={7} className="px-6 py-4 text-right text-gray-900 dark:text-white">
                        {t("dashboard.totalInvoiceAmount")}:
                      </td>
                      <td className="px-6 py-4 text-green-600 dark:text-green-400">
                        {formatCurrency(soldReport.cars.reduce((sum, car) => sum + Number(car.invoice_amount), 0))}
                      </td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
