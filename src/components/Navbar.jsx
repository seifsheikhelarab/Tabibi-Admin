import React from 'react'
import { assets } from '../assets/assets'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const getRoleLabel = () => {
    switch (role) {
      case 'OWNER': return 'Owner';
      case 'ADMIN': return 'Admin';
      case 'RECEPTIONIST': return 'Receptionist';
      case 'DOCTOR': return 'Doctor';
      case 'MEMBER': return 'Doctor';
      default: return 'Staff';
    }
  };

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img onClick={() => navigate('/')} className='w-28 sm:w-32 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>
          {getRoleLabel()}
        </p>
      </div>
      <div className='flex items-center gap-4'>
        <span className='text-sm text-gray-600 hidden sm:block'>{user?.name || user?.email}</span>
        <button onClick={handleLogout} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
      </div>
    </div>
  )
}

export default Navbar
