// src/pages/RoomDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { roomService } from '../../services/roomservice';
import type { Room } from '../../types/room';

const RoomDetail: React.FC = () => {
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
        <Link to="/rooms" className="text-blue-600 hover:underline">
          ← Back to Rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/rooms" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Rooms
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {room.image && (
            <img
              src={room.image}
              alt={`Room ${room.room_number}`}
              className="w-full h-96 object-cover"
            />
          )}

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Room {room.room_number}</h1>
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${getStatusBadgeClass(
                    room.status
                  )}`}
                >
                  {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  ${room.base_rent_amount}
                </div>
                <div className="text-sm text-gray-600">per month</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Room Details</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Floor:</dt>
                    <dd className="font-semibold">{room.floor}</dd>
                  </div>
                  {room.room_type && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Type:</dt>
                      <dd className="font-semibold">{room.room_type}</dd>
                    </div>
                  )}
                  {room.size && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Size:</dt>
                      <dd className="font-semibold">{room.size} sq m</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Active:</dt>
                    <dd className="font-semibold">
                      {room.is_active ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Payment Details</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Monthly Rent:</dt>
                    <dd className="font-semibold">${room.base_rent_amount}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Security Deposit:</dt>
                    <dd className="font-semibold">${room.base_security_deposit_amount}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {room.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{room.description}</p>
              </div>
            )}

            {room.amenities && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.split(',').map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {amenity.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-4 text-sm text-gray-500">
              <p>Created: {new Date(room.created_at).toLocaleString()}</p>
              <p>Last Updated: {new Date(room.updated_at).toLocaleString()}</p>
            </div>

            <div className="flex gap-4 mt-6">
              <Link
                to={`/rooms/${room.id}/edit`}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700"
              >
                Edit Room
              </Link>
              <button
                onClick={() => navigate('/rooms')}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;