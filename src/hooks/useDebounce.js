import { useState, useEffect } from 'react'

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
