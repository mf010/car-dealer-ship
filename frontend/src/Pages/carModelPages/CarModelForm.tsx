import { useState, useEffect } from "react";
import { Button, Label, TextInput, Modal } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { useTranslation } from 'react-i18next';
import ReactSelect from "react-select";
import { carModelServices } from "../../services/carModelServices";
import { makeServices } from "../../services/makeServices";
import type { CreateCarModelDTO } from "../../models/CarModel";
import type { Make } from "../../models/Make";

interface SelectOption {
  value: number;
  label: string;
}

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
  const [makeOptions, setMakeOptions] = useState<SelectOption[]>([]);
  const [selectedMake, setSelectedMake] = useState<SelectOption | null>(null);
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
      // Fetch all makes by iterating through pages
      const allMakes: Make[] = [];
      let currentPage = 1;
      let hasMore = true;
      
      while (hasMore) {
        const response = await makeServices.getAllMakes(currentPage);
        allMakes.push(...response.data);
        
        if (currentPage >= response.last_page) {
          hasMore = false;
        }
        currentPage++;
      }
      
      // Convert to react-select format
      const options = allMakes.map((make) => ({
        value: make.id,
        label: make.name,
      }));
      setMakeOptions(options);
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
      setSelectedMake(null);
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
    setSelectedMake(null);
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
            <div className="mb-2 block">
              <Label htmlFor="make_id">{t('make.makeName')} <span className="text-red-500 ml-1">*</span></Label>
            </div>
            <ReactSelect
              id="make_id"
              name="make_id"
              options={makeOptions}
              value={selectedMake}
              onChange={(option) => {
                setSelectedMake(option);
                setFormData(prev => ({
                  ...prev,
                  make_id: option?.value || 0
                }));
                if (errors.make_id) {
                  setErrors(prev => ({ ...prev, make_id: undefined }));
                }
              }}
              isLoading={loadingMakes}
              isDisabled={isSubmitting || loadingMakes}
              isClearable
              placeholder={loadingMakes ? t('common.loading') : t('carModel.selectMake')}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: errors.make_id ? '#f05252' : state.isFocused ? '#3b82f6' : '#d1d5db',
                  '&:hover': {
                    borderColor: errors.make_id ? '#f05252' : '#3b82f6'
                  },
                  boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 9999
                })
              }}
            />
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
