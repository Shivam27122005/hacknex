import React from 'react'

const Card = ({
  children,
  variant = 'default',
  padding = 'default',
  shadow = 'default',
  border = true,
  hover = false,
  className = '',
  ...props
}) => {
  // Base card classes
  const baseClasses = 'bg-white rounded-xl transition-all duration-200'
  
  // Variant classes
  const variantClasses = {
    default: '',
    elevated: 'bg-gradient-to-br from-white to-secondary-50',
    outlined: 'border-2 border-secondary-200',
    filled: 'bg-secondary-50'
  }
  
  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }
  
  // Shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    default: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  }
  
  // Border classes
  const borderClasses = border ? 'border border-secondary-200' : ''
  
  // Hover classes
  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''
  
  // Combine all classes
  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${borderClasses} ${hoverClasses} ${className}`.trim()
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  )
}

// Card Header Component
const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

// Card Title Component
const CardTitle = ({ children, size = 'lg', className = '', ...props }) => {
  const sizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-xl font-semibold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold'
  }
  
  return (
    <h3 className={`text-secondary-900 ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </h3>
  )
}

// Card Subtitle Component
const CardSubtitle = ({ children, className = '', ...props }) => {
  return (
    <p className={`text-secondary-600 mt-1 ${className}`} {...props}>
      {children}
    </p>
  )
}

// Card Content Component
const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

// Card Footer Component
const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`mt-6 pt-4 border-t border-secondary-200 ${className}`} {...props}>
      {children}
    </div>
  )
}

// Card Actions Component
const CardActions = ({ children, className = '', ...props }) => {
  return (
    <div className={`flex items-center justify-end space-x-2 ${className}`} {...props}>
      {children}
    </div>
  )
}

// Card Badge Component
const CardBadge = ({ children, variant = 'default', className = '', ...props }) => {
  const variantClasses = {
    default: 'bg-secondary-100 text-secondary-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800'
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
}

// Card Image Component
const CardImage = ({ src, alt, className = '', ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-48 object-cover rounded-t-xl ${className}`}
      {...props}
    />
  )
}

// Card Stats Component
const CardStats = ({ stats, className = '', ...props }) => {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`} {...props}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-2xl font-bold text-secondary-900">{stat.value}</div>
          <div className="text-sm text-secondary-600">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

// Export all components
export {
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardContent,
  CardFooter,
  CardActions,
  CardBadge,
  CardImage,
  CardStats
}
