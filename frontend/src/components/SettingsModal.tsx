import { useState } from "react";
import { Modal, Button, Label, TextInput } from "flowbite-react";
import { HiCog, HiLockClosed, HiLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { authServices } from "../services/authServices";
import type { ChangePasswordRequest } from "../models/User";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const navigate = useNavigate();
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
      newErrors.current_password = "Current password is required";
    }

    if (!passwordData.new_password) {
      newErrors.new_password = "New password is required";
    } else if (passwordData.new_password.length < 6) {
      newErrors.new_password = "Password must be at least 6 characters";
    }

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      newErrors.new_password_confirmation = "Passwords do not match";
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
      setSuccessMessage(response.message || "Password changed successfully!");
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error: any) {
      console.error("Error changing password:", error);
      
      if (error.response?.status === 400) {
        setErrors({ current_password: error.response?.data?.error || "Current password is incorrect" });
      } else {
        setErrors({ submit: "Failed to change password. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) {
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
            Settings
          </h3>
        </div>

        <div className="space-y-6">
          {/* Account Information Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HiCog className="h-5 w-5" />
              Account Information
            </h4>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Name:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currentUser?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Email:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currentUser?.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Role:</span>
                  <span className="font-medium text-gray-900 dark:text-white uppercase">
                    {currentUser?.role || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HiLockClosed className="h-5 w-5" />
              Change Password
            </h4>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <Label htmlFor="current_password" className="mb-2 block">
                  Current Password <span className="text-red-500">*</span>
                </Label>
                <TextInput
                  id="current_password"
                  name="current_password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  color={errors.current_password ? "failure" : undefined}
                  placeholder="Enter current password"
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
                  New Password <span className="text-red-500">*</span>
                </Label>
                <TextInput
                  id="new_password"
                  name="new_password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  color={errors.new_password ? "failure" : undefined}
                  placeholder="Min 6 characters"
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
                  Confirm New Password <span className="text-red-500">*</span>
                </Label>
                <TextInput
                  id="new_password_confirmation"
                  name="new_password_confirmation"
                  type="password"
                  value={passwordData.new_password_confirmation}
                  onChange={handlePasswordChange}
                  color={errors.new_password_confirmation ? "failure" : undefined}
                  placeholder="Re-enter new password"
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
                {loading ? "Changing Password..." : "Change Password"}
              </Button>
            </form>
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
              {loading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
          <Button color="gray" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
