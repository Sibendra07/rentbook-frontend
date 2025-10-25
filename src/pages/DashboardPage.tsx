// src/pages/DashboardPage.tsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { Home} from 'lucide-react';
import { roomService } from '../services/roomservice';
import type { Room } from '../types/room';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await roomService.getAllRooms();
      setRooms(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch room data');
    } finally {
      setLoading(false);
    }
  };

  // Compute stats dynamically
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length;
  const availableRooms = rooms.filter((r) => r.status === 'available').length;
  const maintenanceRooms = rooms.filter((r) => r.status === 'maintenance').length;

  const stats = [
    {
      name: 'Total Rooms',
      value: totalRooms.toString(),
      change: '',
      icon: <Home className="h-6 w-6" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      name: 'Occupied Rooms',
      value: occupiedRooms.toString(),
      change: `${((occupiedRooms / (totalRooms || 1)) * 100).toFixed(1)}%`,
      icon: <Home className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Available Rooms',
      value: availableRooms.toString(),
      change: `${((availableRooms / (totalRooms || 1)) * 100).toFixed(1)}%`,
      icon: <Home className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Maintenance Rooms',
      value: maintenanceRooms.toString(),
      change: '',
      icon: <Home className="h-6 w-6" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  const recentPayments = [
    { tenant: 'John Doe', room: 'Room 101', amount: '$1,200', status: 'Paid', date: '2025-10-20' },
    { tenant: 'Jane Smith', room: 'Room 204', amount: '$1,500', status: 'Paid', date: '2025-10-18' },
    { tenant: 'Mike Johnson', room: 'Room 305', amount: '$1,350', status: 'Pending', date: '2025-10-25' },
    { tenant: 'Sarah Wilson', room: 'Room 102', amount: '$1,200', status: 'Paid', date: '2025-10-15' },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 text-red-600 text-center">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name}!
          </h2>
          <p className="mt-1 text-gray-600">
            Here’s what’s happening with your properties today.
          </p>
        </div>

        {/* Rooms Overview Card */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Rooms Overview</h3>
            <p className="text-sm text-gray-500 mt-1">
              Summary of all rooms by current status.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.name} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
                  {stat.change && (
                    <p className="mt-1 text-xs text-gray-500">{stat.change}</p>
                  )}
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-full`}>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentPayments.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.tenant}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {payment.room}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
