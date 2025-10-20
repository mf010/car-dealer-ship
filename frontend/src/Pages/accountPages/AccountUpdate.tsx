import { useState, useEffect } from "react";
import { Button, Label, TextInput, Modal } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { accountServices } from "../../services/accountServices";
import type { Account, UpdateAccountDTO } from "../../models/Account";

interface AccountUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  account: Account | null;
}

export function AccountUpdate({ isOpen, onClose, onSuccess, account }: AccountUpdateProps) {
  const [formData, setFormData] = useState<UpdateAccountDTO>({
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

  // Update form when account changes
  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        phone: account.phone || "",
        balance: account.balance,
      });
    }
  }, [account]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Name validation
    if (formData.name !== undefined) {
      if (!formData.name.trim()) {
        newErrors.name = "Account name is required";
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Account name must be at least 2 characters";
      } else if (formData.name.trim().length > 100) {
        newErrors.name = "Account name must not exceed 100 characters";
      }
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      } else if (formData.phone.length < 7 || formData.phone.length > 20) {
        newErrors.phone = "Phone number must be between 7 and 20 characters";
      }
    }

    // Balance validation
    if (formData.balance !== undefined && formData.balance !== null) {
      if (isNaN(formData.balance)) {
        newErrors.balance = "Balance must be a valid number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      // Clean up optional fields
      const submitData: UpdateAccountDTO = {
        name: formData.name?.trim(),
        phone: formData.phone?.trim() || undefined,
        balance: formData.balance,
      };

      await accountServices.updateAccount(account.id, submitData);
      setSuccessMessage("Account updated successfully!");
      
      setErrors({});
      
      // Wait a moment to show success message, then close and refresh
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccessMessage(null);
      }, 1500);
    } catch (error) {
      console.error("Error updating account:", error);
      setErrors({ name: "Failed to update account. Please try again." });
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

  if (!account) return null;

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Edit Account
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
            <Label htmlFor="edit-name" className="mb-2 block">
              Account Name <span className="text-red-500 ml-1">*</span>
            </Label>
            <TextInput
              id="edit-name"
              name="name"
              type="text"
              placeholder="Enter account holder name"
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
            <Label htmlFor="edit-phone" className="mb-2 block">
              Phone Number
            </Label>
            <TextInput
              id="edit-phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
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
            <Label htmlFor="edit-balance" className="mb-2 block">
              Balance
            </Label>
            <TextInput
              id="edit-balance"
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
              Current balance can be adjusted here
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <Button color="gray" onClick={handleClose} disabled={isSubmitting}>
              <HiX className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              color="blue"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                "Update Account"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
