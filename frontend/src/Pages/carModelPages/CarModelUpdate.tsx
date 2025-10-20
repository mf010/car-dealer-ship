import { useState, useEffect } from "react";
import { Button, Label, TextInput, Modal, Select } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { carModelServices } from "../../services/carModelServices";
import { makeServices } from "../../services/makeServices";
import type { CarModel, UpdateCarModelDTO } from "../../models/CarModel";
import type { Make } from "../../models/Make";

interface CarModelUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  carModel: CarModel | null;
}

export function CarModelUpdate({ isOpen, onClose, onSuccess, carModel }: CarModelUpdateProps) {
  const [formData, setFormData] = useState<UpdateCarModelDTO>({
    name: "",
    make_id: 0,
  });
  const [makes, setMakes] = useState<Make[]>([]);
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; make_id?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch makes for dropdown
  useEffect(() => {
    if (isOpen) {
      fetchMakes();
    }
  }, [isOpen]);

  // Update form when carModel changes
  useEffect(() => {
    if (carModel) {
      setFormData({
        name: carModel.name,
        make_id: carModel.make_id,
      });
    }
  }, [carModel]);

  const fetchMakes = async () => {
    setLoadingMakes(true);
    try {
      const response = await makeServices.getAllMakes(1);
      setMakes(response.data);
    } catch (error) {
      console.error("Error fetching makes:", error);
      setErrors({ make_id: "Failed to load makes" });
    } finally {
      setLoadingMakes(false);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { name?: string; make_id?: string } = {};

    if (formData.name !== undefined) {
      if (!formData.name.trim()) {
        newErrors.name = "Model name is required";
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Model name must be at least 2 characters";
      } else if (formData.name.trim().length > 50) {
        newErrors.name = "Model name must not exceed 50 characters";
      }
    }

    if (formData.make_id !== undefined && (!formData.make_id || formData.make_id === 0)) {
      newErrors.make_id = "Please select a make";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!carModel) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      await carModelServices.updateCarModel(carModel.id, formData);
      setSuccessMessage("Car model updated successfully!");
      
      setErrors({});
      
      // Wait a moment to show success message, then close and refresh
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccessMessage(null);
      }, 1500);
    } catch (error) {
      console.error("Error updating car model:", error);
      setErrors({ name: "Failed to update car model. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "make_id" ? parseInt(value) : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle modal close
  const handleClose = () => {
    setFormData({ name: "", make_id: 0 });
    setErrors({});
    setSuccessMessage(null);
    onClose();
  };

  if (!carModel) return null;

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Edit Car Model
        </h3>

        {successMessage && (
          <div className="mb-4 p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 flex items-center">
            <HiCheck className="h-5 w-5 mr-2" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="edit-make_id" className="mb-2 block">
              Make <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              id="edit-make_id"
              name="make_id"
              value={formData.make_id}
              onChange={handleChange}
              color={errors.make_id ? "failure" : undefined}
              disabled={isSubmitting || loadingMakes}
            >
              <option value={0}>
                {loadingMakes ? "Loading makes..." : "Select a make"}
              </option>
              {makes.map((make) => (
                <option key={make.id} value={make.id}>
                  {make.name}
                </option>
              ))}
            </Select>
            {errors.make_id && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.make_id}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="edit-name" className="mb-2 block">
              Model Name <span className="text-red-500 ml-1">*</span>
            </Label>
            <TextInput
              id="edit-name"
              name="name"
              type="text"
              placeholder="Enter model name (e.g., Camry, 3 Series)"
              value={formData.name}
              onChange={handleChange}
              color={errors.name ? "failure" : undefined}
              disabled={isSubmitting}
              autoFocus
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.name}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <Button color="gray" onClick={handleClose} disabled={isSubmitting}>
              <HiX className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              color="blue"
              disabled={isSubmitting || loadingMakes}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                "Update Car Model"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
