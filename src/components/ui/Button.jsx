import React from 'react'
import { Loader2 } from 'lucide-react'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  asChild = false,
  ...props
}) => {
  // Base button classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-secondary-200 hover:bg-secondary-300 text-secondary-800 focus:ring-secondary-500',
    success: 'bg-success-600 hover:bg-success-700 text-white focus:ring-success-500',
    warning: 'bg-warning-600 hover:bg-warning-700 text-white focus:ring-warning-500',
    error: 'bg-error-600 hover:bg-error-700 text-white focus:ring-error-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    link: 'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline focus:ring-primary-500'
  }
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : ''
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`.trim()
  
  // Icon rendering
  const renderIcon = () => {
    if (loading) {
      return <Loader2 className="animate-spin" />
    }
    if (icon) {
      return icon
    }
    return null
  }
  
  // Content rendering
  const renderContent = () => {
    if (icon && !loading) {
      if (iconPosition === 'left') {
        return (
          <>
            {icon}
            <span className="ml-2">{children}</span>
          </>
        )
      } else {
        return (
          <>
            <span className="mr-2">{children}</span>
            {icon}
          </>
        )
      }
    }
    return children
  }
  
  // If asChild is true, clone the child with our classes
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: buttonClasses,
      disabled: disabled || loading,
      ...props
    })
  }
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {renderIcon()}
      {renderContent()}
    </button>
  )
}

export default Button
