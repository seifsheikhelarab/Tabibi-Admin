import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password);
    setIsLoading(false);
    
    if (success) {
      navigate('/');
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'>Tabibi</span> Login</p>
        <div className='w-full'>
          <p>Email</p>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            className='border border-[#DADADA] rounded w-full p-2 mt-1' 
            type="email" 
            required 
          />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            className='border border-[#DADADA] rounded w-full p-2 mt-1' 
            type="password" 
            required 
          />
        </div>
        <button 
          className='bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-50' 
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </form>
  )
}

export default Login
