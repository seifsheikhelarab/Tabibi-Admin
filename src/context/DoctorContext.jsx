import { createContext, useState } from "react";
import { toast } from 'react-toastify'
import { doctorApi, recordsApi, prescriptionsApi, referralsApi, pharmacyApi, labApi, api } from "../lib/api";

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)
    const [records, setRecords] = useState([])
    const [prescriptions, setPrescriptions] = useState([])
    const [referrals, setReferrals] = useState([])
    const [pharmacies, setPharmacies] = useState([])
    const [labs, setLabs] = useState([])
    const [availability, setAvailability] = useState([])

    const getAppointments = async () => {
        try {
            const { data } = await doctorApi.getAppointments()
            if (data.success) {
                setAppointments(data.appointments?.reverse() || [])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getProfileData = async () => {
        try {
            const { data } = await doctorApi.getProfile()
            console.log(data)
            setProfileData(data.doctor || data.profileData)
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const updateProfile = async (profileData) => {
        try {
            const { data } = await doctorApi.updateProfile(profileData)
            if (data.success) {
                toast.success('Profile updated')
                getProfileData()
                return true
            }
            toast.error(data.message)
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await doctorApi.cancelAppointment(appointmentId)
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                getDashData()
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
            const { data } = await doctorApi.completeAppointment(appointmentId)
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                getDashData()
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
            const { data } = await doctorApi.getDashboard()
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

    const getPatientRecords = async (patientId) => {
        try {
            const { data } = await recordsApi.getAll({ patientId })
            if (data.success) {
                setRecords(data.records || [])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const createPatientRecord = async (payload, doctorId) => {
        try {
            const recordPayload = {
                ...payload,
                doctorId,
                visitDate: new Date().toISOString(),
            }
            const { data } = await recordsApi.create(recordPayload)
            if (data.success) {
                toast.success('Patient record created')
                return true
            }
            toast.error(data.message)
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const getMyPrescriptions = async () => {
        try {
            const { data } = await prescriptionsApi.getAll()
            if (data.success) {
                setPrescriptions(data.prescriptions || [])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const createPrescription = async (payload) => {
        try {
            const { data } = await prescriptionsApi.create({
                ...payload,
                doctorId: profileData?.id,
            })
            if (data.success) {
                toast.success('Prescription created')
                return true
            }
            toast.error(data.message)
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const getMyReferrals = async () => {
        try {
            const { data } = await referralsApi.getAll()
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

    const getPharmacies = async () => {
        try {
            const { data } = await pharmacyApi.getAll({ isActive: true })
            if (data.success) {
                setPharmacies(data.data || [])
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getLabs = async () => {
        try {
            const { data } = await labApi.getAll({ isActive: true })
            if (data.success) {
                setLabs(data.data || [])
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getAvailability = async (doctorId) => {
        try {
            const { data } = await doctorApi.getAvailability(doctorId)
            if (data.success) {
                setAvailability(data.data || [])
            }
        } catch (error) {
            console.error(error)
        }
    }

    const updateAvailability = async (doctorId, availabilityData) => {
        try {
            const { data } = await doctorApi.setAvailability(doctorId, availabilityData)
            if (data.success) {
                toast.success('Availability updated')
                getAvailability(doctorId)
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
        appointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        dashData, setDashData,
        getDashData,
        profileData, setProfileData,
        getProfileData,
        updateProfile,
        records, setRecords,
        getPatientRecords,
        createPatientRecord,
        prescriptions, setPrescriptions,
        getMyPrescriptions,
        createPrescription,
        referrals, setReferrals,
        getMyReferrals,
        createReferral,
        pharmacies,
        labs,
        getPharmacies,
        getLabs,
        availability,
        getAvailability,
        updateAvailability,
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider
