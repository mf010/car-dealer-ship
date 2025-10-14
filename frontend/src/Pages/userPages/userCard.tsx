import { Card } from "flowbite-react";
import { Avatar } from "flowbite-react";
import avatarImg from "../../assets/Logo.png";

export function Component() {
  return (
    <Card href="#" className="max-w-32 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm ">
      <div className="flex flex-col items-center space-y-2">
        <Avatar img={avatarImg} alt="User Avatar" rounded size="md" />
        <h5 className="text-sm text-gray-900 dark:text-white text-center">
          Mohammed Furrara
        </h5>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Administrator
        </p>
      </div>
    </Card>
  );
}