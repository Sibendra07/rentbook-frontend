// src/components/Sidebar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Home, ShieldUser, X,Users,FileText,CreditCard,Receipt,BarChart3,Settings } from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Rooms', path: '/rooms', icon: <Home className="h-5 w-5" /> },
    { name: 'Profile', path: '/profile', icon: <ShieldUser className="h-5 w-5" /> },
    { name: 'Tenants', path: '/tenants', icon: <Users className="h-5 w-5" /> },
    { name: 'Contracts', path: '/contracts', icon: <FileText className="h-5 w-5" /> },
    { name: 'Payments', path: '/payments', icon: <CreditCard className="h-5 w-5" /> },
    { name: 'Billing', path: '/billing', icon: <Receipt className="h-5 w-5" /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  const NavButton = ({ item }: { item: NavItem }) => (
    <button
      onClick={() => {
        navigate(item.path);
        onClose();
      }}
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
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-gray-200 md:bg-white">
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavButton key={item.path} item={item} />
            ))}
          </div>
        </nav>
      </aside>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-gray-900 transition-opacity ${
            mobileOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={onClose}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-4 px-3">
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavButton key={item.path} item={item} />
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};