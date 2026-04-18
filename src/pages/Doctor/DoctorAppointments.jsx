import React from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {

  const { appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    getAppointments()
  }, [])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium text-gray-700'>All Appointments</p>

      <div className='bg-white border rounded-xl shadow-sm text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll scrollbar-hide'>

        {/* Table Header */}
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-4 px-6 border-b bg-gray-50 text-gray-600 font-medium sticky top-0 z-10'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Status</p>
        </div>

        {/* Table Rows */}
        <div className='divide-y divide-gray-100'>
          {appointments.sort((a, b) => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const parseDate = (dateStr, timeStr) => {
              const [d, m, y] = dateStr.split('_').map(Number);
              return new Date(`${d} ${months[m - 1]} ${y} ${timeStr}`).getTime();
            }
            return parseDate(b.slotDate, b.slotTime) - parseDate(a.slotDate, a.slotTime);
          }).map((item, index) => (
            <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-4 px-6 hover:bg-indigo-50/30 transition-colors duration-200' key={index}>
              <p className='max-sm:hidden font-medium text-gray-400'>{index + 1}</p>
              <div className='flex items-center gap-3'>
                <img src={item.userData.image} className='w-10 h-10 rounded-full object-cover shadow-sm' alt="" />
                <p className='font-medium text-gray-800'>{item.userData.name}</p>
              </div>
              <div>
                <p className={`text-xs inline-flex px-2.5 py-0.5 rounded-full font-medium ${item.paymentMethod === 'Stripe' || item.paymentMethod === 'Instapay' || item.payment ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                  {item.paymentMethod || (item.payment ? 'Online' : 'CASH')}
                </p>
                {item.paymentMethod === 'Instapay' && item.paymentProof && (
                  <a href={item.paymentProof} target='_blank' rel="noopener noreferrer" className='ml-2 text-xs text-blue-500 hover:text-blue-700 underline'>
                    View Receipt
                  </a>
                )}
              </div>
              <p className='max-sm:hidden'>{calculateAge(item.userData.dob)} yrs</p>
              <p className='text-gray-700'>{slotDateFormat(item.slotDate)}, <span className='text-xs text-gray-500 block sm:inline'>{item.slotTime}</span></p>
              <p className='font-medium'>{currency}{item.amount}</p>

              {/* Actions / Status */}
              <div className='flex items-center'>
                {item.cancelled
                  ? <p className='text-red-500 text-xs font-medium bg-red-50 px-3 py-1 rounded-full border border-red-100'>Cancelled</p>
                  : item.isCompleted
                    ? <p className='text-green-500 text-xs font-medium bg-green-50 px-3 py-1 rounded-full border border-green-100'>Completed</p>
                    : <div className='flex gap-2'>
                      <button onClick={() => cancelAppointment(item._id)} className='p-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors group' title="Cancel">
                        <img className='w-8 group-hover:drop-shadow-sm transition-transform active:scale-95' src={assets.cancel_icon} alt="Cancel" />
                      </button>
                      <button onClick={() => completeAppointment(item._id)} className='p-2 rounded-full hover:bg-green-50 hover:text-green-600 transition-colors group' title="Mark Complete">
                        <img className='w-8 group-hover:drop-shadow-sm transition-transform active:scale-95' src={assets.tick_icon} alt="Complete" />
                      </button>
                    </div>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointments