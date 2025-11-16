// Theme Utility Functions 

/**
 
 * Usage: setTheme('blue') or setTheme('green') etc.
 */
export const setTheme = (themeName) => {
  document.documentElement.setAttribute('data-theme', themeName)
  localStorage.setItem('demo-theme', themeName)
}

/**
 * Get current theme
 */
export const getCurrentTheme = () => {
  return document.documentElement.getAttribute('data-theme') || 'blue'
}

/**
 * Available demo themes for quick switching
 */
export const DEMO_THEMES = {
  blue: {
    name: 'Blue Ocean',
    primary: '#3b82f6',
    description: 'Professional blue theme'
  },
  green: {
    name: 'Forest Green',
    primary: '#22c55e',
    description: 'Nature-inspired green theme'
  },
  purple: {
    name: 'Royal Purple',
    primary: '#a855f7',
    description: 'Creative purple theme'
  },
  orange: {
    name: 'Sunset Orange',
    primary: '#f97316',
    description: 'Energetic orange theme'
  },
  pink: {
    name: 'Cherry Blossom',
    primary: '#ec4899',
    description: 'Elegant pink theme'
  }
}

/**
 * Apply mood-based styling
 */
export const setMood = (moodName) => {
  // Remove existing mood classes
  document.body.classList.remove(
    'mood-excited', 'mood-focused', 'mood-creative', 
    'mood-tired', 'mood-frustrated', 'mood-productive'
  )
  
  // Add new mood class
  if (moodName && moodName !== 'neutral') {
    document.body.classList.add(`mood-${moodName}`)
  }
  
  localStorage.setItem('demo-mood', moodName)
}

/**
 * Available moods for demonstration
 */
export const DEMO_MOODS = {
  excited: {
    name: 'Excited',
    description: 'High energy, pulsing animations',
    animation: 'animate-excited-pulse'
  },
  focused: {
    name: 'Focused',
    description: 'Steady, concentrated feel',
    animation: 'animate-focused-steady'
  },
  creative: {
    name: 'Creative',
    description: 'Flowing, inspirational vibes',
    animation: 'animate-creative-flow'
  },
  tired: {
    name: 'Tired',
    description: 'Slow, gentle movements',
    animation: 'animate-tired-slow'
  },
  frustrated: {
    name: 'Frustrated',
    description: 'Tense, sharp movements',
    animation: 'animate-frustrated-tense'
  },
  productive: {
    name: 'Productive',
    description: 'Efficient, rhythmic feel',
    animation: 'animate-productive-efficient'
  }
}


export const demoFunctions = {
  // Change theme instantly
  switchTheme: (theme) => {
    setTheme(theme)
    console.log(`🎨 Theme changed to: ${DEMO_THEMES[theme]?.name || theme}`)
  },
  
  // Change mood instantly
  switchMood: (mood) => {
    setMood(mood)
    console.log(`😊 Mood changed to: ${DEMO_MOODS[mood]?.name || mood}`)
  },
  
  // Cycle through all themes
  cycleThemes: () => {
    const themes = Object.keys(DEMO_THEMES)
    const current = getCurrentTheme()
    const currentIndex = themes.indexOf(current)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]
    
    setTheme(nextTheme)
    console.log(`🔄 Cycled to theme: ${DEMO_THEMES[nextTheme].name}`)
  },
  
  // Reset to default
  resetToDefault: () => {
    setTheme('blue')
    setMood('neutral')
    console.log('🔄 Reset to default theme and mood')
  },
  
  // Show all available options
  showOptions: () => {
    console.log('🎨 Available Themes:', Object.keys(DEMO_THEMES))
    console.log('😊 Available Moods:', Object.keys(DEMO_MOODS))
    console.log('💡 Usage: demoFunctions.switchTheme("green") or demoFunctions.switchMood("excited")')
  }
}

/**
 * Initialize theme system
 */
export const initializeTheme = () => {
  // Load saved theme
  const savedTheme = localStorage.getItem('demo-theme') || 'blue'
  const savedMood = localStorage.getItem('demo-mood') || 'neutral'
  
  setTheme(savedTheme)
  setMood(savedMood)
  
  // Make demo functions globally available for easy access in browser console
  if (typeof window !== 'undefined') {
    window.demoFunctions = demoFunctions
    console.log('🚀 Demo functions loaded! Type "demoFunctions.showOptions()" to see available commands.')
  }
}

/**
 * Tailwind class generators for dynamic styling
 */
export const getTailwindClasses = {
  // Get button classes based on current theme
  primaryButton: () => {
    const theme = getCurrentTheme()
    return `bg-${theme}-600 hover:bg-${theme}-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-${theme}-500 focus:ring-offset-2`
  },
  
  // Get card classes with theme colors
  card: () => {
    return 'bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200'
  },
  
  // Get input classes with theme colors
  input: () => {
    const theme = getCurrentTheme()
    return `w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${theme}-500 focus:border-transparent transition-all duration-200`
  }
}
