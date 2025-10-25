// src/pages/ProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
import { validateName, validatePhone, validateDate } from '../../utils/validation';
import { DashboardLayout } from '../../components/DashboardLayout';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Shield } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    dob: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        address: user.address || '',
        dob: user.dob || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const firstNameError = validateName(formData.first_name, 'First name');
    if (firstNameError) newErrors.first_name = firstNameError;

    const lastNameError = validateName(formData.last_name, 'Last name');
    if (lastNameError) newErrors.last_name = lastNameError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const dobError = validateDate(formData.dob);
    if (dobError) newErrors.dob = dobError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    if (!validate()) return;

    setLoading(true);
    try {
      await authService.editProfile(formData);
      await refreshUser();
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile. Please try again.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        address: user.address || '',
        dob: user.dob || '',
      });
    }
    setErrors({});
    setApiError('');
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setSuccessMessage('');
    setIsEditing(true);
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="mt-1 text-gray-600">View and manage your personal information</p>
          </div>
          <button
            onClick={handleEditClick}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-3 text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-100 mb-4">
                  <User className="h-12 w-12 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    <span>Account Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>

              <div className="px-6 py-6">
                <dl className="space-y-6">
                  {/* Email */}
                  <div>
                    <dt className="flex items-center text-sm font-medium text-gray-500 mb-2">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Address
                    </dt>
                    <dd className="text-base text-gray-900">{user.email}</dd>
                  </div>

                  {/* Full Name */}
                  <div>
                    <dt className="flex items-center text-sm font-medium text-gray-500 mb-2">
                      <User className="h-4 w-4 mr-2" />
                      Full Name
                    </dt>
                    <dd className="text-base text-gray-900">
                      {user.first_name} {user.last_name}
                    </dd>
                  </div>

                  {/* Phone */}
                  <div>
                    <dt className="flex items-center text-sm font-medium text-gray-500 mb-2">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone Number
                    </dt>
                    <dd className="text-base text-gray-900">
                      {user.phone || <span className="text-gray-400 italic">Not provided</span>}
                    </dd>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <dt className="flex items-center text-sm font-medium text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Date of Birth
                    </dt>
                    <dd className="text-base text-gray-900">
                      {user.dob ? (
                        new Date(user.dob).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      ) : (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </dd>
                  </div>

                  {/* Address */}
                  <div>
                    <dt className="flex items-center text-sm font-medium text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      Address
                    </dt>
                    <dd className="text-base text-gray-900">
                      {user.address || <span className="text-gray-400 italic">Not provided</span>}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <h3 className="text-xl font-semibold text-gray-900">Edit Profile</h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-6">
                {apiError && (
                  <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm font-medium text-red-800">{apiError}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                            errors.first_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          value={formData.first_name}
                          onChange={handleChange}
                        />
                        {errors.first_name && (
                          <p className="mt-1 text-xs text-red-600">{errors.first_name}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                            errors.last_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          value={formData.last_name}
                          onChange={handleChange}
                        />
                        {errors.last_name && (
                          <p className="mt-1 text-xs text-red-600">{errors.last_name}</p>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                          errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        id="dob"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                          errors.dob ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        value={formData.dob}
                        onChange={handleChange}
                      />
                      {errors.dob && (
                        <p className="mt-1 text-xs text-red-600">{errors.dob}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        name="address"
                        id="address"
                        rows={3}
                        placeholder="Enter your full address"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none ${
                          errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        value={formData.address}
                        onChange={handleChange}
                      />
                      {errors.address && (
                        <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                      )}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};