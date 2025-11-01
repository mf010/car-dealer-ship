import { useState, useEffect } from "react";
import { Button, Label, TextInput, Modal } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import ReactSelect from "react-select";
import { carServices } from "../../services/carServices";
import { carModelServices } from "../../services/carModelServices";
import type { CreateCarDTO } from "../../models/Car";

interface SelectOption {
  value: number;
  label: string;
}

interface CarFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CarForm({ isOpen, onClose, onSuccess }: CarFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateCarDTO>({
    car_model_id: 0,
    purchase_price: 0,
    status: "available",
  });
  const [carModelOptions, setCarModelOptions] = useState<SelectOption[]>([]);
  const [selectedCarModel, setSelectedCarModel] = useState<SelectOption | null>(null);
  const [loadingCarModels, setLoadingCarModels] = useState(false);
  const [errors, setErrors] = useState<{ car_model_id?: string; purchase_price?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch car models for dropdown
  useEffect(() => {
    if (isOpen) {
      fetchCarModels();
    }
  }, [isOpen]);

  const fetchCarModels = async () => {
    setLoadingCarModels(true);
    try {
      const response = await carModelServices.getAllCarModels(1);
      
      // Convert to react-select format
      const options = response.data.map((model) => ({
        value: model.id,
        label: `${model.make?.name} - ${model.name}`,
      }));
      setCarModelOptions(options);
    } catch (error) {
      console.error("Error fetching car models:", error);
      setErrors({ car_model_id: t('car.failedLoadModels') });
    } finally {
      setLoadingCarModels(false);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { car_model_id?: string; purchase_price?: string } = {};

    if (!formData.car_model_id || formData.car_model_id === 0) {
      newErrors.car_model_id = t('validation.carModelRequired');
    }

    if (formData.purchase_price === undefined || formData.purchase_price === null) {
      newErrors.purchase_price = t('validation.purchasePriceRequired');
    } else if (formData.purchase_price < 0) {
      newErrors.purchase_price = t('validation.priceNonNegative');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      await carServices.createCar(formData);
      setSuccessMessage(t('messages.createSuccess'));
      
      // Reset form
      setFormData({ car_model_id: 0, purchase_price: 0, status: "available" });
      setErrors({});
      
      // Wait a moment to show success message, then close and refresh
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccessMessage(null);
      }, 1500);
    } catch (error) {
      console.error("Error creating car:", error);
      setErrors({ car_model_id: t('messages.createFailed') });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "car_model_id" ? parseInt(value) : 
              name === "purchase_price" ? parseFloat(value) : 
              value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle modal close
  const handleClose = () => {
    setFormData({ car_model_id: 0, purchase_price: 0, status: "available" });
    setSelectedCarModel(null);
    setErrors({});
    setSuccessMessage(null);
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('car.addCar')}
        </h3>

        {successMessage && (
          <div className="mb-4 p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 flex items-center">
            <HiCheck className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Car Model Selection */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="car_model_id">{t('car.carModel')} *</Label>
            </div>
            <ReactSelect
              id="car_model_id"
              name="car_model_id"
              options={carModelOptions}
              value={selectedCarModel}
              onChange={(option) => {
                setSelectedCarModel(option);
                setFormData(prev => ({
                  ...prev,
                  car_model_id: option?.value || 0
                }));
                if (errors.car_model_id) {
                  setErrors(prev => ({ ...prev, car_model_id: undefined }));
                }
              }}
              isLoading={loadingCarModels}
              isDisabled={loadingCarModels}
              isClearable
              placeholder={loadingCarModels ? t('common.loading') : t('car.selectCarModel')}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: errors.car_model_id ? '#f05252' : state.isFocused ? '#3b82f6' : '#d1d5db',
                  '&:hover': {
                    borderColor: errors.car_model_id ? '#f05252' : '#3b82f6'
                  },
                  boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 9999
                })
              }}
            />
            {errors.car_model_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.car_model_id}
              </p>
            )}
          </div>

          {/* Purchase Price */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="purchase_price">{t('car.purchasePrice')} *</Label>
            </div>
            <TextInput
              id="purchase_price"
              name="purchase_price"
              type="number"
              step="0.01"
              placeholder={t('car.enterPurchasePrice')}
              value={formData.purchase_price}
              onChange={handleChange}
              color={errors.purchase_price ? "failure" : "gray"}
            />
            {errors.purchase_price && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.purchase_price}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="status">{t('common.status')}</Label>
            </div>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="available">{t('car.available')}</option>
              <option value="sold">{t('car.sold')}</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              color="blue"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('common.creating')}
                </>
              ) : (
                <>
                  <HiCheck className="mr-2 h-5 w-5" />
                  {t('car.addCar')}
                </>
              )}
            </Button>
            <Button
              type="button"
              color="gray"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <HiX className="mr-2 h-5 w-5" />
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
