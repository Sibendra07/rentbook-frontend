// src/pages/RoomCreate.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/DashboardLayout';
import type { RoomFormData } from '../../types/room';
import { roomService } from '../../services/roomservice';
import RoomForm from '../../components/rooms/RoomForm';
import { ArrowLeft, PlusCircle } from 'lucide-react';

const RoomCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleCreate = async (data: RoomFormData) => {
    await roomService.createRoom(data);
    // Navigation is handled in RoomForm on success
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/rooms')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rooms
          </button>
          <div className="flex items-center">
            <PlusCircle className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Room</h1>
              <p className="mt-1 text-gray-600">Add a new room to your property inventory</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow">
          <RoomForm onSubmit={handleCreate} />
        </div>

        {/* Helper Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Make sure to fill in all required fields marked with an asterisk (*). 
            You can always edit room details later from the room detail page.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RoomCreate;