import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { SocketProvider } from '../context/SocketContext';

const DoctorLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <SocketProvider doctorId={user?.id}>
            {children}
          </SocketProvider>
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;