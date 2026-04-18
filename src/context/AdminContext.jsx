import { createContext, useState, useContext } from "react";
import { toast } from "react-toastify";
import { api, adminApi, crmApi, referralsApi, appointmentsApi } from "../lib/api";
import { useAuth } from "./AuthContext";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const { token } = useAuth()
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [appointments, setAppointments] = useState([])
    const [doctors, setDoctors] = useState([])
    const [dashData, setDashData] = useState(false)
    const [crmTasks, setCrmTasks] = useState([])
    const [crmSummary, setCrmSummary] = useState(null)
    const [referrals, setReferrals] = useState([])
    const [receptionAppointments, setReceptionAppointments] = useState([])

    const getAllDoctors = async () => {
        try {
            const { data } = await adminApi.getAllDoctors()
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const changeAvailability = async (docId) => {
        try {
            const { data } = await api.post('/api/admin/change-availability', { docId })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getAllAppointments = async () => {
        try {
            const { data } = await adminApi.getAllAppointments()
            if (data.success) {
                setAppointments(data.appointments?.reverse() || [])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await appointmentsApi.cancel(appointmentId)
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await appointmentsApi.complete(appointmentId)
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const getDashData = async () => {
        try {
            const { data } = await adminApi.getDashboard()
            if (data.success) {
                setDashData(data.dashboard)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const deleteDoctor = async (docId) => {
        try {
            const { data } = await api.post('/api/admin/delete-doctor', { docId })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const getCrmTasks = async (filters = {}) => {
        try {
            const { data } = await crmApi.getAll(filters)
            if (data.success) {
                setCrmTasks(data.tasks || [])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const createCrmTask = async (payload) => {
        try {
            const { data } = await crmApi.create(payload)
            if (data.success) {
                toast.success('CRM task created')
                return true
            }
            toast.error(data.message)
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const updateCrmTask = async (taskId, payload) => {
        try {
            const { data } = await crmApi.update(taskId, payload)
            if (data.success) {
                toast.success('CRM task updated')
                return true
            }
            toast.error(data.message)
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const getCrmSummary = async () => {
        try {
            const { data } = await api.get('/api/crm/summary')
            if (data.success) {
                setCrmSummary(data.summary)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getReferrals = async (filters = {}) => {
        try {
            const { data } = await referralsApi.getAll(filters)
            if (data.success) {
                setReferrals(data.referrals || [])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const createReferral = async (payload) => {
        try {
            const { data } = await referralsApi.create(payload)
            if (data.success) {
                toast.success('Referral created')
                return true
            }
            toast.error(data.message)
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const updateReferralStatus = async (referralId, status) => {
        try {
            const { data } = await api.put(`/api/referrals/${referralId}`, { status })
            if (data.success) {
                toast.success('Referral updated')
                return true
            }
            toast.error(data.message)
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const getReceptionAppointments = async () => {
        try {
            const { data } = await api.get('/api/reception/appointments')
            if (data.success) {
                setReceptionAppointments((data.appointments || []).reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const confirmReceptionAppointment = async (appointmentId) => {
        try {
            const { data } = await api.post('/api/reception/appointments/confirm', { appointmentId })
            if (data.success) {
                toast.success(data.message)
                return true
            }
            toast.error(data.message)
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const cancelReceptionAppointment = async (appointmentId) => {
        try {
            const { data } = await api.post('/api/reception/appointments/cancel', { appointmentId })
            if (data.success) {
                toast.success(data.message)
                return true
            }
            toast.error(data.message)
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const verifyPayment = async (appointmentId, status, notes = '') => {
        try {
            const { data } = await appointmentsApi.verifyPayment(appointmentId, { status, notes })
            if (data.success) {
                toast.success(`Payment marked as ${status.toLowerCase()}`)
                getAllAppointments()
                return true
            }
            toast.error(data.message)
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const value = {
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        getAllAppointments,
        getDashData,
        cancelAppointment,
        completeAppointment,
        verifyPayment,
        dashData,
        deleteDoctor,
        crmTasks, setCrmTasks,
        getCrmTasks,
        createCrmTask,
        updateCrmTask,
        crmSummary, setCrmSummary,
        getCrmSummary,
        referrals, setReferrals,
        getReferrals,
        createReferral,
        updateReferralStatus,
        receptionAppointments, setReceptionAppointments,
        getReceptionAppointments,
        confirmReceptionAppointment,
        cancelReceptionAppointment
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider
