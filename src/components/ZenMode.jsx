import React, { useState, useEffect } from 'react'
import { 
  Minimize2, 
  Maximize2, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX,
  Timer,
  Focus,
  Moon,
  Lightbulb
} from 'lucide-react'

const ZenMode = ({ isActive, onToggle, children }) => {
  const [focusTimer, setFocusTimer] = useState(0)
  const [ambientSounds, setAmbientSounds] = useState(false)
  const [breathingReminder, setBreathingReminder] = useState(false)
  const [distractionCount, setDistractionCount] = useState(0)

  useEffect(() => {
    let interval
    if (isActive) {
      interval = setInterval(() => {
        setFocusTimer(prev => prev + 1)
      }, 1000)
    } else {
      setFocusTimer(0)
    }
    return () => clearInterval(interval)
  }, [isActive])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const ZenControls = () => (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
      {isActive && (
        <>
          {/* Focus Timer */}
          <div className="bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg flex items-center space-x-2">
            <Timer className="w-4 h-4" />
            <span className="font-mono text-sm">{formatTime(focusTimer)}</span>
          </div>

          {/* Ambient Sounds */}
          <button
            onClick={() => setAmbientSounds(!ambientSounds)}
            className="bg-black bg-opacity-70 text-white p-2 rounded-lg hover:bg-opacity-80 transition-colors"
          >
            {ambientSounds ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Breathing Reminder */}
          <button
            onClick={() => setBreathingReminder(!breathingReminder)}
            className="bg-black bg-opacity-70 text-white p-2 rounded-lg hover:bg-opacity-80 transition-colors"
          >
            <Focus className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Zen Toggle */}
      <button
        onClick={onToggle}
        className="bg-black bg-opacity-70 text-white p-2 rounded-lg hover:bg-opacity-80 transition-colors"
      >
        {isActive ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
    </div>
  )

  if (!isActive) {
    return (
      <>
        {children}
        <ZenControls />
      </>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-900 z-40">
      {/* Zen Mode Container */}
      <div className="h-full flex items-center justify-center p-8">
        <div className="w-full max-w-6xl h-full bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
          {/* Minimal Header */}
          <div className="bg-gray-700 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-gray-300 text-sm font-mono">
              HacknHex • Zen Mode
            </div>
            <div className="w-16"></div>
          </div>

          {/* Editor Area */}
          <div className="h-full bg-gray-900 relative">
            {children}
            
            {/* Breathing Reminder */}
            {breathingReminder && (
              <div className="absolute bottom-8 left-8">
                <div className="bg-blue-500 bg-opacity-20 text-blue-300 px-4 py-2 rounded-lg animate-pulse">
                  <div className="flex items-center space-x-2">
                    <Focus className="w-4 h-4" />
                    <span className="text-sm">Take a deep breath</span>
                  </div>
                </div>
              </div>
            )}

            {/* Distraction Counter */}
            {distractionCount > 0 && (
              <div className="absolute bottom-8 right-8">
                <div className="bg-red-500 bg-opacity-20 text-red-300 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{distractionCount} distractions</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ZenControls />

      {/* Ambient Sound Player */}
      {ambientSounds && (
        <audio loop autoPlay className="hidden">
          <source src="/sounds/rain.mp3" type="audio/mpeg" />
          <source src="/sounds/coffee-shop.mp3" type="audio/mpeg" />
        </audio>
      )}
    </div>
  )
}

export default ZenMode
