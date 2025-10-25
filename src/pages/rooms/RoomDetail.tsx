// src/pages/RoomDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/DashboardLayout';
import { roomService } from '../../services/roomservice';
import type { Room } from '../../types/room';
import { ArrowLeft, Edit, Trash2, Home, DollarSign, Ruler, Layers } from 'lucide-react';

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
      available: 'bg-green-100 text-green-800 border-green-200',
      occupied: 'bg-red-100 text-red-800 border-red-200',
      maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      reserved: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading room details...</p>
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/rooms')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rooms
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Room {room.room_number}</h1>
              <p className="mt-1 text-gray-600">Detailed room information and management</p>
            </div>
            <div className="flex gap-3">
              <Link
                to={`/rooms/${room.id}/edit`}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Room
              </Link>
              <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Image */}
            {room.image && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <img
                  src={room.image}
                  alt={`Room ${room.room_number}`}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Description */}
            {room.description && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{room.description}</p>
              </div>
            )}

            {/* Amenities */}
            {room.amenities && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.split(',').map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium border border-indigo-100"
                    >
                      {amenity.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Price Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${getStatusBadgeClass(room.status)}`}>
                  {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </span>
                {room.is_active ? (
                  <span className="text-green-600 text-sm font-medium">● Active</span>
                ) : (
                  <span className="text-red-600 text-sm font-medium">● Inactive</span>
                )}
              </div>
              <div className="border-t pt-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600">
                    ${room.base_rent_amount}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">per month</div>
                </div>
              </div>
            </div>

            {/* Room Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Details</h3>
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center text-gray-600">
                    <Layers className="h-4 w-4 mr-2" />
                    Floor
                  </dt>
                  <dd className="font-semibold text-gray-900">{room.floor}</dd>
                </div>
                {room.room_type && (
                  <div className="flex items-center justify-between">
                    <dt className="flex items-center text-gray-600">
                      <Home className="h-4 w-4 mr-2" />
                      Type
                    </dt>
                    <dd className="font-semibold text-gray-900">{room.room_type}</dd>
                  </div>
                )}
                {room.size && (
                  <div className="flex items-center justify-between">
                    <dt className="flex items-center text-gray-600">
                      <Ruler className="h-4 w-4 mr-2" />
                      Size
                    </dt>
                    <dd className="font-semibold text-gray-900">{room.size} sq m</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Monthly Rent
                  </dt>
                  <dd className="font-semibold text-gray-900">${room.base_rent_amount}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Security Deposit
                  </dt>
                  <dd className="font-semibold text-gray-900">${room.base_security_deposit_amount}</dd>
                </div>
              </dl>
            </div>

            {/* Metadata */}
            <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600 space-y-1">
              <p>Created: {new Date(room.created_at).toLocaleString()}</p>
              <p>Updated: {new Date(room.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RoomDetail;