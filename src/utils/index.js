// Date and Time Utilities
export const formatDate = (date) => {
  if (!date) return 'N/A'
  
  const now = new Date()
  const targetDate = new Date(date)
  const diffTime = Math.abs(now - targetDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
  
  return targetDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatTime = (date) => {
  if (!date) return 'N/A'
  
  const now = new Date()
  const targetDate = new Date(date)
  const diffTime = Math.abs(now - targetDate)
  const diffMinutes = Math.ceil(diffTime / (1000 * 60))
  
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`
  if (diffMinutes < 1440) return `${Math.ceil(diffMinutes / 60)} hours ago`
  
  return formatDate(date)
}

export const formatDuration = (milliseconds) => {
  if (!milliseconds) return '0ms'
  
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  if (seconds > 0) return `${seconds}s`
  return `${milliseconds}ms`
}

// String Utilities
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const truncate = (str, length = 50) => {
  if (!str || str.length <= length) return str
  return str.substring(0, length) + '...'
}

export const slugify = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Number Utilities
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export const formatPercentage = (value, total) => {
  if (!total) return '0%'
  return Math.round((value / total) * 100) + '%'
}

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

// Array Utilities
export const shuffle = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key]
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

export const unique = (array) => {
  return [...new Set(array)]
}

export const sortBy = (array, key, order = 'asc') => {
  const sorted = [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1
    return 0
  })
  return sorted
}

// Object Utilities
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const cloned = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
}

export const pick = (obj, keys) => {
  const picked = {}
  keys.forEach(key => {
    if (obj.hasOwnProperty(key)) {
      picked[key] = obj[key]
    }
  })
  return picked
}

export const omit = (obj, keys) => {
  const omitted = { ...obj }
  keys.forEach(key => delete omitted[key])
  return omitted
}

// Validation Utilities
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPassword = (password) => {
  return password.length >= 8
}

export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

// Storage Utilities
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue
  }
}

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

export const clearLocalStorage = () => {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}

// URL Utilities
export const getQueryParams = (url) => {
  const params = new URLSearchParams(url.split('?')[1])
  const result = {}
  for (const [key, value] of params) {
    result[key] = value
  }
  return result
}

export const setQueryParams = (params) => {
  const url = new URL(window.location)
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.set(key, params[key])
    } else {
      url.searchParams.delete(key)
    }
  })
  return url.toString()
}

// Color Utilities
export const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#FFFFFF'
}

export const lightenColor = (hexColor, percent) => {
  const num = parseInt(hexColor.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
}

// Error Handling
export const handleError = (error, fallback = 'An error occurred') => {
  console.error('Error:', error)
  if (error.response?.data?.message) return error.response.data.message
  if (error.message) return error.message
  return fallback
}

// Debounce Utility
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle Utility
export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Random Utilities
export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const randomFloat = (min, max) => {
  return Math.random() * (max - min) + min
}

export const randomChoice = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

// Performance Utilities
export const measureTime = async (fn, name = 'Function') => {
  const start = performance.now()
  const result = await fn()
  const end = performance.now()
  console.log(`${name} took ${(end - start).toFixed(2)}ms`)
  return result
}

// Browser Utilities
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export const isTablet = () => {
  return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768
}

export const isDesktop = () => {
  return !isMobile() && !isTablet()
}

export const getViewportSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

// Copy to Clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy text:', error)
    return false
  }
}

// Download File
export const downloadFile = (content, filename, contentType = 'text/plain') => {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
