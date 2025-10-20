import { useState, useEffect } from "react";
import { Button, Pagination, Card, Badge } from "flowbite-react";
import { HiPlus, HiPencil, HiTrash, HiCube, HiTag, HiInformationCircle } from "react-icons/hi";
import { carServices } from "../../services/carServices";
import type { Car } from "../../models/Car";
import { CarForm } from "./CarForm";
import { CarUpdate } from "./CarUpdate";
import { CarInfoModal } from "./CarInfoModal";

export function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchStatus, setSearchStatus] = useState<"" | "available" | "sold">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCarInfoOpen, setIsCarInfoOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Fetch cars from API
  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = searchStatus ? { status: searchStatus } : undefined;
      const response = await carServices.getAllCars(currentPage, filters);
      setCars(response.data);
      setTotalPages(response.last_page);
    } catch (err) {
      console.error("Error fetching cars:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch cars. Please check if the API server is running.";
      setError(errorMessage);
      setCars([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cars when page or search changes
  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchStatus]);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await carServices.deleteCar(id);
        fetchCars();
      } catch (error) {
        console.error("Error deleting car:", error);
      }
    }
  };

  // Handle add car
  const handleAddCar = () => {
    setIsAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (car: Car) => {
    setSelectedCar(car);
    setIsEditModalOpen(true);
  };

  // Handle view car info
  const handleViewCar = (car: Car) => {
    setSelectedCar(car);
    setIsCarInfoOpen(true);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Cars Inventory
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage vehicle inventory and track sales
          </p>
        </div>
        <Button onClick={handleAddCar} color="blue" size="md">
          <HiPlus className="mr-2 h-5 w-5" />
          Add Car
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <span className="font-medium">Error!</span> {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex gap-4 items-center">
        <div className="flex gap-2">
          <Button
            color={searchStatus === "" ? "blue" : "gray"}
            size="sm"
            onClick={() => {
              setSearchStatus("");
              setCurrentPage(1);
            }}
          >
            All
          </Button>
          <Button
            color={searchStatus === "available" ? "blue" : "gray"}
            size="sm"
            onClick={() => {
              setSearchStatus("available");
              setCurrentPage(1);
            }}
          >
            Available
          </Button>
          <Button
            color={searchStatus === "sold" ? "blue" : "gray"}
            size="sm"
            onClick={() => {
              setSearchStatus("sold");
              setCurrentPage(1);
            }}
          >
            Sold
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500 dark:text-gray-400">
            Loading cars...
          </span>
        </div>
      ) : !cars || cars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No cars found
          </p>
        </div>
      ) : (
        <>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <Card key={car.id} className="hover:shadow-lg transition-shadow duration-200">
                <div className="space-y-4">
                  {/* Header with Model and Status Badge */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <HiCube className="h-5 w-5 text-gray-400" />
                      <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {car.carModel?.make?.name} {car.carModel?.name}
                      </h5>
                    </div>
                    <Badge color={car.status === "sold" ? "failure" : "success"} size="sm">
                      {car.status === "sold" ? "Sold" : "Available"}
                    </Badge>
                  </div>

                  {/* Car Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <HiTag className="h-4 w-4" />
                      <span>Car ID: {car.id}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <HiInformationCircle className="h-4 w-4" />
                      <span>Model ID: {car.car_model_id}</span>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Purchase Price:
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(car.purchase_price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Expenses:
                      </span>
                      <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                        {formatCurrency(car.total_expenses)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-600">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Cost:
                      </span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(car.purchase_price + car.total_expenses)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      size="sm"
                      color="info"
                      className="flex-1"
                      onClick={() => handleViewCar(car)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      color="gray"
                      onClick={() => handleEdit(car)}
                    >
                      <HiPencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      color="failure"
                      onClick={() => handleDelete(car.id)}
                    >
                      <HiTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                showIcons={true}
              />
            </div>
          )}
        </>
      )}

      {/* Add Car Modal */}
      <CarForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchCars}
      />

      {/* Edit Car Modal */}
      <CarUpdate
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchCars}
        car={selectedCar}
      />

      {/* Car Info Modal */}
      <CarInfoModal
        isOpen={isCarInfoOpen}
        onClose={() => setIsCarInfoOpen(false)}
        car={selectedCar}
        onCarUpdate={fetchCars}
      />
    </div>
  );
}
