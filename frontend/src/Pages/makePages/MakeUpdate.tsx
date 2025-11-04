import { useState, useEffect } from "react";
import { Button, Label, TextInput, Modal } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { useTranslation } from 'react-i18next';
import { makeServices } from "../../services/makeServices";
import type { Make, UpdateMakeDTO } from "../../models/Make";

interface MakeUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  make: Make | null;
}

export function MakeUpdate({ isOpen, onClose, onSuccess, make }: MakeUpdateProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<UpdateMakeDTO>({
    name: "",
  });
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Update form when make changes
  useEffect(() => {
    if (make) {
      setFormData({ name: make.name });
    }
  }, [make]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { name?: string } = {};

    if (!formData.name?.trim()) {
      newErrors.name = t('validation.makeNameRequired');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('validation.makeNameMinLength');
    } else if (formData.name.trim().length > 50) {
      newErrors.name = t('validation.makeNameMaxLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!make) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      await makeServices.updateMake(make.id, formData);
      setSuccessMessage(t('messages.makeUpdatedSuccess'));
      
      setErrors({});
      
      // Wait a moment to show success message, then close and refresh
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccessMessage(null);
      }, 1500);
    } catch (error) {
      console.error("Error updating make:", error);
      setErrors({ name: t('messages.failedUpdateMake') });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: e.target.value });
    // Clear error when user starts typing
    if (errors.name) {
      setErrors({});
    }
  };

  // Handle modal close
  const handleClose = () => {
    setFormData({ name: "" });
    setErrors({});
    setSuccessMessage(null);
    onClose();
  };

  if (!make) return null;

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('make.updateMake')}
        </h3>

        {successMessage && (
          <div className="mb-4 p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 flex items-center">
            <HiCheck className="h-5 w-5 mr-2" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="edit-name" className="mb-2 block">
              {t('make.makeName')} <span className="text-red-500 ml-1">*</span>
            </Label>
            <TextInput
              id="edit-name"
              name="name"
              type="text"
              placeholder={t('make.enterMakeName')}
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
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              color="blue"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('common.updating')}...
                </>
              ) : (
                t('make.updateMake')
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}