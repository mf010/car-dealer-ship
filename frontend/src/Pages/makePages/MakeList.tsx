import { useState, useEffect } from "react";
import { Button, TextInput, Pagination } from "flowbite-react";
import { HiPlus, HiPencil, HiTrash, HiSearch } from "react-icons/hi";
import { makeServices } from "../../services/makeServices";
import type { Make } from "../../models/Make";
import { MakeForm } from "./MakeForm";
import { MakeUpdate } from "./MakeUpdate";

export function MakeList() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMake, setSelectedMake] = useState<Make | null>(null);

  // Fetch makes from API
  const fetchMakes = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = searchName ? { name: searchName } : undefined;
      const response = await makeServices.getAllMakes(currentPage, filters);
      setMakes(response.data);
      setTotalPages(response.last_page);
    } catch (err) {
      console.error("Error fetching makes:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch makes. Please check if the API server is running.";
      setError(errorMessage);
      // Set empty array on error to show "No makes found" instead of blank page
      setMakes([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch makes when page or search changes
  useEffect(() => {
    fetchMakes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchName]);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this make?")) {
      try {
        await makeServices.deleteMake(id);
        fetchMakes(); // Refresh the list
      } catch (error) {
        console.error("Error deleting make:", error);
      }
    }
  };

  // Handle add make (empty implementation)
  const handleAddMake = () => {
    setIsAddModalOpen(true);
  };

  // Handle edit (empty implementation)
  const handleEdit = (make: Make) => {
    setSelectedMake(make);
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
            Car Makes
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage vehicle manufacturers and brands
          </p>
        </div>
        <Button onClick={handleAddMake} color="blue" size="md">
          <HiPlus className="mr-2 h-5 w-5" />
          Add Make
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <span className="font-medium">Error!</span> {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="max-w-md">
        <TextInput
          icon={HiSearch}
          placeholder="Search by name..."
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
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="bg-white dark:bg-gray-800">
                <td colSpan={3} className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-500 dark:text-gray-400">
                      Loading...
                    </span>
                  </div>
                </td>
              </tr>
            ) : !makes || makes.length === 0 ? (
              <tr className="bg-white dark:bg-gray-800">
                <td colSpan={3} className="px-6 py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No makes found
                  </p>
                </td>
              </tr>
            ) : (
              makes.map((make) => (
                <tr
                  key={make.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {make.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {make.name}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        color="gray"
                        onClick={() => handleEdit(make)}
                      >
                        <HiPencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        color="failure"
                        onClick={() => handleDelete(make.id)}
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

      {/* Add Make Modal */}
      <MakeForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchMakes}
      />

      {/* Edit Make Modal */}
      <MakeUpdate
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchMakes}
        make={selectedMake}
      />
    </div>
  );
}
