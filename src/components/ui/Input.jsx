import React, { forwardRef } from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  success,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  
  // Base input classes
  const baseClasses = 'border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed'
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }
  
  // State classes
  const stateClasses = error 
    ? 'border-error-300 focus:border-error-500 focus:ring-error-500' 
    : success 
    ? 'border-success-300 focus:border-success-500 focus:ring-success-500'
    : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : ''
  
  // Icon classes
  const iconClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''
  
  // Combine all classes
  const inputClasses = `${baseClasses} ${sizeClasses[size]} ${stateClasses} ${widthClasses} ${iconClasses} ${className}`.trim()
  
  // Input type handling
  const inputType = type === 'password' && showPassword ? 'text' : type
  
  // Icon rendering
  const renderIcon = () => {
    if (icon) {
      return (
        <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0' : 'right-0'} flex items-center ${iconPosition === 'left' ? 'pl-3' : 'pr-3'}`}>
          {icon}
        </div>
      )
    }
    return null
  }
  
  // Password toggle
  const renderPasswordToggle = () => {
    if (type === 'password') {
      return (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-secondary-400 hover:text-secondary-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )
    }
    return null
  }
  
  // Status icon
  const renderStatusIcon = () => {
    if (error) {
      return <AlertCircle className="w-4 h-4 text-error-500" />
    }
    if (success) {
      return <CheckCircle className="w-4 h-4 text-success-500" />
    }
    return null
  }
  
  // Status message
  const renderStatusMessage = () => {
    if (error) {
      return <p className="mt-1 text-sm text-error-600">{error}</p>
    }
    if (success) {
      return <p className="mt-1 text-sm text-success-600">{success}</p>
    }
    return null
  }
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {renderIcon()}
        
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false)
            onBlur?.(e)
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        
        {renderPasswordToggle()}
        
        {renderStatusIcon() && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {renderStatusIcon()}
          </div>
        )}
      </div>
      
      {renderStatusMessage()}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
