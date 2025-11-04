import { useState, useEffect } from "react";
import { Button, TextInput, Pagination } from "flowbite-react";
import { HiPlus, HiPencil, HiTrash, HiSearch } from "react-icons/hi";
import { useTranslation } from 'react-i18next';
import { carModelServices } from "../../services/carModelServices";
import type { CarModel } from "../../models/CarModel";
import { CarModelForm } from "./CarModelForm";
import { CarModelUpdate } from "./CarModelUpdate";

export function CarModelList() {
  const { t } = useTranslation();
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCarModel, setSelectedCarModel] = useState<CarModel | null>(null);

  // Fetch car models from API
  const fetchCarModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = searchName ? { name: searchName } : undefined;
      const response = await carModelServices.getAllCarModels(currentPage, filters);
      setCarModels(response.data);
      setTotalPages(response.last_page);
    } catch (err) {
      console.error("Error fetching car models:", err);
      const errorMessage = err instanceof Error ? err.message : t('messages.failedLoadCarModels');
      setError(errorMessage);
      // Set empty array on error to show "No car models found" instead of blank page
      setCarModels([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch car models when page or search changes
  useEffect(() => {
    fetchCarModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchName]);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm(t('messages.confirmDeleteCarModel'))) {
      try {
        await carModelServices.deleteCarModel(id);
        fetchCarModels(); // Refresh the list
      } catch (error) {
        console.error("Error deleting car model:", error);
      }
    }
  };

  // Handle add car model
  const handleAddCarModel = () => {
    setIsAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (carModel: CarModel) => {
    setSelectedCarModel(carModel);
    setIsEditModalOpen(true);
  };

  // Handle page change
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('carModel.management')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('carModel.manageDescription')}
          </p>
        </div>
        <Button onClick={handleAddCarModel} color="blue" size="md">
          <HiPlus className="mr-2 h-5 w-5" />
          {t('carModel.addModel')}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <span className="font-medium">{t('common.error')}!</span> {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="max-w-md">
        <TextInput
          icon={HiSearch}
          placeholder={t('carModel.searchPlaceholder')}
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          sizing="md"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                {t('common.id')}
              </th>
              <th scope="col" className="px-6 py-3">
                {t('carModel.modelName')}
              </th>
              <th scope="col" className="px-6 py-3">
                {t('make.makeName')}
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">{t('common.actions')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="bg-white dark:bg-gray-800">
                <td colSpan={4} className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-500 dark:text-gray-400">
                      {t('common.loading')}...
                    </span>
                  </div>
                </td>
              </tr>
            ) : !carModels || carModels.length === 0 ? (
              <tr className="bg-white dark:bg-gray-800">
                <td colSpan={4} className="px-6 py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('carModel.noModelsFound')}
                  </p>
                </td>
              </tr>
            ) : (
              carModels.map((carModel) => (
                <tr
                  key={carModel.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {carModel.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {carModel.name}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {carModel.make?.name || `${t('make.makeName')} ID: ${carModel.make_id}`}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        color="gray"
                        onClick={() => handleEdit(carModel)}
                      >
                        <HiPencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        color="failure"
                        onClick={() => handleDelete(carModel.id)}
                      >
                        <HiTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            showIcons={true}
          />
        </div>
      )}

      {/* Add Car Model Modal */}
      <CarModelForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchCarModels}
      />

      {/* Edit Car Model Modal */}
      <CarModelUpdate
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchCarModels}
        carModel={selectedCarModel}
      />
    </div>
  );
}
