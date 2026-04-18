import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {

  const { dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)


  useEffect(() => {
    getDashData()
  }, [])

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded-xl border border-stone-100 hover:shadow-md transition-all duration-300 cursor-pointer'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-2xl font-semibold text-gray-700'>{currency} {dashData.earnings}</p>
            <p className='text-gray-500 text-sm'>My Earnings</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded-xl border border-stone-100 hover:shadow-md transition-all duration-300 cursor-pointer'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-2xl font-semibold text-gray-700'>{dashData.appointments}</p>
            <p className='text-gray-500 text-sm'>My Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded-xl border border-stone-100 hover:shadow-md transition-all duration-300 cursor-pointer'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-2xl font-semibold text-gray-700'>{dashData.patients}</p>
            <p className='text-gray-500 text-sm'>Total Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-xl border border-stone-100 mt-10 shadow-sm overflow-hidden'>
        <div className='flex items-center gap-2.5 px-4 py-4 rounded-t-xl bg-gray-50 border-b border-gray-100'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold text-gray-700'>Latest Bookings</p>
        </div>

        <div className='pt-0 w-full'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-6 py-4 gap-3 hover:bg-gray-50 transition-all duration-200 border-b last:border-0' key={index}>
              <img className='rounded-full w-10 h-10 object-cover shadow-sm' src={item.userData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                <p className='text-gray-600 text-xs'>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled
                ? <p className='text-red-500 text-xs font-medium bg-red-50 px-3 py-1 rounded-full'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium bg-green-50 px-3 py-1 rounded-full'>Completed</p>
                  : <div className='flex gap-2'>
                    <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer hover:scale-110 transition-transform' src={assets.cancel_icon} alt="" />
                    <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer hover:scale-110 transition-transform' src={assets.tick_icon} alt="" />
                  </div>
              }
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default DoctorDashboard