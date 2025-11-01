import { useState } from "react";
import { Button, Label, TextInput, Modal } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { accountServices } from "../../services/accountServices";
import type { CreateAccountDTO } from "../../models/Account";

interface AccountFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AccountForm({ isOpen, onClose, onSuccess }: AccountFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateAccountDTO>({
    name: "",
    phone: "",
    balance: 0,
  });
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    balance?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t('validation.nameRequired');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('validation.nameMinLength');
    } else if (formData.name.trim().length > 100) {
      newErrors.name = t('validation.nameMaxLength');
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = t('validation.invalidPhone');
      } else if (formData.phone.length < 7 || formData.phone.length > 20) {
        newErrors.phone = t('validation.phoneLength');
      }
    }

    // Balance validation
    if (formData.balance !== undefined && formData.balance !== null) {
      if (isNaN(formData.balance)) {
        newErrors.balance = t('validation.invalidNumber');
      }
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
      // Clean up optional fields
      const submitData: CreateAccountDTO = {
        name: formData.name.trim(),
        phone: formData.phone?.trim() || undefined,
        balance: formData.balance || 0,
      };

      await accountServices.createAccount(submitData);
      setSuccessMessage(t('messages.createSuccess'));
      
      // Reset form
      setFormData({
        name: "",
        phone: "",
        balance: 0,
      });
      setErrors({});
      
      // Wait a moment to show success message, then close and refresh
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccessMessage(null);
      }, 1500);
    } catch (error) {
      console.error("Error creating account:", error);
      setErrors({ name: t('messages.createFailed') });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "balance" ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle modal close
  const handleClose = () => {
    setFormData({
      name: "",
      phone: "",
      balance: 0,
    });
    setErrors({});
    setSuccessMessage(null);
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('account.addAccount')}
        </h3>

        {successMessage && (
          <div className="mb-4 p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 flex items-center">
            <HiCheck className="h-5 w-5 mr-2" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="mb-2 block">
              {t('account.name')} <span className="text-red-500 ml-1">*</span>
            </Label>
            <TextInput
              id="name"
              name="name"
              type="text"
              placeholder={t('account.enterName')}
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

          {/* Phone Field */}
          <div>
            <Label htmlFor="phone" className="mb-2 block">
              {t('account.phone')}
            </Label>
            <TextInput
              id="phone"
              name="phone"
              type="tel"
              placeholder={t('account.enterPhone')}
              value={formData.phone}
              onChange={handleChange}
              color={errors.phone ? "failure" : undefined}
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Balance Field */}
          <div>
            <Label htmlFor="balance" className="mb-2 block">
              {t('account.initialBalance')}
            </Label>
            <TextInput
              id="balance"
              name="balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.balance}
              onChange={handleChange}
              color={errors.balance ? "failure" : undefined}
              disabled={isSubmitting}
            />
            {errors.balance && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.balance}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('account.balanceHint')}
            </p>
          </div>

          {/* Action Buttons */}
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
                  {t('common.creating')}
                </>
              ) : (
                t('account.addAccount')
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
