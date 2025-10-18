import { Avatar } from "flowbite-react";
import avatarImg from "../../assets/Logo.png";

export function Component() {
  return (
    <div className="w-full py-4 px-3">
      <div className="flex flex-col items-center space-y-3">
        {/* Avatar with white background */}
        <div className="relative">
          <div className="bg-white rounded-full p-1 shadow-md">
            <Avatar img={avatarImg} alt="User Avatar" rounded size="lg" />
          </div>
          {/* Online status indicator */}
          <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
        </div>
        
        {/* User Info */}
        <div className="text-center space-y-1">
          <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
            Mohammed Furrara
          </h5>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Administrator
          </p>
        </div>
      </div>
    </div>
  );
}