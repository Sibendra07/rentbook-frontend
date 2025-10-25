// src/pages/RoomEdit.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/DashboardLayout';
import RoomForm from '../../components/rooms/RoomForm';
import { roomService } from '../../services/roomservice';
import type { Room, RoomFormData } from '../../types/room';
import { ArrowLeft } from 'lucide-react';

const RoomEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await roomService.getRoom(parseInt(id));
        setRoom(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch room');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const handleUpdate = async (data: RoomFormData) => {
    if (!id) return;
    await roomService.updateRoom(parseInt(id), data);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading room data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !room) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            <p className="font-semibold">{error || 'Room not found'}</p>
          </div>
          <button
            onClick={() => navigate('/rooms')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rooms
          </button>
        </div>
      </DashboardLayout>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Room {room.room_number}</h1>
          <p className="mt-1 text-gray-600">Update room information and settings</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow">
          <RoomForm initialData={room} onSubmit={handleUpdate} isEdit />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RoomEdit;