import React, { useState, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  SkipBack,
  SkipForward,
  Eye,
  Clock,
  Code,
  User,
  Calendar
} from 'lucide-react'

const CodeGhostReplay = () => {
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)

  // Simulated coding session data
  const codingSessions = [
    {
      id: 1,
      title: 'Fixed Settings.jsx Dynamic Icon Bug',
      date: new Date(),
      duration: '45 minutes',
      steps: [
        {
          timestamp: '00:00',
          action: 'opened_file',
          file: 'Settings.jsx',
          description: 'Opened Settings.jsx to investigate syntax error'
        },
        {
          timestamp: '02:30',
          action: 'identified_issue',
          line: 547,
          description: 'Found incorrect JSX syntax for dynamic component rendering'
        },
        {
          timestamp: '05:15',
          action: 'code_change',
          before: '<categories.find(cat => cat.id === activeSection).icon className="w-6 h-6 text-blue-600" />',
          after: 'const IconComponent = activeCategory.icon\nreturn <IconComponent className="w-6 h-6 text-blue-600" />',
          description: 'Fixed dynamic component instantiation'
        },
        {
          timestamp: '08:00',
          action: 'test_run',
          result: 'success',
          description: 'Tested the fix - syntax error resolved'
        }
      ],
      outcome: 'Successfully fixed dynamic icon rendering in Settings component',
      tags: ['bug-fix', 'react', 'jsx']
    },
    {
      id: 2,
      title: 'Implemented User Authentication',
      date: new Date(Date.now() - 86400000),
      duration: '2h 30m',
      steps: [
        {
          timestamp: '00:00',
          action: 'planning',
          description: 'Planned authentication flow with UserContext'
        },
        {
          timestamp: '15:00',
          action: 'created_context',
          file: 'UserContext.jsx',
          description: 'Created UserContext with login/logout functions'
        },
        {
          timestamp: '45:00',
          action: 'protected_routes',
          file: 'ProtectedRoute.jsx',
          description: 'Implemented route protection component'
        },
        {
          timestamp: '90:00',
          action: 'integration',
          description: 'Integrated auth system with existing components'
        }
      ],
      outcome: 'Complete authentication system with protected routes',
      tags: ['feature', 'authentication', 'react']
    }
  ]

  const playSession = () => {
    if (!selectedSession) return
    setIsPlaying(true)
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= selectedSession.steps.length - 1) {
          setIsPlaying(false)
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 2000 / playbackSpeed)

    return () => clearInterval(interval)
  }

  const pauseSession = () => {
    setIsPlaying(false)
  }

  const resetSession = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const skipToStep = (stepIndex) => {
    setCurrentStep(stepIndex)
    setIsPlaying(false)
  }

  useEffect(() => {
    setSessions(codingSessions)
  }, [])

  const getActionIcon = (action) => {
    const icons = {
      opened_file: Code,
      identified_issue: Eye,
      code_change: Edit3,
      test_run: Play,
      planning: Calendar,
      created_context: Plus,
      protected_routes: Shield,
      integration: GitBranch
    }
    return icons[action] || Code
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center space-x-3 mb-6">
        <RotateCcw className="w-6 h-6 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900">Code Ghost Replay</h1>
        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
          Watch your coding journey
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session List */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h2>
          <div className="space-y-3">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  setSelectedSession(session)
                  setCurrentStep(0)
                  setIsPlaying(false)
                }}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedSession?.id === session.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <h3 className="font-medium text-gray-900 text-sm">{session.title}</h3>
                <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{session.duration}</span>
                  <Calendar className="w-3 h-3 ml-2" />
                  <span>{session.date.toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {session.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Replay Player */}
        <div className="lg:col-span-2">
          {selectedSession ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">{selectedSession.title}</h2>
                <div className="flex items-center space-x-2">
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={2}>2x</option>
                    <option value={4}>4x</option>
                  </select>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <button
                  onClick={() => skipToStep(Math.max(0, currentStep - 1))}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <button
                  onClick={resetSession}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={isPlaying ? pauseSession : playSession}
                  className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>

                <button
                  onClick={() => skipToStep(Math.min(selectedSession.steps.length - 1, currentStep + 1))}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Step {currentStep + 1} of {selectedSession.steps.length}</span>
                  <span>{selectedSession.steps[currentStep]?.timestamp}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / selectedSession.steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Step Display */}
              {selectedSession.steps[currentStep] && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    {(() => {
                      const ActionIcon = getActionIcon(selectedSession.steps[currentStep].action)
                      return <ActionIcon className="w-5 h-5 text-indigo-600" />
                    })()}
                    <h3 className="font-medium text-gray-900">
                      {selectedSession.steps[currentStep].description}
                    </h3>
                  </div>
                  
                  {selectedSession.steps[currentStep].before && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Before:</p>
                      <pre className="bg-red-50 border border-red-200 rounded p-2 text-sm font-mono text-red-800 overflow-x-auto">
                        {selectedSession.steps[currentStep].before}
                      </pre>
                      <p className="text-sm font-medium text-gray-700">After:</p>
                      <pre className="bg-green-50 border border-green-200 rounded p-2 text-sm font-mono text-green-800 overflow-x-auto">
                        {selectedSession.steps[currentStep].after}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Session Outcome */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">Session Outcome</h3>
                <p className="text-green-700">{selectedSession.outcome}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <RotateCcw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Session</h3>
              <p className="text-gray-500">Choose a coding session to replay your problem-solving journey</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodeGhostReplay
