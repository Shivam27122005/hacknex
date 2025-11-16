
import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { getProblemsWithStatus } from '../services/supabaseService'
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Play,
  Star,
  TrendingUp,
  BookOpen,
  Target,
  Zap,
  Code
} from 'lucide-react'

// Utility: Get color classes for difficulty
const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Easy': return 'text-success-600 bg-success-100'
    case 'Medium': return 'text-warning-600 bg-warning-100'
    case 'Hard': return 'text-error-600 bg-error-100'
    default: return 'text-secondary-600 bg-secondary-100'
  }
}

// Utility: Get icon for problem status
const getStatusIcon = (status) => {
  switch (status) {
    case 'solved': return <CheckCircle className="w-5 h-5 text-success-600" />
    case 'attempted': return <XCircle className="w-5 h-5 text-warning-600" />
    default: return <Play className="w-5 h-5 text-secondary-400" />
  }
}

// Utility: Get status text
const getStatusText = (status) => {
  switch (status) {
    case 'solved': return 'Solved'
    case 'attempted': return 'Attempted'
    default: return 'Not Attempted'
  }
}

// Problem card component
function ProblemCard({ problem }) {
  return (
    <div className="card hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon(problem.status)}
          <span className="text-sm text-secondary-500">{getStatusText(problem.status)}</span>
        </div>
        {problem.is_premium && (
          <span className="text-xs bg-warning-100 text-warning-700 px-2 py-1 rounded-full">Premium</span>
        )}
      </div>
      <Link to={`/problems/${problem.id}`} className="block">
        <h3 className="text-lg font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">{problem.title}</h3>
      </Link>
      <div className="flex items-center space-x-2 mb-3">
        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</span>
        <span className="text-xs text-secondary-500">{problem.category}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-secondary-500 mb-4">
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-4 h-4" />
          <span>{problem.acceptance || 0}%</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4" />
          <span>{problem.likes || 0}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Link to={`/problems/${problem.id}`} className="btn-primary text-sm py-2 px-4">
          {problem.status === 'solved' ? 'Review' : 'Solve'}
        </Link>
        <button className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors">
          <Star className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Category select options
const categories = [
  { name: 'Arrays', icon: BookOpen, count: 150 },
  { name: 'Strings', icon: Target, count: 120 },
  { name: 'Linked Lists', icon: TrendingUp, count: 80 },
  { name: 'Trees', icon: Zap, count: 90 },
  { name: 'Dynamic Programming', icon: Code, count: 60 },
  { name: 'Graphs', icon: Star, count: 70 },
]

const ProblemList = () => {
  const { user } = useUser()
  const [searchParams, setSearchParams] = useSearchParams()
  const [problems, setProblems] = useState([])
  const [filteredProblems, setFilteredProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState('difficulty')

  const categories = [
    { name: 'Arrays', icon: BookOpen, count: 150 },
    { name: 'Strings', icon: Target, count: 120 },
    { name: 'Linked Lists', icon: TrendingUp, count: 80 },
    { name: 'Trees', icon: Zap, count: 90 },
    { name: 'Dynamic Programming', icon: Code, count: 60 },
    { name: 'Graphs', icon: Star, count: 70 },
  ]

  useEffect(() => {
    const fetchProblems = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        const result = await getProblemsWithStatus(user.id)
        
        if (result.success) {
          setProblems(result.data)
        } else {
          console.error('Error fetching problems:', result.error)
        }
      } catch (error) {
        console.error('Error fetching problems:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProblems()
  }, [user?.id])

  // Keep filters in sync with URL changes (e.g., clicking category links)
  useEffect(() => {
    const category = searchParams.get('category') || 'all'
    const difficulty = searchParams.get('difficulty') || 'all'
    const status = searchParams.get('status') || 'all'
    const search = searchParams.get('search') || ''

    setSelectedCategory(category)
    setSelectedDifficulty(difficulty)
    setSelectedStatus(status)
    setSearchQuery(search)
  }, [searchParams])

  useEffect(() => {
    filterProblems()
  }, [problems, searchQuery, selectedDifficulty, selectedCategory, selectedStatus, sortBy, searchParams])

  const filterProblems = () => {
    let filtered = [...problems]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(problem => problem.difficulty === selectedDifficulty)
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(problem => problem.category === selectedCategory)
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(problem => problem.status === selectedStatus)
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case 'acceptance':
          return b.acceptance - a.acceptance
        case 'likes':
          return b.likes - a.likes
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredProblems(filtered)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-success-600 bg-success-100'
      case 'Medium': return 'text-warning-600 bg-warning-100'
      case 'Hard': return 'text-error-600 bg-error-100'
      default: return 'text-secondary-600 bg-secondary-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'solved': return <CheckCircle className="w-5 h-5 text-success-600" />
      case 'attempted': return <XCircle className="w-5 h-5 text-warning-600" />
      default: return <Play className="w-5 h-5 text-secondary-400" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'solved': return 'Solved'
      case 'attempted': return 'Attempted'
      default: return 'Not Attempted'
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const next = new URLSearchParams(searchParams)
    if (searchQuery) next.set('search', searchQuery); else next.delete('search')
    if (selectedCategory !== 'all') next.set('category', selectedCategory); else next.delete('category')
    if (selectedDifficulty !== 'all') next.set('difficulty', selectedDifficulty); else next.delete('difficulty')
    if (selectedStatus !== 'all') next.set('status', selectedStatus); else next.delete('status')
    setSearchParams(next)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-500">Loading problems...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Problems</h1>
          <p className="text-secondary-600 mt-1">Practice coding problems to improve your skills</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-secondary-500">{filteredProblems.length} of {problems.length} problems</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </form>
          </div>
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Difficulty Filter */}
            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            {/* Category Filter */}
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>{category.name}</option>
              ))}
            </select>
            {/* Status Filter */}
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="all">All Status</option>
              <option value="solved">Solved</option>
              <option value="attempted">Attempted</option>
              <option value="not_attempted">Not Attempted</option>
            </select>
            {/* Sort By */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="difficulty">Sort by Difficulty</option>
              <option value="acceptance">Sort by Acceptance</option>
              <option value="likes">Sort by Likes</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problem Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProblems.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProblems.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No problems found</h3>
          <p className="text-secondary-500 mb-4">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedDifficulty('all')
              setSelectedCategory('all')
              setSelectedStatus('all')
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default ProblemList
