import React from 'react'
import { useAuth } from './context/AuthContext';
import { Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import EditDoctor from './pages/Admin/EditDoctor';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorRecords from './pages/Doctor/DoctorRecords';
import CrmBoard from './pages/Admin/CrmBoard';
import DoctorPrescriptions from './pages/Doctor/DoctorPrescriptions';
import DoctorReferrals from './pages/Doctor/DoctorReferrals';
import ReferralsBoard from './pages/Admin/ReferralsBoard';
import ReceptionAppointments from './pages/Admin/ReceptionAppointments';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const { isAuthenticated, isLoading, role, isAdmin } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer />
        <Login />
      </>
    )
  }

  const getDefaultRoute = () => {
    if (role === 'RECEPTIONIST') return '/reception-appointments';
    if (isAdmin) return '/admin-dashboard';
    return '/doctor-dashboard';
  };

  return (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Navigate to={getDefaultRoute()} />} />
          
          {/* Admin Routes */}
          <Route path='/admin-dashboard' element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><Dashboard /></ProtectedRoute>} />
          <Route path='/all-appointments' element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><AllAppointments /></ProtectedRoute>} />
          <Route path='/add-doctor' element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><AddDoctor /></ProtectedRoute>} />
          <Route path='/doctor-list' element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><DoctorsList /></ProtectedRoute>} />
          <Route path='/edit-doctor/:id' element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><EditDoctor /></ProtectedRoute>} />
          <Route path='/crm-board' element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><CrmBoard /></ProtectedRoute>} />
          <Route path='/referrals-board' element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><ReferralsBoard /></ProtectedRoute>} />
          
          {/* Receptionist Routes */}
          <Route path='/reception-appointments' element={<ProtectedRoute allowedRoles={['RECEPTIONIST', 'ADMIN', 'OWNER']}><ReceptionAppointments /></ProtectedRoute>} />

          {/* Doctor Routes */}
          <Route path='/doctor-dashboard' element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN', 'OWNER']}><DoctorDashboard /></ProtectedRoute>} />
          <Route path='/doctor-appointments' element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN', 'OWNER']}><DoctorAppointments /></ProtectedRoute>} />
          <Route path='/doctor-profile' element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN', 'OWNER']}><DoctorProfile /></ProtectedRoute>} />
          <Route path='/doctor-records' element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN', 'OWNER']}><DoctorRecords /></ProtectedRoute>} />
          <Route path='/doctor-prescriptions' element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN', 'OWNER']}><DoctorPrescriptions /></ProtectedRoute>} />
          <Route path='/doctor-referrals' element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN', 'OWNER']}><DoctorReferrals /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
