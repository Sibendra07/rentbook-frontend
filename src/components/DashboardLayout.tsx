// src/components/DashboardLayout.tsx
// Optional: Use this layout component to wrap all dashboard pages

import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Usage example in any page:
// 
// import { DashboardLayout } from '../components/DashboardLayout';
// 
// export const RoomsPage: React.FC = () => {
//   return (
//     <DashboardLayout>
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Your page content */}
//       </div>
//     </DashboardLayout>
//   );
// };