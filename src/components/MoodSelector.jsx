import React, { useState } from 'react'
import { useMood } from '../context/MoodContext'
import { Heart, Sparkles, X, Clock, TrendingUp } from 'lucide-react'

const MoodSelector = () => {
  const { currentMood, moods, moodHistory, changeMood, getMoodSuggestions } = useMood()
  const [isOpen, setIsOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const currentMoodConfig = moods[currentMood]
  const suggestions = getMoodSuggestions()

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleMoodChange = (mood) => {
    changeMood(mood)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Mood Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-sm border-2`}
        style={{
          background: currentMoodConfig.effects.gradient,
          borderColor: currentMoodConfig.colors.primary,
          color: 'white'
        }}
        title={`Current mood: ${currentMoodConfig.name}`}
      >
        <Heart className="w-4 h-4" />
        <span className="text-lg">{currentMoodConfig.emoji}</span>
        <span className="text-sm font-medium hidden sm:block">
          {currentMoodConfig.name}
        </span>
      </button>

      {/* Mood Selection Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50 min-w-96">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
              How are you feeling?
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Mood Display */}
          <div className="mb-6 p-4 rounded-lg border-2" style={{ borderColor: currentMoodConfig.colors.primary, backgroundColor: currentMoodConfig.colors.bg }}>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{currentMoodConfig.emoji}</span>
              <div>
                <p className="font-medium text-gray-900">{currentMoodConfig.name}</p>
                <p className="text-sm text-gray-600">{currentMoodConfig.description}</p>
              </div>
            </div>
          </div>

          {/* Time-based Suggestions */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Suggested for now:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(moodKey => {
                const mood = moods[moodKey]
                return (
                  <button
                    key={moodKey}
                    onClick={() => handleMoodChange(moodKey)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all hover:scale-105"
                    style={{
                      borderColor: mood.colors.primary,
                      backgroundColor: currentMood === moodKey ? mood.colors.bg : 'transparent'
                    }}
                  >
                    <span>{mood.emoji}</span>
                    <span className="text-sm font-medium">{mood.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* All Moods Grid */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">All moods:</p>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(moods).filter(([key]) => key !== 'neutral').map(([moodKey, mood]) => (
                <button
                  key={moodKey}
                  onClick={() => handleMoodChange(moodKey)}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    currentMood === moodKey ? 'ring-2 ring-offset-2' : ''
                  }`}
                  style={{
                    borderColor: mood.colors.primary,
                    backgroundColor: currentMood === moodKey ? mood.colors.bg : 'transparent',
                    ringColor: currentMood === moodKey ? mood.colors.primary : 'transparent'
                  }}
                >
                  <span className="text-xl">{mood.emoji}</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 text-sm">{mood.name}</p>
                    <p className="text-xs text-gray-600">{mood.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mood History Toggle */}
          <div className="border-t pt-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Mood History ({moodHistory.length})</span>
            </button>

            {showHistory && moodHistory.length > 0 && (
              <div className="mt-3 max-h-32 overflow-y-auto">
                <div className="space-y-2">
                  {moodHistory.slice(-5).reverse().map((entry, index) => {
                    const mood = moods[entry.mood]
                    return (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <span>{mood.emoji}</span>
                          <span className="text-gray-700">{mood.name}</span>
                        </div>
                        <span className="text-gray-500">{formatTime(entry.timestamp)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Reset to Neutral */}
          <div className="border-t pt-4 mt-4">
            <button
              onClick={() => handleMoodChange('neutral')}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Reset to Neutral 😐
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MoodSelector
