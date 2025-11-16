import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')
  const [fontSize, setFontSize] = useState(14)
  const [tabSize, setTabSize] = useState(2)
  const [keyBinding, setKeyBinding] = useState('default')
  const [autosave, setAutosave] = useState(true)
  const [focusMode, setFocusMode] = useState('normal')
  const [currentMood, setCurrentMood] = useState('neutral')

  // Mood configurations with theme integration
  const moods = {
    neutral: {
      name: 'Neutral',
      emoji: '😐',
      colors: { primary: '#6b7280', secondary: '#9ca3af', accent: '#d1d5db' },
      focusMode: 'normal',
      theme: theme // Respects current theme
    },
    excited: {
      name: 'Excited',
      emoji: '🚀',
      colors: { primary: '#ff6b6b', secondary: '#ffa726', accent: '#ff8a65' },
      focusMode: 'energized',
      theme: 'light' // Force light for energy
    },
    productive: {
      name: 'Productive',
      emoji: '💪',
      colors: { primary: '#4caf50', secondary: '#66bb6a', accent: '#81c784' },
      focusMode: 'focused',
      theme: theme // Respects current theme
    },
    focused: {
      name: 'Focused',
      emoji: '🎯',
      colors: { primary: '#2196f3', secondary: '#42a5f5', accent: '#64b5f6' },
      focusMode: 'focused',
      theme: theme // Respects current theme
    },
    creative: {
      name: 'Creative',
      emoji: '🎨',
      colors: { primary: '#9c27b0', secondary: '#ba68c8', accent: '#ce93d8' },
      focusMode: 'creative',
      theme: 'light' // Better for creativity
    },
    tired: {
      name: 'Tired',
      emoji: '😴',
      colors: { primary: '#607d8b', secondary: '#78909c', accent: '#90a4ae' },
      focusMode: 'calm',
      theme: 'dark' // Easier on eyes
    },
    frustrated: {
      name: 'Frustrated',
      emoji: '😤',
      colors: { primary: '#f44336', secondary: '#ef5350', accent: '#e57373' },
      focusMode: 'normal',
      theme: 'dark' // Calming dark theme
    }
  }

  // Focus mode color tones
  const focusModes = {
    normal: { bg: '', accent: '', overlay: '', description: 'Default appearance' },
    focused: { 
      bg: 'rgba(59, 130, 246, 0.02)', 
      accent: '#3b82f6', 
      overlay: 'rgba(59, 130, 246, 0.05)',
      filter: 'hue-rotate(0deg) saturate(1.1)',
      description: 'Enhanced focus with blue tones'
    },
    creative: { 
      bg: 'rgba(147, 51, 234, 0.02)', 
      accent: '#9333ea', 
      overlay: 'rgba(147, 51, 234, 0.05)',
      filter: 'hue-rotate(15deg) saturate(1.2)',
      description: 'Creative purple ambiance'
    },
    energized: { 
      bg: 'rgba(245, 158, 11, 0.02)', 
      accent: '#f59e0b', 
      overlay: 'rgba(245, 158, 11, 0.05)',
      filter: 'hue-rotate(-10deg) saturate(1.3) brightness(1.05)',
      description: 'Energizing orange glow'
    },
    calm: { 
      bg: 'rgba(34, 197, 94, 0.02)', 
      accent: '#22c55e', 
      overlay: 'rgba(34, 197, 94, 0.05)',
      filter: 'hue-rotate(5deg) saturate(0.9) brightness(0.98)',
      description: 'Calming green environment'
    },
    night: { 
      bg: 'rgba(99, 102, 241, 0.02)', 
      accent: '#6366f1', 
      overlay: 'rgba(99, 102, 241, 0.05)',
      filter: 'hue-rotate(-5deg) saturate(0.8) brightness(0.95)',
      description: 'Night mode with purple tint'
    }
  }

  // Change mood and integrate with theme
  const changeMood = (mood) => {
    const moodConfig = moods[mood]
    if (!moodConfig) return

    setCurrentMood(mood)
    
    // Auto-switch theme based on mood (forced to light)
    if (theme !== 'light') {
      setTheme('light')
    }
    
    // Auto-switch focus mode based on mood
    if (moodConfig.focusMode !== focusMode) {
      setFocusMode(moodConfig.focusMode)
    }
    
    // Apply mood colors to CSS variables
    const root = document.documentElement
    root.style.setProperty('--mood-primary', moodConfig.colors.primary)
    root.style.setProperty('--mood-secondary', moodConfig.colors.secondary)
    root.style.setProperty('--mood-accent', moodConfig.colors.accent)
    
    // Save to localStorage
    localStorage.setItem('currentMood', mood)
  }

  // Apply theme and focus mode to document
  useEffect(() => {
    const root = document.documentElement
    const currentFocusMode = focusModes[focusMode]
    const currentMoodConfig = moods[currentMood]
    
    // Force light theme always
    root.classList.remove('dark')
    root.setAttribute('data-theme', 'light')
    document.body.style.backgroundColor = currentMoodConfig?.colors.primary ? 
      `color-mix(in srgb, ${currentMoodConfig.colors.primary} 3%, #ffffff)` : '#ffffff'
    document.body.style.color = '#1e293b'

    // Apply focus mode color tone
    if (currentFocusMode && focusMode !== 'normal') {
      // Create overlay element if it doesn't exist
      let overlay = document.getElementById('focus-overlay')
      if (!overlay) {
        overlay = document.createElement('div')
        overlay.id = 'focus-overlay'
        overlay.style.position = 'fixed'
        overlay.style.top = '0'
        overlay.style.left = '0'
        overlay.style.width = '100%'
        overlay.style.height = '100%'
        overlay.style.pointerEvents = 'none'
        overlay.style.zIndex = '1'
        overlay.style.transition = 'all 0.5s ease'
        document.body.appendChild(overlay)
      }
      
      overlay.style.backgroundColor = currentFocusMode.overlay
      overlay.style.mixBlendMode = 'multiply'
      
      // Apply filter to main content
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.style.filter = currentFocusMode.filter
        mainContent.style.transition = 'filter 0.5s ease'
      }

      // Set CSS custom properties for dynamic theming
      root.style.setProperty('--focus-accent', currentFocusMode.accent)
      root.style.setProperty('--focus-bg', currentFocusMode.bg)
    } else {
      // Remove focus mode effects
      const overlay = document.getElementById('focus-overlay')
      if (overlay) {
        overlay.remove()
      }
      
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.style.filter = 'none'
      }
      
      root.style.removeProperty('--focus-accent')
      root.style.removeProperty('--focus-bg')
    }

    // Save to localStorage
    localStorage.setItem('theme', 'light')
    localStorage.setItem('fontSize', fontSize.toString())
    localStorage.setItem('tabSize', tabSize.toString())
    localStorage.setItem('keyBinding', keyBinding)
    localStorage.setItem('autosave', autosave.toString())
    localStorage.setItem('focusMode', focusMode)
  }, [theme, fontSize, tabSize, keyBinding, autosave, focusMode, currentMood])

  // Load from localStorage on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize')
    const savedTabSize = localStorage.getItem('tabSize')
    const savedKeyBinding = localStorage.getItem('keyBinding')
    const savedAutosave = localStorage.getItem('autosave')
    const savedFocusMode = localStorage.getItem('focusMode')
    const savedMood = localStorage.getItem('currentMood')

    setTheme('light')
    if (savedFontSize) setFontSize(parseInt(savedFontSize))
    if (savedTabSize) setTabSize(parseInt(savedTabSize))
    if (savedKeyBinding) setKeyBinding(savedKeyBinding)
    if (savedAutosave) setAutosave(savedAutosave === 'true')
    if (savedFocusMode) setFocusMode(savedFocusMode)
    if (savedMood && moods[savedMood]) {
      setCurrentMood(savedMood)
      // Apply mood effects after DOM is ready
      setTimeout(() => changeMood(savedMood), 100)
    }
  }, [])

  const toggleTheme = () => {
    setTheme('light')
  }

  const updateEditorSettings = (settings) => {
    if (settings.theme !== undefined) setTheme('light')
    if (settings.fontSize !== undefined) setFontSize(settings.fontSize)
    if (settings.tabSize !== undefined) setTabSize(settings.tabSize)
    if (settings.keyBinding !== undefined) setKeyBinding(settings.keyBinding)
    if (settings.autosave !== undefined) setAutosave(settings.autosave)
    if (settings.focusMode !== undefined) setFocusMode(settings.focusMode)
    if (settings.mood !== undefined) changeMood(settings.mood)
  }

  const value = {
    theme,
    fontSize,
    tabSize,
    keyBinding,
    autosave,
    focusMode,
    focusModes,
    currentMood,
    moods,
    setTheme,
    setFontSize,
    setTabSize,
    setKeyBinding,
    setAutosave,
    setFocusMode,
    changeMood,
    toggleTheme,
    updateEditorSettings
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
