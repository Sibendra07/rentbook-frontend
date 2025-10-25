// src/pages/DashboardPage.tsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { Home, Users, DollarSign, TrendingUp } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Total Revenue',
      value: '$45,231',
      change: '+12.5%',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Active Tenants',
      value: '18',
      change: '+2',
      icon: <Users className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Occupied Rooms',
      value: '18/24',
      change: '75%',
      icon: <Home className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Monthly Growth',
      value: '+23%',
      change: 'vs last month',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recentPayments = [
    { tenant: 'John Doe', room: 'Room 101', amount: '$1,200', status: 'Paid', date: '2025-10-20' },
    { tenant: 'Jane Smith', room: 'Room 204', amount: '$1,500', status: 'Paid', date: '2025-10-18' },
    { tenant: 'Mike Johnson', room: 'Room 305', amount: '$1,350', status: 'Pending', date: '2025-10-25' },
    { tenant: 'Sarah Wilson', room: 'Room 102', amount: '$1,200', status: 'Paid', date: '2025-10-15' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.first_name}!
              </h2>
              <p className="mt-1 text-gray-600">
                Here's what's happening with your properties today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                      <p className="mt-2 text-sm text-gray-500">{stat.change}</p>
                    </div>
                    <div className={`${stat.bgColor} ${stat.color} p-3 rounded-full`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
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
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === 'Paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
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