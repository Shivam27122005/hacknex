import React, { createContext, useContext, useState, useEffect } from 'react'

const MoodContext = createContext()

export const useMood = () => {
  const context = useContext(MoodContext)
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider')
  }
  return context
}

export const MoodProvider = ({ children }) => {
  const [currentMood, setCurrentMood] = useState('neutral')
  const [moodHistory, setMoodHistory] = useState([])

  // Mood configurations with colors and effects
  const moods = {
    excited: {
      name: 'Excited',
      emoji: '🚀',
      colors: {
        primary: '#ff6b6b',
        secondary: '#ffa726',
        accent: '#ff8a65',
        bg: 'rgba(255, 107, 107, 0.03)',
        overlay: 'rgba(255, 107, 107, 0.08)'
      },
      effects: {
        filter: 'hue-rotate(10deg) saturate(1.4) brightness(1.1)',
        animation: 'pulse',
        gradient: 'linear-gradient(135deg, #ff6b6b, #ffa726)'
      },
      focusMode: 'energized',
      description: 'High energy and enthusiasm'
    },
    focused: {
      name: 'Focused',
      emoji: '🎯',
      colors: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa',
        bg: 'rgba(59, 130, 246, 0.03)',
        overlay: 'rgba(59, 130, 246, 0.06)'
      },
      effects: {
        filter: 'hue-rotate(0deg) saturate(1.1) brightness(1.02)',
        animation: 'steady',
        gradient: 'linear-gradient(135deg, #3b82f6, #1e40af)'
      },
      focusMode: 'focused',
      description: 'Deep concentration mode'
    },
    creative: {
      name: 'Creative',
      emoji: '🎨',
      colors: {
        primary: '#a855f7',
        secondary: '#7c3aed',
        accent: '#c084fc',
        bg: 'rgba(168, 85, 247, 0.03)',
        overlay: 'rgba(168, 85, 247, 0.07)'
      },
      effects: {
        filter: 'hue-rotate(15deg) saturate(1.3) brightness(1.05)',
        animation: 'flow',
        gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)'
      },
      focusMode: 'creative',
      description: 'Imaginative and innovative thinking'
    },
    tired: {
      name: 'Tired',
      emoji: '😴',
      colors: {
        primary: '#64748b',
        secondary: '#475569',
        accent: '#94a3b8',
        bg: 'rgba(100, 116, 139, 0.02)',
        overlay: 'rgba(100, 116, 139, 0.05)'
      },
      effects: {
        filter: 'hue-rotate(-5deg) saturate(0.7) brightness(0.9)',
        animation: 'slow',
        gradient: 'linear-gradient(135deg, #64748b, #475569)'
      },
      focusMode: 'calm',
      description: 'Low energy, need rest'
    },
    frustrated: {
      name: 'Frustrated',
      emoji: '😤',
      colors: {
        primary: '#ef4444',
        secondary: '#dc2626',
        accent: '#f87171',
        bg: 'rgba(239, 68, 68, 0.02)',
        overlay: 'rgba(239, 68, 68, 0.06)'
      },
      effects: {
        filter: 'hue-rotate(-10deg) saturate(1.2) brightness(0.95)',
        animation: 'tense',
        gradient: 'linear-gradient(135deg, #ef4444, #dc2626)'
      },
      focusMode: 'night',
      description: 'Dealing with challenges'
    },
    productive: {
      name: 'Productive',
      emoji: '⚡',
      colors: {
        primary: '#10b981',
        secondary: '#059669',
        accent: '#34d399',
        bg: 'rgba(16, 185, 129, 0.03)',
        overlay: 'rgba(16, 185, 129, 0.06)'
      },
      effects: {
        filter: 'hue-rotate(5deg) saturate(1.2) brightness(1.05)',
        animation: 'efficient',
        gradient: 'linear-gradient(135deg, #10b981, #059669)'
      },
      focusMode: 'focused',
      description: 'Getting things done efficiently'
    },
    neutral: {
      name: 'Neutral',
      emoji: '😐',
      colors: {
        primary: '#6b7280',
        secondary: '#4b5563',
        accent: '#9ca3af',
        bg: 'transparent',
        overlay: 'transparent'
      },
      effects: {
        filter: 'none',
        animation: 'none',
        gradient: 'linear-gradient(135deg, #6b7280, #4b5563)'
      },
      focusMode: 'normal',
      description: 'Balanced state'
    }
  }

  // Apply mood effects to the interface (simplified to prevent blocking)
  const applyMoodEffects = (mood) => {
    try {
      const moodConfig = moods[mood]
      if (!moodConfig || !document.documentElement) return

      const root = document.documentElement
      
      // Apply mood colors as CSS custom properties
      root.style.setProperty('--mood-primary', moodConfig.colors.primary)
      root.style.setProperty('--mood-secondary', moodConfig.colors.secondary)
      root.style.setProperty('--mood-accent', moodConfig.colors.accent)
      root.style.setProperty('--mood-bg', moodConfig.colors.bg)
      root.style.setProperty('--mood-gradient', moodConfig.effects.gradient)

      // Update document title with mood indicator
      const originalTitle = 'HacknHex - Competitive Programming Platform'
      if (mood !== 'neutral') {
        document.title = `${moodConfig.emoji} ${originalTitle}`
      } else {
        document.title = originalTitle
      }
    } catch (error) {
      console.warn('Error applying mood effects:', error)
    }
  }

  // Change mood and sync with focus mode
  const changeMood = (mood) => {
    const moodConfig = moods[mood]
    if (!moodConfig) return

    setCurrentMood(mood)
    
    // Add to mood history
    const timestamp = new Date().toISOString()
    const newHistory = [...moodHistory.slice(-9), { mood, timestamp }]
    setMoodHistory(newHistory)
    
    // Apply visual effects
    applyMoodEffects(mood)
    
    // Note: Focus mode sync can be added later if needed
    
    // Save to localStorage
    localStorage.setItem('currentMood', mood)
    localStorage.setItem('moodHistory', JSON.stringify(newHistory))
  }

  // Get mood suggestions based on time of day
  const getMoodSuggestions = () => {
    const hour = new Date().getHours()
    
    if (hour >= 6 && hour < 10) {
      return ['excited', 'productive', 'focused']
    } else if (hour >= 10 && hour < 14) {
      return ['focused', 'productive', 'creative']
    } else if (hour >= 14 && hour < 18) {
      return ['creative', 'productive', 'focused']
    } else if (hour >= 18 && hour < 22) {
      return ['tired', 'creative', 'productive']
    } else {
      return ['tired', 'frustrated', 'focused']
    }
  }

  // Load saved mood on mount
  useEffect(() => {
    const loadMoodData = () => {
      try {
        const savedMood = localStorage.getItem('currentMood')
        const savedHistory = localStorage.getItem('moodHistory')
        
        if (savedMood && moods[savedMood]) {
          setCurrentMood(savedMood)
          // Apply effects after DOM is ready
          setTimeout(() => {
            if (document.readyState === 'complete') {
              applyMoodEffects(savedMood)
            }
          }, 500)
        }
        
        if (savedHistory) {
          try {
            setMoodHistory(JSON.parse(savedHistory))
          } catch (e) {
            console.warn('Failed to parse mood history')
          }
        }
      } catch (error) {
        console.warn('Error loading mood data:', error)
      }
    }

    // Delay mood loading to prevent blocking app startup
    const timer = setTimeout(loadMoodData, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const overlay = document.getElementById('mood-overlay')
      if (overlay) overlay.remove()
      
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.style.filter = 'none'
      }
    }
  }, [])

  const value = {
    currentMood,
    moods,
    moodHistory,
    changeMood,
    getMoodSuggestions,
    applyMoodEffects
  }

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  )
}
