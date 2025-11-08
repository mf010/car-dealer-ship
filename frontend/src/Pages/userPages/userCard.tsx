import { useState, useEffect } from "react";
import { Avatar } from "flowbite-react";
import { useTranslation } from "react-i18next";
import avatarImg from "../../assets/Logo.png";
import { authServices } from "../../services/authServices";
import type { User } from "../../models/User";

export function Component() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user from localStorage first (faster)
    const storedUser = authServices.getUser();
    if (storedUser) {
      setUser(storedUser);
    }

    // Optionally fetch fresh user data from API
    const fetchUser = async () => {
      try {
        const currentUser = await authServices.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Keep using stored user if API call fails
      }
    };

    fetchUser();
  }, []);

  // Default values if user is not loaded yet
  const userName = user?.name || "User";
  const userRole = user?.role === "admin" 
    ? t("user.roles.admin") 
    : t("user.roles.user");

  return (
    <div className="w-full py-4 px-3">
      <div className="flex flex-col items-center space-y-3">
        {/* Avatar with white background */}
        <div className="relative">
          <div className="bg-white rounded-full p-1 shadow-md">
            <Avatar img={avatarImg} alt={userName} rounded size="lg" />
          </div>
          {/* Online status indicator */}
          <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
        </div>
        
        {/* User Info */}
        <div className="text-center space-y-1">
          <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
            {userName}
          </h5>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {userRole}
          </p>
        </div>
      </div>
    </div>
  );
}