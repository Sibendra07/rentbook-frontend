// src/services/auth.service.ts
// Uses shared api client

import api from './api.client';
import type {
  User,
  LoginCredentials,
  SignupData,
  TokenResponse,
  AuthResponse,
  ForgotPasswordData,
  ResetPasswordData,
  EditProfileData,
} from '../types/auth.types';

export const authService = {
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post('/auth/signup/', data);
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const response = await api.post('/auth/login/', credentials);
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    return response.data;
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await api.post('/auth/logout/', { refresh: refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/user/profile/');
    return response.data;
  },

  async editProfile(data: EditProfileData): Promise<AuthResponse> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response = await api.patch('/user/edit-profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password/', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await api.post('/auth/reset-password/', data);
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};