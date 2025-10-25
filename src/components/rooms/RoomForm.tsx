// src/components/RoomForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Room, RoomFormData } from '../../types/room';
import { STATUS_OPTIONS } from '../../types/room';

interface RoomFormProps {
  initialData?: Room;
  onSubmit: (data: RoomFormData) => Promise<void>;
  isEdit?: boolean;
}

const RoomForm: React.FC<RoomFormProps> = ({ initialData, onSubmit, isEdit = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

  const [formData, setFormData] = useState<RoomFormData>({
    room_number: initialData?.room_number || '',
    floor: initialData?.floor || 1,
    room_type: initialData?.room_type || '',
    size: initialData?.size || '',
    base_rent_amount: initialData?.base_rent_amount || '',
    base_security_deposit_amount: initialData?.base_security_deposit_amount || '',
    description: initialData?.description || '',
    amenities: initialData?.amenities || '',
    image: null,
    status: initialData?.status || 'available',
    is_active: initialData?.is_active ?? true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFormData((prev) => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      navigate('/rooms');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Room' : 'Create New Room'}</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Room Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="room_number"
            value={formData.room_number}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 101, A-5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Floor <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Room Type</label>
          <input
            type="text"
            name="room_type"
            value={formData.room_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Single, Double, Studio"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Size (sq m)</label>
          <input
            type="number"
            step="0.01"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 25.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Monthly Rent <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="base_rent_amount"
            value={formData.base_rent_amount}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Security Deposit <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="base_security_deposit_amount"
            value={formData.base_security_deposit_amount}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Active</span>
          </label>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Details about the room..."
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Amenities</label>
        <textarea
          name="amenities"
          value={formData.amenities}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="AC, WiFi, Attached Bathroom, etc."
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Room Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded"
            />
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Room' : 'Create Room'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/rooms')}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RoomForm;