// src/pages/RoomList.tsx
// Updated to use new service structure

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { roomService } from '../../services/roomservice';
import type { Room } from '../../types/room';

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomService.getAllRooms(showDeleted);
      setRooms(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch rooms');
      // Token refresh is handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [showDeleted]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to soft delete this room?')) return;
    
    try {
      await roomService.softDeleteRoom(id);
      fetchRooms();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete room');
    }
  };

  const handleHardDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to PERMANENTLY delete this room? This cannot be undone!')) return;
    
    try {
      await roomService.hardDeleteRoom(id);
      fetchRooms();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to hard delete room');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await roomService.restoreRoom(id);
      fetchRooms();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to restore room');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const classes = {
      available: 'bg-green-100 text-green-800',
      occupied: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      reserved: 'bg-blue-100 text-blue-800',
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading rooms...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Room Management</h1>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Show Deleted</span>
          </label>
          <Link
            to="/rooms/create"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Room
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {rooms.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded">
          <p className="text-gray-600 text-lg">No rooms found. Create your first room!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
                room.is_deleted ? 'border-red-300 opacity-60' : 'border-transparent'
              }`}
            >
              {room.image && (
                <img
                  src={room.image}
                  alt={room.room_number}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold">Room {room.room_number}</h2>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(
                      room.status
                    )}`}
                  >
                    {room.status}
                  </span>
                </div>
                
                {room.is_deleted && (
                  <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm mb-2">
                    Deleted
                  </div>
                )}

                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p>Floor: {room.floor}</p>
                  {room.room_type && <p>Type: {room.room_type}</p>}
                  {room.size && <p>Size: {room.size} sq m</p>}
                  <p className="font-semibold text-gray-800">
                    Rent: ${room.base_rent_amount}/month
                  </p>
                  <p>Deposit: ${room.base_security_deposit_amount}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {!room.is_deleted ? (
                    <>
                      <Link
                        to={`/rooms/${room.id}`}
                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm text-center hover:bg-gray-200"
                      >
                        View
                      </Link>
                      <Link
                        to={`/rooms/${room.id}/edit`}
                        className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm text-center hover:bg-blue-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleRestore(room.id)}
                        className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => handleHardDelete(room.id)}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                      >
                        Delete Forever
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomList;