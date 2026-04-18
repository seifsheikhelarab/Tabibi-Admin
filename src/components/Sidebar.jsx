import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const { role, isDoctor, isAdmin } = useAuth()
  const isReceptionist = role === 'RECEPTIONIST'

  const adminLinks = (
    <>
      <NavLink to={'/admin-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-6 md:min-w-64 cursor-pointer rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-50 text-primary border-l-4 border-primary font-medium shadow-sm' : 'hover:bg-gray-50'}`}>
        <img className='min-w-5 w-5' src={assets.home_icon} alt='' />
        <p className='hidden md:block'>Dashboard</p>
      </NavLink>
      <NavLink to={'/all-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-6 md:min-w-64 cursor-pointer rounded-lg transition-all duration-200 mt-2 ${isActive ? 'bg-indigo-50 text-primary border-l-4 border-primary font-medium shadow-sm' : 'hover:bg-gray-50'}`}>
        <img className='min-w-5 w-5' src={assets.appointment_icon} alt='' />
        <p className='hidden md:block'>Appointments</p>
      </NavLink>
      <NavLink to={'/add-doctor'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-6 md:min-w-64 cursor-pointer rounded-lg transition-all duration-200 mt-2 ${isActive ? 'bg-indigo-50 text-primary border-l-4 border-primary font-medium shadow-sm' : 'hover:bg-gray-50'}`}>
        <img className='min-w-5 w-5' src={assets.add_icon} alt='' />
        <p className='hidden md:block'>Add Doctor</p>
      </NavLink>
      <NavLink to={'/doctor-list'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-6 md:min-w-64 cursor-pointer rounded-lg transition-all duration-200 mt-2 ${isActive ? 'bg-indigo-50 text-primary border-l-4 border-primary font-medium shadow-sm' : 'hover:bg-gray-50'}`}>
        <img className='min-w-5 w-5' src={assets.people_icon} alt='' />
        <p className='hidden md:block'>Doctors List</p>
      </NavLink>
      <NavLink to={'/crm-board'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-6 md:min-w-64 cursor-pointer rounded-lg transition-all duration-200 mt-2 ${isActive ? 'bg-indigo-50 text-primary border-l-4 border-primary font-medium shadow-sm' : 'hover:bg-gray-50'}`}>
        <img className='min-w-5 w-5' src={assets.list_icon} alt='' />
        <p className='hidden md:block'>CRM Board</p>
      </NavLink>
      <NavLink to={'/referrals-board'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-6 md:min-w-64 cursor-pointer rounded-lg transition-all duration-200 mt-2 ${isActive ? 'bg-indigo-50 text-primary border-l-4 border-primary font-medium shadow-sm' : 'hover:bg-gray-50'}`}>
        <img className='min-w-5 w-5' src={assets.list_icon} alt='' />
        <p className='hidden md:block'>Referrals</p>
      </NavLink>
    </>
  );

  const receptionistLinks = (
    <NavLink to={'/reception-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-6 md:min-w-64 cursor-pointer rounded-lg transition-all duration-200 mt-2 ${isActive ? 'bg-indigo-50 text-primary border-l-4 border-primary font-medium shadow-sm' : 'hover:bg-gray-50'}`}>
      <img className='min-w-5 w-5' src={assets.appointment_icon} alt='' />
      <p className='hidden md:block'>Reception Queue</p>
    </NavLink>
  );

  const doctorLinks = (
    <>
      <NavLink to={'/doctor-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-6 md:min-w-64 cursor-pointer rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-50 text-primary border-l-4 border-primary font-medium shadow-sm' : 'hover:bg-gray-50'}`}>
        <img className='min-w-5 w-5' src={assets.home_icon} alt='' />
        <p className='hidden md:block'>Dashboard</p>
      </NavLink>
      <NavLink to={'/doctor-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-6 md:min-w-64 cursor-pointer rounded-lg transition-all duration-200 mt-2 ${isActive ? 'bg-indigo-50 text-primary border-l-4 border-primary font-medium shadow-sm' : 'hover:bg-gray-50'}`}>
        <img className='min-w-5 w-5' src={assets.appointment_icon} alt='' />
        <p className='hidden md:block'>Appointments</p>
      </NavLink>
      <NavLink to={'/doctor-profile'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-6 md:min-w-64 cursor-pointer rounded-lg transition-all duration-200 mt-2 ${isActive ? 'bg-indigo-50 text-primary border-l-4 border-primary font-medium shadow-sm' : 'hover:bg-gray-50'}`}>
        <img className='min-w-5 w-5' src={assets.people_icon} alt='' />
        <p className='hidden md:block'>Profile</p>
      </NavLink>
      <NavLink to={'/doctor-records'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-6 md:min-w-64 cursor-pointer rounded-lg transition-all duration-200 mt-2 ${isActive ? 'bg-indigo-50 text-primary border-l-4 border-primary font-medium shadow-sm' : 'hover:bg-gray-50'}`}>
        <img className='min-w-5 w-5' src={assets.list_icon} alt='' />
        <p className='hidden md:block'>Patient Records</p>
      </NavLink>
      <NavLink to={'/doctor-prescriptions'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-6 md:min-w-64 cursor-pointer rounded-lg transition-all duration-200 mt-2 ${isActive ? 'bg-indigo-50 text-primary border-l-4 border-primary font-medium shadow-sm' : 'hover:bg-gray-50'}`}>
        <img className='min-w-5 w-5' src={assets.list_icon} alt='' />
        <p className='hidden md:block'>Prescriptions</p>
      </NavLink>
      <NavLink to={'/doctor-referrals'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-6 md:min-w-64 cursor-pointer rounded-lg transition-all duration-200 mt-2 ${isActive ? 'bg-indigo-50 text-primary border-l-4 border-primary font-medium shadow-sm' : 'hover:bg-gray-50'}`}>
        <img className='min-w-5 w-5' src={assets.list_icon} alt='' />
        <p className='hidden md:block'>Referrals</p>
      </NavLink>
    </>
  );

  return (
    <div className='min-h-screen bg-white border-r'>
      <ul className='text-[#515151] mt-5 px-4'>
        {isAdmin && adminLinks}
        {isReceptionist && receptionistLinks}
        {isDoctor && doctorLinks}
      </ul>
    </div>
  )
}

export default Sidebar
