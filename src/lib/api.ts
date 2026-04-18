import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const extractData = (response: any) => {
  // Revert: Contexts heavily rely on `const { data } = await api.xyz()`
  // which requires the standard Axios response object. Unpacking it early causes `data` to be undefined!
  return response;
};

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('sessionToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
      localStorage.removeItem('organizationId');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  signIn: async (email: string, password: string) => {
    const { data } = await api.post('/api/auth/sign-in/email', { email, password });
    if (data.token) {
      localStorage.setItem('sessionToken', data.token);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    if (data.organizationId) {
      localStorage.setItem('organizationId', data.organizationId);
    }
    if (data.role) {
      localStorage.setItem('role', data.role);
    }
    return data;
  },

  signUp: async (email: string, password: string, name: string) => {
    const { data } = await api.post('/api/auth/sign-up/email', { email, password, name });
    return data;
  },

  signOut: async () => {
    try {
      await api.post('/api/auth/sign-out');
    } finally {
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
      localStorage.removeItem('organizationId');
      localStorage.removeItem('role');
    }
  },

  getSession: async () => {
    const { data } = await api.get('/api/auth/get-session');
    return data;
  },
};

export const adminApi = {
  getDashboard: () => api.get('/api/admin/dashboard').then(extractData),
  getAllDoctors: () => api.get('/api/admin/all-doctors').then(extractData),
  getAllPatients: () => api.get('/api/admin/all-patients').then(extractData),
  getAllAppointments: () => api.get('/api/admin/all-appointments').then(extractData),
  updateDoctor: (data: any) => api.post('/api/admin/update-doctor', data).then(extractData),
};

export const doctorApi = {
  getProfile: () => api.get('/api/doctor/profile').then(extractData),
  updateProfile: (data: any) => api.post('/api/doctor/profile', data).then(extractData),
  getDashboard: () => api.get('/api/doctor/dashboard').then(extractData),
  getAppointments: () => api.get('/api/doctor/appointments').then(extractData),
  cancelAppointment: (id: string) => api.post('/api/doctor/cancel-appointment', { appointmentId: id }).then(extractData),
  completeAppointment: (id: string) => api.post('/api/doctor/complete-appointment', { appointmentId: id }).then(extractData),
  getAvailability: (id: string) => api.get(`/api/doctors/${id}/availability`).then(extractData),
  setAvailability: (id: string, data: any) => api.post(`/api/doctors/${id}/availability`, data).then(extractData),
  getRecords: () => api.get('/api/doctor/records').then(extractData),
  getPrescriptions: () => api.get('/api/doctor/prescriptions').then(extractData),
  getReferrals: () => api.get('/api/doctor/referrals').then(extractData),
};

export const patientsApi = {
  getAll: (params?: any) => api.get('/api/patients', { params }).then(extractData),
  getById: (id: string) => api.get(`/api/patients/${id}`).then(extractData),
  create: (data: any) => api.post('/api/patients', data).then(extractData),
  update: (id: string, data: any) => api.put(`/api/patients/${id}`, data).then(extractData),
  delete: (id: string) => api.delete(`/api/patients/${id}`).then(extractData),
};

export const appointmentsApi = {
  getAll: (params?: any) => api.get('/api/appointments', { params }).then(extractData),
  getById: (id: string) => api.get(`/api/appointments/${id}`).then(extractData),
  create: (data: any) => api.post('/api/appointments', data).then(extractData),
  update: (id: string, data: any) => api.put(`/api/appointments/${id}`, data).then(extractData),
  cancel: (id: string) => api.put(`/api/appointments/${id}/cancel`).then(extractData),
  complete: (id: string, notes?: string) => api.put(`/api/appointments/${id}/complete`, { notes }).then(extractData),
  verifyPayment: (id: string, data: { status: string; notes?: string }) => api.post(`/api/appointments/${id}/verify-payment`, data).then(extractData),
};

export const recordsApi = {
  getAll: (params?: any) => api.get('/api/records', { params }).then(extractData),
  getById: (id: string) => api.get(`/api/records/${id}`).then(extractData),
  create: (data: any) => api.post('/api/records', data).then(extractData),
  update: (id: string, data: any) => api.put(`/api/records/${id}`, data).then(extractData),
};

export const prescriptionsApi = {
  getAll: (params?: any) => api.get('/api/prescriptions', { params }).then(extractData),
  getById: (id: string) => api.get(`/api/prescriptions/${id}`).then(extractData),
  create: (data: any) => api.post('/api/prescriptions', data).then(extractData),
  update: (id: string, data: any) => api.put(`/api/prescriptions/${id}`, data).then(extractData),
};

export const referralsApi = {
  getAll: (params?: any) => api.get('/api/referrals', { params }).then(extractData),
  getById: (id: string) => api.get(`/api/referrals/${id}`).then(extractData),
  create: (data: any) => api.post('/api/referrals', data).then(extractData),
  update: (id: string, data: any) => api.put(`/api/referrals/${id}`, data).then(extractData),
};

export const pharmacyApi = {
  getAll: (params?: any) => api.get('/api/pharmacies', { params }).then(extractData),
  getById: (id: string) => api.get(`/api/pharmacies/${id}`).then(extractData),
  create: (data: any) => api.post('/api/pharmacies', data).then(extractData),
  update: (id: string, data: any) => api.put(`/api/pharmacies/${id}`, data).then(extractData),
  delete: (id: string) => api.delete(`/api/pharmacies/${id}`).then(extractData),
};

export const labApi = {
  getAll: (params?: any) => api.get('/api/labs', { params }).then(extractData),
  getById: (id: string) => api.get(`/api/labs/${id}`).then(extractData),
  create: (data: any) => api.post('/api/labs', data).then(extractData),
  update: (id: string, data: any) => api.put(`/api/labs/${id}`, data).then(extractData),
  delete: (id: string) => api.delete(`/api/labs/${id}`).then(extractData),
};

export const ratingApi = {
  create: (data: any) => api.post('/api/ratings', data).then(extractData),
  getDoctorReviews: (doctorId: string, params?: any) => api.get(`/api/ratings/doctor/${doctorId}`, { params }).then(extractData),
  getDoctorStats: (doctorId: string) => api.get(`/api/ratings/doctor/${doctorId}/stats`).then(extractData),
};

export const crmApi = {
  getAll: (params?: any) => api.get('/api/crm', { params }).then(extractData),
  getById: (id: string) => api.get(`/api/crm/${id}`).then(extractData),
  create: (data: any) => api.post('/api/crm', data).then(extractData),
  update: (id: string, data: any) => api.put(`/api/crm/${id}`, data).then(extractData),
  delete: (id: string) => api.delete(`/api/crm/${id}`).then(extractData),
};

export const uploadApi = {
  uploadImage: (formData: FormData) => api.post('/api/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(extractData),
};

export default api;
