// src/pages/RoomEdit.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoomForm from '../../components/rooms/RoomForm';
import { roomService } from '../../services/roomservice';
import type{ Room, RoomFormData } from '../../types/room';

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
        // Auto-redirect handled by interceptor on 401
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, navigate]);

  const handleUpdate = async (data: RoomFormData) => {
    if (!id) return;
    await roomService.updateRoom(parseInt(id), data);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading room...</div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Room not found'}
        </div>
        <button
          onClick={() => navigate('/rooms')}
          className="text-blue-600 hover:underline"
        >
          ← Back to Rooms
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <RoomForm initialData={room} onSubmit={handleUpdate} isEdit />
    </div>
  );
};

export default RoomEdit;