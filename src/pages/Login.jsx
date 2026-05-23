import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focused, setFocused] = useState(null)
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1]
      }
    }
  }

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] overflow-hidden">
      {/* Left: Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[200px] h-[200px] rounded-full bg-violet-500/5 blur-2xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center px-16"
        >
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-2.5 h-8 bg-primary rounded-full" />
            <span className="text-3xl font-bold text-white tracking-tight">Tabibi</span>
          </div>
          <h2 className="text-4xl font-light text-white tracking-tight leading-[1.15]">
            Healthcare management,{' '}
            <span className="text-primary font-medium">reimagined</span>.
          </h2>
          <p className="mt-6 text-gray-400 leading-relaxed font-medium max-w-md mx-auto">
            Streamline your clinic operations — manage appointments, patient records, staff, and referrals from one powerful dashboard.
          </p>
          
          {/* Feature bullets */}
          <div className="mt-12 space-y-4 text-left max-w-xs mx-auto">
            {[
              'Patient & appointment management',
              'Secure clinical records',
              'Real-time analytics dashboard',
              'Multi-role staff access'
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-300 font-medium">{item}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Right: Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm"
        >
          {/* Mobile back + brand */}
          <motion.div variants={itemVariants} className="lg:hidden mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-primary rounded-full" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">Tabibi</h1>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Clinic admin portal</p>
              </div>
            </div>
          </motion.div>

          {/* Desktop heading */}
          <motion.div variants={itemVariants} className="hidden lg:block mb-10">
            <h1 className="text-3xl font-light tracking-tight text-gray-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-400 font-medium">Sign in to your admin account</p>
          </motion.div>

          <form onSubmit={onSubmitHandler} className="space-y-5">
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label 
                htmlFor="email" 
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  id="email"
                  onChange={(e) => setEmail(e.target.value)} 
                  value={email} 
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 
                    border transition-all duration-200 ease-out
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    ${focused === 'email' ? 'border-gray-300 bg-white shadow-sm' : 'border-gray-200 bg-gray-50'}
                  `}
                  type="email" 
                  required 
                  placeholder="admin@clinic.com"
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="password" 
                  className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  id="password"
                  onChange={(e) => setPassword(e.target.value)} 
                  value={password} 
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  className={`
                    w-full pl-10 pr-11 py-3 rounded-xl text-gray-900 placeholder-gray-400 
                    border transition-all duration-200 ease-out
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    ${focused === 'password' ? 'border-gray-300 bg-white shadow-sm' : 'border-gray-200 bg-gray-50'}
                  `}
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="pt-1">
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out hover:shadow-lg hover:shadow-gray-900/15" 
                disabled={isLoading}
                type="submit"
              >
                <span className={`inline-flex items-center gap-2 transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                  Sign in
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400 font-medium">
              Tabibi Healthcare &mdash; Clinic Management System
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
