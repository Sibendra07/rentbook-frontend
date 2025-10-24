// src/types/auth.types.ts

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  dob?: string;
  profile_image?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  dob?: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  new_password: string;
  reset_token: string;
}

export interface EditProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  dob?: string;
  profile_image?: File;
}