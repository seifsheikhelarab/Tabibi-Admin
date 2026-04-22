import React from 'react'
import { useAuth } from './context/AuthContext';
import { Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import EditDoctor from './pages/Admin/EditDoctor';
import CrmBoard from './pages/Admin/CrmBoard';
import ReferralsBoard from './pages/Admin/ReferralsBoard';
import ReceptionAppointments from './pages/Admin/ReceptionAppointments';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorRecords from './pages/Doctor/DoctorRecords';
import DoctorPrescriptions from './pages/Doctor/DoctorPrescriptions';
import DoctorReferrals from './pages/Doctor/DoctorReferrals';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import DoctorLayout from './layouts/DoctorLayout';
import ReceptionLayout from './layouts/ReceptionLayout';

const App = () => {
  const { isAuthenticated, isLoading, role, isAdmin, isDoctor } = useAuth()

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
    if (role === 'OWNER') return '/admin-dashboard';
    if (role === 'ADMIN') return '/admin-dashboard';
    if (role === 'DOCTOR') return '/doctor-dashboard';
    return '/login';
  };

  return (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Navigate to={getDefaultRoute()} />} />
        
        {/* Admin Routes with Layout */}
        <Route path='/admin-dashboard' element={
          <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
            <AdminLayout><Dashboard /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path='/all-appointments' element={
          <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
            <AdminLayout><AllAppointments /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path='/add-doctor' element={
          <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
            <AdminLayout><AddDoctor /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path='/doctor-list' element={
          <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
            <AdminLayout><DoctorsList /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path='/edit-doctor/:id' element={
          <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
            <AdminLayout><EditDoctor /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path='/crm-board' element={
          <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
            <AdminLayout><CrmBoard /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path='/referrals-board' element={
          <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
            <AdminLayout><ReferralsBoard /></AdminLayout>
          </ProtectedRoute>
        } />
        
        {/* Receptionist Routes with Layout */}
        <Route path='/reception-appointments' element={
          <ProtectedRoute allowedRoles={['RECEPTIONIST']}>
            <ReceptionLayout><ReceptionAppointments /></ReceptionLayout>
          </ProtectedRoute>
        } />

        {/* Doctor Routes with Layout */}
        <Route path='/doctor-dashboard' element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorLayout><DoctorDashboard /></DoctorLayout>
          </ProtectedRoute>
        } />
        <Route path='/doctor-appointments' element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorLayout><DoctorAppointments /></DoctorLayout>
          </ProtectedRoute>
        } />
        <Route path='/doctor-profile' element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorLayout><DoctorProfile /></DoctorLayout>
          </ProtectedRoute>
        } />
        <Route path='/doctor-records' element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorLayout><DoctorRecords /></DoctorLayout>
          </ProtectedRoute>
        } />
        <Route path='/doctor-prescriptions' element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorLayout><DoctorPrescriptions /></DoctorLayout>
          </ProtectedRoute>
        } />
        <Route path='/doctor-referrals' element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorLayout><DoctorReferrals /></DoctorLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App