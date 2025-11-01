import { useState, useEffect } from "react";
import { Button, Badge, TextInput } from "flowbite-react";
import { HiPlus, HiPencil, HiTrash, HiSearch } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { userServices } from "../../services/userServices";
import { UserForm } from "./UserForm";
import { UserUpdate } from "./UserUpdate";
import { formatDate } from "../../utils/formatters";
import type { User } from "../../models/User";

export function UserList() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userServices.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('user.deleteConfirm'))) {
      return;
    }

    try {
      await userServices.deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(t('messages.deleteFailed'));
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('user.management')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('user.manageDescription')}
        </p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <TextInput
            icon={HiSearch}
            placeholder={t('user.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <HiPlus className="mr-2 h-5 w-5" />
          {t('user.addUser')}
        </Button>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">{t('common.loading')}</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">{t('common.id')}</th>
                <th scope="col" className="px-6 py-3">{t('user.name')}</th>
                <th scope="col" className="px-6 py-3">{t('user.email')}</th>
                <th scope="col" className="px-6 py-3">{t('user.role')}</th>
                <th scope="col" className="px-6 py-3">{t('user.emailVerified')}</th>
                <th scope="col" className="px-6 py-3">{t('common.createdAt')}</th>
                <th scope="col" className="px-6 py-3">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr className="bg-white dark:bg-gray-800">
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm ? t('user.noUsersFound') : t('user.noUsers')}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      #{user.id}
                    </td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <Badge color={user.role === 'admin' ? 'success' : 'info'}>
                        {user.role === 'admin' ? t('user.roles.admin') : t('user.roles.user')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {user.email_verified_at ? (
                        <Badge color="success">{t('user.verified')}</Badge>
                      ) : (
                        <Badge color="warning">{t('user.notVerified')}</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          color="blue"
                          onClick={() => handleEdit(user)}
                        >
                          <HiPencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          color="failure"
                          onClick={() => handleDelete(user.id)}
                        >
                          <HiTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <UserForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchUsers}
      />

      <UserUpdate
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedUser(null);
        }}
        onSuccess={fetchUsers}
        user={selectedUser}
      />
    </div>
  );
}
