import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'

const features = [
  {
    icon: 'users',
    title: 'Patient Management',
    description: 'Comprehensive patient profiles, visit history, medical records, and care coordination in one unified dashboard.',
    gradient: 'from-primary/10 to-primary/5',
    iconColor: 'text-primary',
  },
  {
    icon: 'calendar',
    title: 'Appointment Scheduling',
    description: 'Smart calendar management with real-time slot booking, automated reminders, and multi-provider coordination.',
    gradient: 'from-emerald-50 to-emerald-50/30',
    iconColor: 'text-emerald-600',
  },
  {
    icon: 'document',
    title: 'Clinical Records',
    description: 'Secure electronic health records with structured templates, lab integrations, and instant document access.',
    gradient: 'from-amber-50 to-amber-50/30',
    iconColor: 'text-amber-600',
  },
  {
    icon: 'doctor',
    title: 'Doctor Directory',
    description: 'Full provider roster with credential tracking, availability management, performance metrics, and ratings.',
    gradient: 'from-violet-50 to-violet-50/30',
    iconColor: 'text-violet-600',
  },
  {
    icon: 'checklist',
    title: 'Task & Referrals',
    description: 'Integrated CRM for patient follow-ups, referral management with status tracking, and cross-clinic coordination.',
    gradient: 'from-sky-50 to-sky-50/30',
    iconColor: 'text-sky-600',
  },
  {
    icon: 'chart',
    title: 'Analytics & Insights',
    description: 'Real-time dashboards with appointment trends, revenue tracking, patient demographics, and operational KPIs.',
    gradient: 'from-rose-50 to-rose-50/30',
    iconColor: 'text-rose-600',
  },
]

const stats = [
  { label: 'Active Patients', value: '10K+' },
  { label: 'Clinics Onboarded', value: '500+' },
  { label: 'Appointments/Month', value: '50K+' },
  { label: 'Avg. Rating', value: '4.9' },
]

const FeatureIcon = ({ type }) => {
  const icons = {
    users: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
    calendar: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    ),
    document: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
    doctor: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    ),
    checklist: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    ),
    chart: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
  }
  return <>{icons[type] || icons.users}</>
}

const Home = () => {
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3])

  return (
    <div className="min-h-screen bg-[#FAFAFA] overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-primary rounded-full" />
              <span className="text-sm font-bold tracking-tight text-gray-900">
                Tabibi <span className="text-gray-400 font-normal">Admin</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-all hover:shadow-lg hover:shadow-gray-900/10"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="relative pt-32 pb-24 lg:pt-44 lg:pb-36 overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/[0.02] blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-violet-50 blur-3xl" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.015]" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/[0.06] border border-primary/[0.1] rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-primary/70">
              Healthcare Management Platform v2
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-gray-900 leading-[0.95]"
          >
            Clinic operations,{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary font-medium">simplified</span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/[0.08] rounded-full -rotate-1" />
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            The all-in-one admin portal for clinics and healthcare practices.{' '}
            <span className="text-gray-500">
              Manage patients, appointments, records, and your team &mdash; all in one place.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              className="group relative px-8 py-4 bg-gray-900 text-white font-semibold rounded-2xl transition-all hover:bg-gray-800 hover:shadow-2xl hover:shadow-gray-900/20"
            >
              <span className="relative z-10">Access Dashboard</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/[0.03] to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 text-gray-500 font-semibold rounded-2xl border border-gray-200 hover:border-gray-300 hover:text-gray-700 transition-all bg-white/50"
            >
              Explore Features
            </motion.button>
          </motion.div>

          {/* Floating pills */}
          <div className="absolute -top-12 left-12 hidden lg:block">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="px-4 py-2 bg-white rounded-2xl shadow-lg border border-gray-100"
            >
              <span className="text-xs font-semibold text-gray-400">
                &#x1F468;&#x200D;&#x2695;&#xFE0F; 12 Doctors Online
              </span>
            </motion.div>
          </div>
          <div className="absolute -bottom-8 right-12 hidden lg:block">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="px-4 py-2 bg-white rounded-2xl shadow-lg border border-gray-100"
            >
              <span className="text-xs font-semibold text-gray-400">
                &#x1F4C5; 48 Appointments Today
              </span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-6xl mx-auto px-6 lg:px-10 mb-24"
      >
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y lg:divide-y-0 lg:divide-x divide-gray-100 grid grid-cols-2 lg:grid-cols-4 overflow-hidden">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="py-8 px-8 text-center group hover:bg-gray-50/50 transition-colors"
            >
              <p className="text-3xl lg:text-4xl font-light tracking-tight text-gray-900 group-hover:text-primary transition-colors">
                {stat.value}
              </p>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 lg:px-10 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60 bg-primary/[0.06] px-4 py-1.5 rounded-full mb-4">
            Everything You Need
          </span>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight text-gray-900">
            Complete clinic toolkit
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto font-medium">
            From patient intake to discharge, Tabibi streamlines every step of the clinical workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300"
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center ${feature.iconColor} mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <FeatureIcon type={feature.icon} />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-6 lg:px-10 pb-32"
      >
        <div className="relative overflow-hidden bg-gray-900 rounded-3xl px-10 py-20 lg:px-20 lg:py-24 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 blur-3xl rounded-full -ml-20 -mb-20" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10"
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-gray-500 mb-6">
              Ready to Transform Your Clinic?
            </span>
            <h2 className="text-3xl lg:text-5xl font-light text-white tracking-tight leading-[1.1]">
              Take control of your{' '}
              <span className="text-primary font-medium">healthcare operations</span>.
            </h2>
            <p className="mt-6 text-gray-400 max-w-lg mx-auto font-medium">
              Join hundreds of clinics already using Tabibi to streamline their workflows and deliver
              better patient care.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              className="mt-10 px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 inline-flex items-center gap-2"
            >
              Get Started Free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-primary/60 rounded-full" />
            <span className="text-xs font-semibold text-gray-400">Tabibi Admin</span>
          </div>
          <p className="text-xs text-gray-300 font-medium">
            &copy; 2026 Tabibi Healthcare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home
