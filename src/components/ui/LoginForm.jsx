import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Code,
  Github,
  Twitter,
  Globe,
  AlertCircle
} from 'lucide-react'

// === REUSABLE UI COMPONENTS ===

// Social login button component
const SocialButton = ({ onClick, icon, label, className = "" }) => (
  <button
    onClick={onClick}
    className={`btn-secondary w-full justify-center ${className}`}
    aria-label={label}
  >
    {icon}
  </button>
)

// Input field with icon component
const InputField = ({ 
  id, 
  name, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  icon: Icon, 
  error, 
  rightIcon: RightIcon,
  onRightIconClick,
  autoComplete,
  required = false
}) => (
  <div className="form-group">
    <label htmlFor={id} className="form-label">
      {placeholder}
    </label>
    <div className="input-with-icon">
      {Icon && <Icon className="input-icon-left" />}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`form-input ${Icon ? 'input-with-left-icon' : ''} ${RightIcon ? 'input-with-right-icon' : ''} ${error ? 'form-input-error' : ''}`}
      />
      {RightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          className="input-icon-right hover:text-secondary-600 cursor-pointer"
          aria-label="Toggle visibility"
        >
          <RightIcon className="w-5 h-5" />
        </button>
      )}
    </div>
    {error && <p className="form-error">{error}</p>}
  </div>
)

// Alert component
const Alert = ({ type = "error", message, className = "" }) => (
  <div className={`alert alert-${type} ${className}`}>
    <div className="flex items-center">
      <AlertCircle className="w-5 h-5 mr-2" />
      <span>{message}</span>
    </div>
  </div>
)

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="spinner spinner-sm"></div>
    <span>Signing in...</span>
  </div>
)

// === MAIN LOGIN FORM COMPONENT ===
const LoginForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useUser()
  
  // Form state
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Get intended destination
  const from = location.state?.from?.pathname || '/'

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Form validation
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
      newErrors.password = 'Password must be at least 6 characters long'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrors({})
    
    try {
      const result = await login(formData)
      
      if (result.success) {
        navigate(from, { replace: true })
      } else {
        setErrors({ general: result.error || 'Login failed. Please try again.' })
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle social login
  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`)
    // Social login implementation would go here
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {/* === HEADER SECTION === */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-200">
              <Code className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold gradient-text">Hack'nhex</span>
          </Link>
          <h2 className="text-3xl font-bold text-secondary-900 mb-2">Welcome back</h2>
          <p className="text-sm text-secondary-600">Sign in to your account to continue coding</p>
        </div>

        {/* === LOGIN FORM === */}
        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* General error message */}
            {errors.general && (
              <Alert type="danger" message={errors.general} />
            )}

            {/* Email field */}
            <InputField
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              icon={Mail}
              error={errors.email}
              autoComplete="email"
              required
            />

            {/* Password field */}
            <InputField
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              icon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              error={errors.password}
              autoComplete="current-password"
              required
            />

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-base font-medium"
            >
              {isLoading ? <LoadingSpinner /> : 'Sign in'}
            </button>
          </form>

          {/* === DIVIDER === */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-secondary-500">Or continue with</span>
              </div>
            </div>
          </div>

          {/* === SOCIAL LOGIN BUTTONS === */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <SocialButton
              onClick={() => handleSocialLogin('Google')}
              icon={<Globe className="w-5 h-5" />}
              label="Sign in with Google"
            />
            <SocialButton
              onClick={() => handleSocialLogin('Github')}
              icon={<Github className="w-5 h-5" />}
              label="Sign in with Github"
            />
            <SocialButton
              onClick={() => handleSocialLogin('Twitter')}
              icon={<Twitter className="w-5 h-5" />}
              label="Sign in with Twitter"
            />
          </div>
        </div>

        {/* === SIGN UP LINK === */}
        <div className="text-center">
          <p className="text-sm text-secondary-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              Sign up for free
            </Link>
          </p>
        </div>

        {/* === FOOTER === */}
        <div className="text-center">
          <p className="text-xs text-secondary-500">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-primary-600 hover:text-primary-500 transition-colors duration-200">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary-600 hover:text-primary-500 transition-colors duration-200">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
