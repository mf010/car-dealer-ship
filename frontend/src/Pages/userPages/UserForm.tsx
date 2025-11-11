import { useState } from "react";
import { Modal, Button, Label, TextInput } from "flowbite-react";
import { HiUserAdd } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { authServices } from "../../services/authServices";
import type { RegisterRequest } from "../../models/User";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserForm({ isOpen, onClose, onSuccess }: UserFormProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    }

    if (!formData.password) {
      newErrors.password = t('validation.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('validation.passwordMinLength');
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = t('validation.passwordsDoNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await authServices.register(formData);
      setFormData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
      setErrors({});
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error creating user:", error);
      
      // Handle validation errors from backend
      if (error.response?.status === 422) {
        const backendErrors = error.response?.data?.errors || {};
        setErrors(backendErrors);
      } else {
        setErrors({ submit: t('messages.createFailed') });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <div className="max-h-[85vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <HiUserAdd className="h-6 w-6 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('user.addUser')}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="mb-2 block">
              {t('user.name')} <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              color={errors.name ? "failure" : undefined}
              placeholder={t('user.enterName')}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="mb-2 block">
              {t('user.email')} <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              color={errors.email ? "failure" : undefined}
              placeholder={t('user.emailPlaceholder')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="mb-2 block">
              {t('auth.password')} <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              color={errors.password ? "failure" : undefined}
              placeholder={t('settings.minCharacters')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Password Confirmation */}
          <div>
            <Label htmlFor="password_confirmation" className="mb-2 block">
              {t('user.confirmPassword')} <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleChange}
              color={errors.password_confirmation ? "failure" : undefined}
              placeholder={t('user.reEnterPassword')}
            />
            {errors.password_confirmation && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password_confirmation}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? t('common.creating') : t('user.createUser')}
            </Button>
            <Button color="gray" onClick={handleClose} disabled={loading}>
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </div>
      </div>
    </Modal>
  );
}
