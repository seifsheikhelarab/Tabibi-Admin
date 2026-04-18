import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const DoctorsList = () => {

  const { doctors, changeAvailability, getAllDoctors, deleteDoctor } = useContext(AdminContext)
  const navigate = useNavigate()

  useEffect(() => {
    getAllDoctors()
  }, [])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium text-gray-700 font-outfit'>All Doctors</h1>
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-5'>
        {doctors.map((item, index) => (
          <div className='bg-white border border-indigo-50 rounded-xl overflow-hidden cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all duration-300' key={index}>
            <img className='bg-indigo-50 group-hover:bg-indigo-100 transition-colors duration-300 w-full aspect-[4/3] object-cover object-top' src={item.image} alt="" />
            <div className='p-5'>
              <h2 className='text-lg font-semibold text-gray-800 mb-1'>{item.firstName} {item.lastName}</h2>
              <p className='text-sm text-gray-600 mb-4'>{item.specialization}</p>

              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2 text-sm text-gray-700'>
                  <input
                    onChange={() => changeAvailability(item.id || item._id)}
                    type="checkbox"
                    checked={item.isAvailable}
                    className={`w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary ${!item.isAvailable && 'opacity-60'}`}
                  />
                  <span>Available</span>
                </div>
              </div>

              <div className='flex gap-2 pt-2 border-t border-gray-100'>
                <button onClick={() => navigate(`/edit-doctor/${item.id || item._id}`)} className='flex-1 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors font-medium'>
                  Edit
                </button>
                <div className='flex items-center gap-2 px-3 bg-red-50 rounded-lg'>
                  <input onChange={() => deleteDoctor(item.id || item._id)} type="checkbox" className='w-4 h-4 accent-red-500 cursor-pointer' title="Check to delete" />
                  <span className='text-xs text-red-500 font-medium whitespace-nowrap'>Delete</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList