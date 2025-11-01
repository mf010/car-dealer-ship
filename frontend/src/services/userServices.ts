import api from "../helper/api";
import type { User, UpdateUserRequest } from "../models/User";

export const userServices = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('api/users');
    return response.data;
  },

  // Update user
  updateUser: async (id: number, data: UpdateUserRequest): Promise<{ message: string; user: User }> => {
    const response = await api.put<{ message: string; user: User }>(`api/users/${id}`, data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`api/users/${id}`);
    return response.data;
  }
};
