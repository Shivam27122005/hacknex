import React, { useState, useEffect } from 'react'
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Coffee, 
  Flame,
  Award,
  Sparkles,
  X
} from 'lucide-react'

const CelebrationPopup = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)

  const achievementTypes = {
    'first-run': { 
      icon: Zap, 
      title: 'First Run!', 
      message: 'Your code executed successfully!',
      color: 'from-blue-500 to-purple-600',
      emoji: '🚀'
    },
    'bug-fixed': { 
      icon: Target, 
      title: 'Bug Squashed!', 
      message: 'Another bug bites the dust!',
      color: 'from-green-500 to-emerald-600',
      emoji: '🐛➡️💀'
    },
    'streak-5': { 
      icon: Flame, 
      title: '5-Day Streak!', 
      message: 'You\'re on fire! Keep coding!',
      color: 'from-orange-500 to-red-600',
      emoji: '🔥'
    },
    'milestone-10': { 
      icon: Trophy, 
      title: '10 Projects!', 
      message: 'Double digits! You\'re unstoppable!',
      color: 'from-yellow-500 to-orange-600',
      emoji: '🏆'
    },
    'late-night': { 
      icon: Coffee, 
      title: 'Night Owl!', 
      message: 'Coding past midnight? Dedication!',
      color: 'from-indigo-500 to-purple-600',
      emoji: '🦉'
    },
    'clean-code': { 
      icon: Sparkles, 
      title: 'Clean Code!', 
      message: 'Beautiful code structure detected!',
      color: 'from-pink-500 to-rose-600',
      emoji: '✨'
    }
  }

  const achievementData = achievementTypes[achievement?.type] || achievementTypes['first-run']

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`bg-gradient-to-r ${achievementData.color} rounded-lg shadow-lg text-white p-6 max-w-sm relative overflow-hidden`}>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 opacity-20">
          <achievementData.icon className="w-24 h-24 transform rotate-12" />
        </div>
        
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="absolute top-2 right-2 text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <achievementData.icon className="w-6 h-6" />
            <h3 className="font-bold text-lg">{achievementData.title}</h3>
            <span className="text-xl">{achievementData.emoji}</span>
          </div>
          <p className="text-white text-opacity-90">{achievementData.message}</p>
          
          {achievement.details && (
            <p className="text-sm text-white text-opacity-75 mt-2">{achievement.details}</p>
          )}
        </div>

        {/* Animated sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 2) * 60}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            >
              <Star className="w-2 h-2 text-white opacity-60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Hook to manage celebrations
export const useCelebrations = () => {
  const [currentCelebration, setCurrentCelebration] = useState(null)

  const celebrate = (type, details = '') => {
    setCurrentCelebration({ type, details })
  }

  const closeCelebration = () => {
    setCurrentCelebration(null)
  }

  return {
    currentCelebration,
    celebrate,
    closeCelebration,
    CelebrationComponent: () => (
      <CelebrationPopup 
        achievement={currentCelebration} 
        onClose={closeCelebration} 
      />
    )
  }
}

export default CelebrationPopup
