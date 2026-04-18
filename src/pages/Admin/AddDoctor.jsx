import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [bio, setBio] = useState('')
    const [specialization, setSpecialization] = useState('Cardiology')
    const [qualification, setQualification] = useState('')

    const { token } = useAuth()

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!docImg) {
                return toast.error('Image Not Selected')
            }

            const formData = new FormData();

            formData.append('image', docImg)
            formData.append('firstName', firstName)
            formData.append('lastName', lastName)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', parseInt(experience))
            formData.append('fees', Number(fees))
            formData.append('bio', bio)
            formData.append('specialization', specialization)
            formData.append('qualification', qualification)

            const { data } = await api.post('/api/admin/add-doctor', formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setFirstName('')
                setLastName('')
                setPassword('')
                setEmail('')
                setQualification('')
                setBio('')
                setBio('')
                setFees('')
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

            <p className='mb-3 text-lg font-medium text-gray-700'>Add Doctor</p>

            <div className='bg-white px-8 py-8 border rounded-xl shadow-sm w-full max-w-4xl max-h-[80vh] overflow-y-scroll scrollbar-hide'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-16 h-16 object-cover bg-indigo-50 rounded-full cursor-pointer hover:opacity-80 transition-opacity' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="" id="doc-img" hidden />
                    <p>Upload doctor <br /> picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                    <div className='w-full lg:flex-1 flex flex-col gap-5'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p className='text-sm font-medium text-gray-700 mb-1'>First Name</p>
                            <input onChange={e => setFirstName(e.target.value)} value={firstName} className='border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all' type="text" placeholder='First Name' required />
                        </div>
                        
                        <div className='flex-1 flex flex-col gap-1'>
                            <p className='text-sm font-medium text-gray-700 mb-1'>Last Name</p>
                            <input onChange={e => setLastName(e.target.value)} value={lastName} className='border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all' type="text" placeholder='Last Name' />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p className='text-sm font-medium text-gray-700 mb-1'>Doctor Email</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className='border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all' type="email" placeholder='Email' required />
                        </div>


                        <div className='flex-1 flex flex-col gap-1'>
                            <p className='text-sm font-medium text-gray-700 mb-1'>Set Password</p>
                            <input onChange={e => setPassword(e.target.value)} value={password} className='border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all' type="password" placeholder='Password' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p className='text-sm font-medium text-gray-700 mb-1'>Experience (years)</p>
                            <select onChange={e => setExperience(e.target.value)} value={experience} className='border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white' >
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
                            <p className='text-sm font-medium text-gray-700 mb-1'>Fees</p>
                            <input onChange={e => setFees(e.target.value)} value={fees} className='border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all' type="number" placeholder='Doctor fees' required />
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-5'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p className='text-sm font-medium text-gray-700 mb-1'>Specialization</p>
                            <select onChange={e => setSpecialization(e.target.value)} value={specialization} className='border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white'>
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
                            <p className='text-sm font-medium text-gray-700 mb-1'>Qualification</p>
                            <input onChange={e => setQualification(e.target.value)} value={qualification} className='border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all' type="text" placeholder='Qualification (e.g. MBBS, MD)' required />
                        </div>

                    </div>

                </div>

                <div className='mt-5'>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Bio</p>
                    <textarea onChange={e => setBio(e.target.value)} value={bio} className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all' rows={5} placeholder='Write about the doctor'></textarea>
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-6 text-white rounded-full font-medium hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg'>Add doctor</button>

            </div>


        </form>
    )
}

export default AddDoctor
