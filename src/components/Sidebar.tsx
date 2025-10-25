// src/components/Sidebar.tsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  FileText, 
  CreditCard, 
  Receipt,
  Settings,
  BarChart3
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Rooms', path: '/rooms', icon: <Home className="h-5 w-5" /> },
    { name: 'Tenants', path: '/tenants', icon: <Users className="h-5 w-5" /> },
    { name: 'Contracts', path: '/contracts', icon: <FileText className="h-5 w-5" /> },
    { name: 'Payments', path: '/payments', icon: <CreditCard className="h-5 w-5" /> },
    { name: 'Billing', path: '/billing', icon: <Receipt className="h-5 w-5" /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive(item.path)
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <span className={isActive(item.path) ? 'text-indigo-600' : 'text-gray-400'}>
                {item.icon}
              </span>
              <span className="ml-3">{item.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Quick Stats */}
      <div className="mt-8 px-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Quick Stats
        </h3>
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Rooms</span>
            <span className="text-sm font-semibold text-gray-900">24</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Occupied</span>
            <span className="text-sm font-semibold text-green-600">18</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Vacant</span>
            <span className="text-sm font-semibold text-orange-600">6</span>
          </div>
        </div>
      </div>
    </aside>
  );
};