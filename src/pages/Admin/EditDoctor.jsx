import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../lib/api'

const EditDoctor = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const { token } = useAuth()

    const [docImg, setDocImg] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState(1)
    const [fees, setFees] = useState('')
    const [bio, setBio] = useState('')
    const [specialization, setSpecialization] = useState('Cardiology')
    const [qualification, setQualification] = useState('')

    // To show existing image
    const [prevImage, setPrevImage] = useState('')

    const { doctors, getAllDoctors } = useContext(AdminContext)

    useEffect(() => {
        if (doctors.length === 0) {
            getAllDoctors()
        }
    }, [doctors, getAllDoctors])

    useEffect(() => {
        if (doctors.length > 0) {
            // Check both _id and id (cuid/uuid) for compatibility
            const docData = doctors.find(doc => doc._id === id || doc.id === id)
            if (docData) {
                setFirstName(docData.firstName || '')
                setLastName(docData.lastName || '')
                setEmail(docData.email || '')
                setExperience(docData.experience || 1)
                setFees(docData.fees || '')
                setBio(docData.bio || '')
                setSpecialization(docData.specialization || 'Cardiology')
                setQualification(docData.qualification || '')
                setPrevImage(docData.image || '')
                setPassword(docData.password || '')
            } else {
                toast.error('Doctor not found')
                navigate('/doctor-list')
            }
        }
    }, [doctors, id, navigate])

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            const formData = new FormData();

            formData.append('docId', id)
            if (docImg) {
                formData.append('image', docImg)
            }
            formData.append('firstName', firstName)
            formData.append('lastName', lastName)
            // email usually shouldn't be changed or handled carefully, but allowing here
            formData.append('email', email)
            password && formData.append('password', password)
            formData.append('experience', parseInt(experience))
            formData.append('fees', Number(fees))
            formData.append('bio', bio)
            formData.append('specialization', specialization)
            formData.append('qualification', qualification)

            const { data } = await api.post('/api/admin/update-doctor', formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors() // Refresh list
                navigate('/doctor-list')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>

            <p className='mb-3 text-lg font-medium'>Edit Doctor</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : prevImage || assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="" id="doc-img" hidden />
                    <p>Upload doctor <br /> picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>First Name</p>
                            <input onChange={e => setFirstName(e.target.value)} value={firstName} className='border rounded px-3 py-2' type="text" placeholder='First Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Last Name</p>
                            <input onChange={e => setLastName(e.target.value)} value={lastName} className='border rounded px-3 py-2' type="text" placeholder='Last Name' />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Password</p>
                            <input onChange={e => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="text" placeholder='Password' />
                            <p className='text-xs text-gray-500'>Note: If the password starts with "$2b$", it is encrypted. Change it to see it in plain text.</p>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Experience (years)</p>
                            <select onChange={e => setExperience(e.target.value)} value={experience} className='border rounded px-2 py-2' >
                                <option value="1">1 Year</option>
                                <option value="2">2 Years</option>
                                <option value="3">3 Years</option>
                                <option value="4">4 Years</option>
                                <option value="5">5 Years</option>
                                <option value="6">6 Years</option>
                                <option value="8">8 Years</option>
                                <option value="9">9 Years</option>
                                <option value="10">10 Years</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Fees</p>
                            <input onChange={e => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='Doctor fees' required />
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Specialization</p>
                            <select onChange={e => setSpecialization(e.target.value)} value={specialization} className='border rounded px-2 py-2'>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Neurology">Neurology</option>
                                <option value="General Surgery">General Surgery</option>
                                <option value="Urology">Urology</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Dentistry">Dentistry</option>
                                <option value="Ear, Nose and Throat">Ear, Nose and Throat</option>
                                <option value="Dermatology">Dermatology</option>
                                <option value="Ophthalmology">Ophthalmology</option>
                                <option value="Gastroenterology">Gastroenterology</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Qualification</p>
                            <input onChange={e => setQualification(e.target.value)} value={qualification} className='border rounded px-3 py-2' type="text" placeholder='Qualification (e.g. MBBS, MD)' required />
                        </div>

                    </div>

                    <div className='w-[50px]'>
                        {/* Empty spacing div if needed for alignment */}
                    </div>

                </div>

                <div>
                    <p className='mt-4 mb-2'>Bio</p>
                    <textarea onChange={e => setBio(e.target.value)} value={bio} className='w-full px-4 pt-2 border rounded' rows={5} placeholder='Write about the doctor'></textarea>
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Save Changes</button>

            </div>


        </form>
    )
}

export default EditDoctor
