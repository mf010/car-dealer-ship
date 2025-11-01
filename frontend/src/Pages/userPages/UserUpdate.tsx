import { useState, useEffect } from "react";
import { Modal, Button, Label, TextInput, Select } from "flowbite-react";
import { HiPencil } from "react-icons/hi";
import { userServices } from "../../services/userServices";
import type { User, UpdateUserRequest } from "../../models/User";

interface UserUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

export function UserUpdate({ isOpen, onClose, onSuccess, user }: UserUpdateProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as "user" | "admin",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

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
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !validate()) {
      return;
    }

    setLoading(true);

    try {
      const updateData: UpdateUserRequest = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      await userServices.updateUser(user.id, updateData);
      setErrors({});
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating user:", error);
      
      // Handle validation errors from backend
      if (error.response?.status === 422) {
        const backendErrors = error.response?.data?.errors || {};
        setErrors(backendErrors);
      } else {
        setErrors({ submit: "Failed to update user. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <HiPencil className="h-6 w-6 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Update User #{user.id}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="mb-2 block">
              Name <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              color={errors.name ? "failure" : undefined}
              placeholder="Enter user name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="mb-2 block">
              Email <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              color={errors.email ? "failure" : undefined}
              placeholder="user@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role" className="mb-2 block">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role}</p>
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
              {loading ? "Updating..." : "Update User"}
            </Button>
            <Button color="gray" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
