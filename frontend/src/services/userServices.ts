import api from "../helper/api";
import type { User, UpdateUserRequest } from "../models/User";

export const userServices = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('users');
    return response.data;
  },

  // Update user
  updateUser: async (id: number, data: UpdateUserRequest): Promise<{ message: string; user: User }> => {
    const response = await api.put<{ message: string; user: User }>(`users/${id}`, data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`users/${id}`);
    return response.data;
  }
};
