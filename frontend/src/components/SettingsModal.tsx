import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Button, Label, TextInput } from "flowbite-react";
import { HiCog, HiLockClosed, HiLogout, HiRefresh } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { authServices } from "../services/authServices";
import api from "../helper/api";
import type { ChangePasswordRequest } from "../models/User";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const currentUser = authServices.getUser();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setSuccessMessage("");
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.current_password) {
      newErrors.current_password = t('validation.currentPasswordRequired');
    }

    if (!passwordData.new_password) {
      newErrors.new_password = t('validation.newPasswordRequired');
    } else if (passwordData.new_password.length < 6) {
      newErrors.new_password = t('validation.passwordMinLength');
    }

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      newErrors.new_password_confirmation = t('validation.passwordsDoNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    try {
      const response = await authServices.changePassword(passwordData);
      
      // Clear form
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      setErrors({});
      setSuccessMessage(response.message || t('messages.passwordChangeSuccess'));
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error: any) {
      console.error("Error changing password:", error);
      
      if (error.response?.status === 400) {
        setErrors({ current_password: error.response?.data?.error || t('validation.currentPasswordIncorrect') });
      } else {
        setErrors({ submit: t('messages.passwordChangeFailed') });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSystem = async () => {
    if (!window.confirm(t('settings.updateSystemConfirm', 'Are you sure you want to update the system? This might restart the application.'))) {
      return;
    }

    setLoading(true);
    try {
      await api.post('/system/update/run');
      setSuccessMessage(t('settings.updateStarted', 'Update started in background. Please wait a few minutes.'));
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error starting update:", error);
      setErrors({ submit: t('settings.updateFailed', 'Failed to start update.') });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm(t('settings.logoutConfirm'))) {
      return;
    }

    setLoading(true);
    try {
      await authServices.logout();
      onClose();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      // Still logout locally even if API call fails
      authServices.clearAuth();
      onClose();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPasswordData({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
    setErrors({});
    setSuccessMessage("");
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={handleClose} size="lg">
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <HiCog className="h-6 w-6 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('settings.title')}
          </h3>
        </div>

        <div className="space-y-6">
          {/* Account Information Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HiCog className="h-5 w-5" />
              {t('settings.accountInfo')}
            </h4>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">{t('user.name')}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currentUser?.name || t('common.notAvailable')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">{t('user.email')}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currentUser?.email || t('common.notAvailable')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">{t('user.role')}:</span>
                  <span className="font-medium text-gray-900 dark:text-white uppercase">
                    {currentUser?.role || t('common.notAvailable')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HiLockClosed className="h-5 w-5" />
              {t('settings.changePassword')}
            </h4>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <Label htmlFor="current_password" className="mb-2 block">
                  {t('settings.currentPassword')} <span className="text-red-500">*</span>
                </Label>
                <TextInput
                  id="current_password"
                  name="current_password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  color={errors.current_password ? "failure" : undefined}
                  placeholder={t('settings.enterCurrentPassword')}
                />
                {errors.current_password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.current_password}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <Label htmlFor="new_password" className="mb-2 block">
                  {t('settings.newPassword')} <span className="text-red-500">*</span>
                </Label>
                <TextInput
                  id="new_password"
                  name="new_password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  color={errors.new_password ? "failure" : undefined}
                  placeholder={t('settings.minCharacters')}
                />
                {errors.new_password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.new_password}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <Label htmlFor="new_password_confirmation" className="mb-2 block">
                  {t('settings.confirmNewPassword')} <span className="text-red-500">*</span>
                </Label>
                <TextInput
                  id="new_password_confirmation"
                  name="new_password_confirmation"
                  type="password"
                  value={passwordData.new_password_confirmation}
                  onChange={handlePasswordChange}
                  color={errors.new_password_confirmation ? "failure" : undefined}
                  placeholder={t('settings.reEnterNewPassword')}
                />
                {errors.new_password_confirmation && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.new_password_confirmation}
                  </p>
                )}
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">{successMessage}</p>
                </div>
              )}

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" disabled={loading} className="w-full">
                <HiLockClosed className="mr-2 h-5 w-5" />
                {loading ? t('settings.changingPassword') : t('settings.changePassword')}
              </Button>
            </form>
          </div>

          {/* System Update Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HiRefresh className="h-5 w-5" />
              {t('settings.systemUpdate', 'System Update')}
            </h4>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {t('settings.updateDescription', 'Check for updates and upgrade the system to the latest version.')}
              </p>
              <Button
                color="warning"
                onClick={handleUpdateSystem}
                disabled={loading}
                className="w-full"
              >
                <HiRefresh className="mr-2 h-5 w-5" />
                {loading ? t('settings.updating', 'Updating...') : t('settings.checkForUpdates', 'Check for Updates')}
              </Button>
            </div>
          </div>

          {/* Logout Section */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              color="failure"
              onClick={handleLogout}
              disabled={loading}
              className="w-full"
            >
              <HiLogout className="mr-2 h-5 w-5" />
              {loading ? t('settings.loggingOut') : t('settings.logout')}
            </Button>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
          <Button color="gray" onClick={handleClose}>
            {t('common.close')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
