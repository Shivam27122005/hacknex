import React, { useState, useEffect } from 'react'
import { 
  Smile, 
  Meh, 
  Frown, 
  Zap, 
  Coffee, 
  Brain,
  Target,
  TrendingUp,
  Calendar
} from 'lucide-react'

const DevMoodTracker = () => {
  const [currentMood, setCurrentMood] = useState('focused')
  const [moodHistory, setMoodHistory] = useState([])
  const [showMoodSelector, setShowMoodSelector] = useState(false)

  const moods = [
    { id: 'excited', label: 'Excited', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { id: 'focused', label: 'Focused', icon: Target, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'creative', label: 'Creative', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'tired', label: 'Tired', icon: Coffee, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'frustrated', label: 'Frustrated', icon: Frown, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'productive', label: 'Productive', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' }
  ]

  const getCurrentMoodData = () => moods.find(mood => mood.id === currentMood)

  const handleMoodChange = (moodId) => {
    setCurrentMood(moodId)
    setMoodHistory(prev => [...prev, { mood: moodId, timestamp: new Date() }])
    setShowMoodSelector(false)
    
    // Save to localStorage
    localStorage.setItem('devMood', moodId)
    localStorage.setItem('moodHistory', JSON.stringify([...moodHistory, { mood: moodId, timestamp: new Date() }]))
  }

  useEffect(() => {
    const savedMood = localStorage.getItem('devMood')
    const savedHistory = localStorage.getItem('moodHistory')
    
    if (savedMood) setCurrentMood(savedMood)
    if (savedHistory) setMoodHistory(JSON.parse(savedHistory))
  }, [])

  const currentMoodData = getCurrentMoodData()

  return (
    <div className="relative">
      <button
        onClick={() => setShowMoodSelector(!showMoodSelector)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all hover:scale-105 ${currentMoodData.bg} border border-gray-200`}
      >
        <currentMoodData.icon className={`w-4 h-4 ${currentMoodData.color}`} />
        <span className="text-sm font-medium text-gray-700">
          {currentMoodData.label}
        </span>
      </button>

      {showMoodSelector && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-64">
          <h3 className="text-sm font-medium text-gray-900 mb-3">How are you feeling?</h3>
          <div className="grid grid-cols-2 gap-2">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodChange(mood.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-50 ${
                  currentMood === mood.id ? mood.bg : ''
                }`}
              >
                <mood.icon className={`w-4 h-4 ${mood.color}`} />
                <span className="text-sm text-gray-700">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DevMoodTracker
