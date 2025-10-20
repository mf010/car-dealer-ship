import { useState } from "react";
import { Button, Label, TextInput, Modal } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { makeServices } from "../../services/makeServices";
import type { CreateMakeDTO } from "../../models/Make";

interface MakeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function MakeForm({ isOpen, onClose, onSuccess }: MakeFormProps) {
  const [formData, setFormData] = useState<CreateMakeDTO>({
    name: "",
  });
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { name?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Make name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Make name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Make name must not exceed 50 characters";
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
      await makeServices.createMake(formData);
      setSuccessMessage("Make added successfully!");
      
      // Reset form
      setFormData({ name: "" });
      setErrors({});
      
      // Wait a moment to show success message, then close and refresh
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccessMessage(null);
      }, 1500);
    } catch (error) {
      console.error("Error creating make:", error);
      setErrors({ name: "Failed to create make. Please try again." });
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

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Add New Make
        </h3>

        {successMessage && (
          <div className="mb-4 p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 flex items-center">
            <HiCheck className="h-5 w-5 mr-2" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="mb-2 block">
              Make Name <span className="text-red-500 ml-1">*</span>
            </Label>
            <TextInput
              id="name"
              name="name"
              type="text"
              placeholder="Enter make name (e.g., Toyota, BMW)"
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                "Add Make"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}