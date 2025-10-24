// src/utils/validation.ts

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

export const validateName = (name: string, fieldName: string): string | null => {
  if (!name) {
    return `${fieldName} is required`;
  }
  if (name.length < 2) {
    return `${fieldName} must be at least 2 characters long`;
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) {
    return null; // Phone is optional
  }
  const phoneRegex = /^[\d\s()+-]+$/;
  if (!phoneRegex.test(phone)) {
    return 'Please enter a valid phone number';
  }
  if (phone.replace(/\D/g, '').length < 10) {
    return 'Phone number must be at least 10 digits';
  }
  return null;
};

export const validateDate = (date: string): string | null => {
  if (!date) {
    return null; // Date is optional
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return 'Please enter a valid date';
  }
  if (dateObj > new Date()) {
    return 'Date cannot be in the future';
  }
  return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};