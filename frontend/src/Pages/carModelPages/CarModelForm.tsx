import { useState, useEffect } from "react";
import { Button, Label, TextInput, Modal, Select } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { useTranslation } from 'react-i18next';
import { carModelServices } from "../../services/carModelServices";
import { makeServices } from "../../services/makeServices";
import type { CreateCarModelDTO } from "../../models/CarModel";
import type { Make } from "../../models/Make";

interface CarModelFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CarModelForm({ isOpen, onClose, onSuccess }: CarModelFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateCarModelDTO>({
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

  const fetchMakes = async () => {
    setLoadingMakes(true);
    try {
      const response = await makeServices.getAllMakes(1);
      setMakes(response.data);
    } catch (error) {
      console.error("Error fetching makes:", error);
      setErrors({ make_id: t('car.failedLoadMakes') });
    } finally {
      setLoadingMakes(false);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { name?: string; make_id?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.carModelNameRequired');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('validation.carModelNameMinLength');
    } else if (formData.name.trim().length > 50) {
      newErrors.name = t('validation.carModelNameMaxLength');
    }

    if (!formData.make_id || formData.make_id === 0) {
      newErrors.make_id = t('validation.selectMake');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      await carModelServices.createCarModel(formData);
      setSuccessMessage(t('messages.carModelAddedSuccess'));
      
      // Reset form
      setFormData({ name: "", make_id: 0 });
      setErrors({});
      
      // Wait a moment to show success message, then close and refresh
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccessMessage(null);
      }, 1500);
    } catch (error) {
      console.error("Error creating car model:", error);
      setErrors({ name: t('messages.failedCreateCarModel') });
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

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('carModel.addModel')}
        </h3>

        {successMessage && (
          <div className="mb-4 p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 flex items-center">
            <HiCheck className="h-5 w-5 mr-2" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="make_id" className="mb-2 block">
              {t('make.makeName')} <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              id="make_id"
              name="make_id"
              value={formData.make_id}
              onChange={handleChange}
              color={errors.make_id ? "failure" : undefined}
              disabled={isSubmitting || loadingMakes}
            >
              <option value={0}>
                {loadingMakes ? t('car.loadingMakes') : t('carModel.selectMake')}
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
            <Label htmlFor="name" className="mb-2 block">
              {t('carModel.modelName')} <span className="text-red-500 ml-1">*</span>
            </Label>
            <TextInput
              id="name"
              name="name"
              type="text"
              placeholder={t('carModel.enterModelName')}
              value={formData.name}
              onChange={handleChange}
              color={errors.name ? "failure" : undefined}
              disabled={isSubmitting}
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
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              color="blue"
              disabled={isSubmitting || loadingMakes}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('common.adding')}...
                </>
              ) : (
                t('carModel.addModel')
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
