import React from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ReceptionLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const receptionistLinks = [
    { to: '/reception-appointments', icon: assets.appointment_icon, label: 'Reception Queue' },
  ];

  return (
    <div className='flex items-start'>
      <div className='min-h-screen bg-white border-r w-64 flex-shrink-0'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold text-primary'>Reception Panel</h2>
          <p className='text-sm text-gray-500'>{user?.name}</p>
        </div>
        <ul className='text-[#515151] mt-5 px-4'>
          {receptionistLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-3 cursor-pointer rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-primary border-l-4 border-primary font-medium shadow-sm'
                    : 'hover:bg-gray-50'
                }`
              }
            >
              <img className='min-w-5 w-5' src={link.icon} alt='' />
              <p>{link.label}</p>
            </NavLink>
          ))}
        </ul>
        <div className='absolute bottom-0 w-64 p-4 border-t bg-white'>
          <button
            onClick={handleLogout}
            className='flex items-center gap-3 py-2 px-3 text-red-500 hover:bg-red-50 rounded-lg w-full'
          >
            <img className='min-w-5 w-5' src={assets.logout_icon} alt='' />
            <p>Logout</p>
          </button>
        </div>
      </div>
      <div className='flex-1 p-6'>{children}</div>
    </div>
  );
};

export default ReceptionLayout;