import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const VerifyPaymentModal = ({ appointment, onClose, onVerify }) => {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-semibold text-gray-800">Verify Instapay Payment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Patient: <span className="text-gray-800 font-medium">{appointment.userData.name}</span></p>
            <p className="text-sm text-gray-500 mb-1">Amount: <span className="text-gray-800 font-medium">{appointment.amount} EGP</span></p>
          </div>
          
          <div className="bg-gray-100 rounded-lg overflow-hidden border mb-6 flex items-center justify-center min-h-[300px]">
            {appointment.paymentProof ? (
              <img src={appointment.paymentProof} alt="Payment Proof" className="max-w-full max-h-[400px] object-contain" />
            ) : (
              <p className="text-gray-400 italic">No proof image available</p>
            )}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => onVerify(appointment._id, 'PAID')}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
            >
              Approve Payment
            </button>
            <button 
              onClick={() => onVerify(appointment._id, 'FAILED')}
              className="flex-1 bg-white border border-red-200 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AllAppointments = () => {

  const { appointments, cancelAppointment, completeAppointment, getAllAppointments, verifyPayment } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const handleVerify = async (id, status) => {
    const success = await verifyPayment(id, status)
    if (success) {
      setSelectedAppointment(null)
    }
  }

  useEffect(() => {
    getAllAppointments()
  }, [])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium text-gray-700'>All Appointments</p>

      <div className='bg-white border rounded-xl shadow-sm text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll scrollbar-hide'>

        {/* Table Header */}
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr_1fr] grid-flow-col py-4 px-6 border-b bg-gray-50 text-gray-600 font-medium sticky top-0 z-10'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Payment</p>
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
            <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr_1fr] items-center text-gray-500 py-4 px-6 hover:bg-gray-50 transition-colors duration-200' key={index}>
              <p className='max-sm:hidden font-medium text-gray-400'>{index + 1}</p>
              <div className='flex items-center gap-3'>
                <img src={item.userData.image} className='w-10 h-10 rounded-full object-cover shadow-sm' alt="" />
                <p className='font-medium text-gray-800'>{item.userData.name}</p>
              </div>
              <p className='max-sm:hidden'>{calculateAge(item.userData.dob)} yrs</p>
              <p className='text-gray-700'>{slotDateFormat(item.slotDate)}, <span className='text-xs text-gray-500 block sm:inline'>{item.slotTime}</span></p>
              <div className='flex items-center gap-3'>
                <img src={item.docData.image} className='w-10 h-10 rounded-full object-cover bg-gray-200 shadow-sm' alt="" />
                <p className='font-medium text-gray-800'>{item.docData.name}</p>
              </div>
              <p>{currency}{item.amount}</p>
              <div>
                <div className="flex flex-col gap-1">
                  <p className={`text-[10px] uppercase tracking-wider inline-flex px-2 py-0.5 rounded-full font-bold w-fit ${
                    item.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700 border border-green-200' : 
                    item.paymentStatus === 'VERIFYING' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                    'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {item.paymentStatus || 'PENDING'}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium px-1">
                    {item.paymentMethod || 'Not Selected'}
                  </p>
                  {item.paymentStatus === 'VERIFYING' && (
                    <button 
                      onClick={() => setSelectedAppointment(item)}
                      className="text-[10px] bg-primary text-white px-2 py-0.5 rounded hover:bg-primary/90 transition-colors w-fit font-bold"
                    >
                      VERIFY
                    </button>
                  )}
                </div>
              </div>

              {
                item.cancelled
                  ? <p className='text-red-500 text-xs font-medium bg-red-50 px-3 py-1 rounded-full border border-red-100 w-fit'>Cancelled</p>
                  : item.isCompleted
                    ? <p className='text-green-500 text-xs font-medium bg-green-50 px-3 py-1 rounded-full border border-green-100 w-fit'>Completed</p>
                    : <div className='flex items-center gap-2'>
                      <button onClick={() => cancelAppointment(item._id)} className='p-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors group' title="Cancel">
                        <img className='w-7 group-hover:drop-shadow-sm transition-transform active:scale-95' src={assets.cancel_icon} alt="Cancel" />
                      </button>
                      {/* Admin context had completeAppointment capability in the scanned file, retaining it */}
                      {completeAppointment && (
                        <button onClick={() => completeAppointment(item._id)} className='p-2 rounded-full hover:bg-green-50 hover:text-green-600 transition-colors group' title="Mark Complete">
                          <img className='w-7 group-hover:drop-shadow-sm transition-transform active:scale-95' src={assets.tick_icon} alt="Complete" />
                        </button>
                      )}
                    </div>
              }
            </div>
          ))}
        </div>
      </div>
      {selectedAppointment && (
        <VerifyPaymentModal 
          appointment={selectedAppointment} 
          onClose={() => setSelectedAppointment(null)}
          onVerify={handleVerify}
        />
      )}
    </div>
  )
}

export default AllAppointments