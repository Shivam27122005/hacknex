import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { Mail, ArrowLeft, Code } from 'lucide-react'

const ForgotPassword = () => {
  const { resetPassword } = useUser()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = () => {
    if (!email) {
      setError('Email is required')
      return false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateEmail()) return

    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      const result = await resetPassword(email)
      
      if (result.success) {
        setSuccess(true)
        setEmail('')
      } else {
        setError(result.error || 'Failed to send reset email')
      }
    } catch (err) {
      console.error('Reset password error:', err)
      setError('An unexpected error occurred. Please try again.')
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
          <h2 className="text-3xl font-bold text-white">Reset your password</h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 backdrop-blur-sm">
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                Password reset instructions have been sent to your email. Please check your inbox and follow the link to reset your password.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError('')
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 transition-all ${
                    error ? 'border-red-400' : 'border-slate-600'
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </div>
              ) : success ? (
                'Email Sent!'
              ) : (
                'Send Reset Instructions'
              )}
            </button>
          </form>
        </div>

        {/* Back to Login Link */}
        <div className="text-center">
          <Link to="/login" className="inline-flex items-center space-x-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
