import React, { useState, useEffect } from 'react'
import { 
  Brain, 
  Clock, 
  Code, 
  Lightbulb, 
  TrendingUp, 
  FileText,
  Search,
  Tag,
  Calendar,
  Zap,
  Target,
  AlertCircle
} from 'lucide-react'

const AIProjectMemory = () => {
  const [memories, setMemories] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  // Simulated AI memory data
  const projectMemories = [
    {
      id: 1,
      type: 'pattern',
      title: 'Authentication Flow Pattern',
      content: 'You consistently use UserContext for auth state management with localStorage persistence',
      relevance: 95,
      lastUsed: '2 days ago',
      projects: ['HacknHex', 'Portfolio Site'],
      tags: ['react', 'authentication', 'context']
    },
    {
      id: 2,
      type: 'bug-solution',
      title: 'Dynamic Component Rendering Fix',
      content: 'When rendering dynamic React components, assign to variable first then render',
      relevance: 88,
      lastUsed: '1 hour ago',
      projects: ['HacknHex'],
      tags: ['react', 'jsx', 'components']
    },
    {
      id: 3,
      type: 'preference',
      title: 'Tailwind CSS Styling Approach',
      content: 'You prefer utility-first classes with hover states and smooth transitions',
      relevance: 92,
      lastUsed: '3 hours ago',
      projects: ['HacknHex', 'Dashboard App'],
      tags: ['css', 'tailwind', 'ui']
    },
    {
      id: 4,
      type: 'optimization',
      title: 'Lazy Loading Implementation',
      content: 'You use React.lazy() for route-based code splitting in larger applications',
      relevance: 85,
      lastUsed: '1 day ago',
      projects: ['HacknHex'],
      tags: ['react', 'performance', 'routing']
    }
  ]

  const aiSuggestions = [
    {
      id: 1,
      type: 'improvement',
      title: 'Add Error Boundaries',
      reason: 'Based on your component patterns, error boundaries would improve UX',
      impact: 'High',
      effort: 'Low'
    },
    {
      id: 2,
      type: 'pattern',
      title: 'Custom Hook for API Calls',
      reason: 'You\'re repeating fetch logic - a custom hook would reduce code duplication',
      impact: 'Medium',
      effort: 'Medium'
    },
    {
      id: 3,
      type: 'security',
      title: 'Input Sanitization',
      reason: 'Your forms could benefit from input sanitization utilities',
      impact: 'High',
      effort: 'Low'
    }
  ]

  const getTypeIcon = (type) => {
    const icons = {
      pattern: Code,
      'bug-solution': Target,
      preference: Lightbulb,
      optimization: TrendingUp,
      improvement: Zap,
      security: AlertCircle
    }
    return icons[type] || FileText
  }

  const getTypeColor = (type) => {
    const colors = {
      pattern: 'text-blue-600 bg-blue-50',
      'bug-solution': 'text-green-600 bg-green-50',
      preference: 'text-purple-600 bg-purple-50',
      optimization: 'text-orange-600 bg-orange-50',
      improvement: 'text-yellow-600 bg-yellow-50',
      security: 'text-red-600 bg-red-50'
    }
    return colors[type] || 'text-gray-600 bg-gray-50'
  }

  const filteredMemories = memories.filter(memory =>
    memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  useEffect(() => {
    setMemories(projectMemories)
    setSuggestions(aiSuggestions)
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="w-6 h-6 text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-900">AI Project Memory</h1>
        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
          {memories.length} memories
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Suggestions */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
            AI Suggestions
          </h2>
          <div className="space-y-3">
            {suggestions.map((suggestion) => {
              const IconComponent = getTypeIcon(suggestion.type)
              return (
                <div key={suggestion.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(suggestion.type)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{suggestion.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{suggestion.reason}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          suggestion.impact === 'High' ? 'bg-red-100 text-red-700' :
                          suggestion.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {suggestion.impact} Impact
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                          {suggestion.effort} Effort
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Memory Search and List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Project Memories</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredMemories.map((memory) => {
              const IconComponent = getTypeIcon(memory.type)
              return (
                <div key={memory.id} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(memory.type)}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{memory.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>Last used {memory.lastUsed}</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            {memory.relevance}% relevant
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{memory.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {memory.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      Used in: {memory.projects.join(', ')}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Memories</p>
              <p className="text-2xl font-bold">{memories.length}</p>
            </div>
            <Brain className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Patterns Learned</p>
              <p className="text-2xl font-bold">{memories.filter(m => m.type === 'pattern').length}</p>
            </div>
            <Code className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Bug Solutions</p>
              <p className="text-2xl font-bold">{memories.filter(m => m.type === 'bug-solution').length}</p>
            </div>
            <Target className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Avg Relevance</p>
              <p className="text-2xl font-bold">
                {Math.round(memories.reduce((acc, m) => acc + m.relevance, 0) / memories.length)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIProjectMemory
