
import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Code
} from 'lucide-react'

// Social login button
function SocialButton({ onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className="w-full inline-flex justify-center  py-2 px-4 border border-secondary-300 rounded-lg shadow-sm bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50 transition-colors"
      aria-label={label}
    >
      {icon}
    </button>
  )
}

// Email input field
function EmailField({ value, onChange, error }) {
  return (
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
        Email address
      </label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${error ? 'border-danger-300' : 'border-secondary-300'}`}
          placeholder="Enter your email"
        />
      </div>
      {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
    </div>
  )
}

// Password input field
function PasswordField({ value, onChange, error, show, onToggle }) {
  return (
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
        Password
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
        <input
          id="password"
          name="password"
          type={show ? 'text' : 'password'}
          autoComplete="current-password"
          required
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${error ? 'border-danger-300' : 'border-secondary-300'}`}
          placeholder="Enter your password"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
          aria-label="Toggle password visibility"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
    </div>
  )
}

// Main login page component
const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useUser()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Get the intended destination or default to dashboard
  const from = location.state?.from?.pathname || '/'

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Enhanced validation with more comprehensive checks
  const validateForm = () => {
    const newErrors = {}
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrors({})
    
    try {
      console.log('Attempting login with:', formData.email)
      
      const { success, error } = await login(formData)
      
      if (error) {
        console.error('Login error:', error)
        // Show user-friendly error message
        setErrors({ general: error })
      } else if (success) {
        // Login successful, redirect to intended page or dashboard
        navigate(from, { replace: true })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle social login with Supabase
  const handleSocialLogin = async (provider) => {
    try {
      setIsLoading(true)
      setErrors({})
      
      const providers = {
        'GitHub': 'github',
        'Google': 'google',
        'Twitter': 'twitter'
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: providers[provider],
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })
      
      if (error) throw error
      
    } catch (error) {
      console.error(`${provider} login error:`, error)
      setErrors({ 
        general: `Failed to sign in with ${provider}. Please try again.` 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Code className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">Hack'nhex</span>
          </Link>
          <h2 className="text-3xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">Sign in to your account to continue coding</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 backdrop-blur-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* General error message */}
            {errors.general && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-sm text-red-400 font-medium">{errors.general}</p>
              </div>
            )}
            <EmailField value={formData.email} onChange={handleChange} error={errors.email} />
            <PasswordField value={formData.password} onChange={handleChange} error={errors.password} show={showPassword} onToggle={() => setShowPassword(s => !s)} />
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-900/50" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">Remember me</label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">Forgot your password?</Link>
              </div>
            </div>
            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : 'Sign in'}
            </button>
          </form>
        </div>
        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
