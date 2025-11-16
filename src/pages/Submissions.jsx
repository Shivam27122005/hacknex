import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { getUserSubmissions } from '../services/supabaseService'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Filter,
  Search,
  Calendar,
  Code,
  Eye,
  Download,
  Share2
} from 'lucide-react'

const Submissions = () => {
  const { user } = useUser()
  const [submissions, setSubmissions] = useState([])
  const [filteredSubmissions, setFilteredSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        const result = await getUserSubmissions(user.id)
        
        if (result.success && result.data) {
          setSubmissions(result.data)
          setFilteredSubmissions(result.data)
        }
      } catch (error) {
        console.error('Error fetching submissions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [user?.id])

  useEffect(() => {
    filterSubmissions()
  }, [submissions, searchQuery, selectedStatus, selectedLanguage, selectedDifficulty])

  const filterSubmissions = () => {
    let filtered = [...submissions]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(submission =>
        (submission.problem_title || submission.problemTitle || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(submission => submission.status === selectedStatus)
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(submission => submission.language === selectedLanguage)
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(submission => submission.difficulty === selectedDifficulty)
    }

    setFilteredSubmissions(filtered)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-5 h-5 text-success-600" />
      case 'wrong_answer': return <XCircle className="w-5 h-5 text-error-600" />
      case 'time_limit_exceeded': return <Clock className="w-5 h-5 text-warning-600" />
      case 'runtime_error': return <XCircle className="w-5 h-5 text-error-600" />
      default: return <Clock className="w-5 h-5 text-secondary-400" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted': return 'Accepted'
      case 'wrong_answer': return 'Wrong Answer'
      case 'time_limit_exceeded': return 'Time Limit Exceeded'
      case 'runtime_error': return 'Runtime Error'
      default: return 'Unknown'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-success-600 bg-success-100'
      case 'wrong_answer': return 'text-error-600 bg-error-100'
      case 'time_limit_exceeded': return 'text-warning-600 bg-warning-100'
      case 'runtime_error': return 'text-error-600 bg-error-100'
      default: return 'text-secondary-600 bg-secondary-100'
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-success-600 bg-success-100'
      case 'Medium': return 'text-warning-600 bg-warning-100'
      case 'Hard': return 'text-error-600 bg-error-100'
      default: return 'text-secondary-600 bg-secondary-100'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const getStats = () => {
    const total = submissions.length
    const accepted = submissions.filter(s => s.status === 'accepted').length
    const successRate = total > 0 ? Math.round((accepted / total) * 100) : 0
    
    return { total, accepted, successRate }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-500">Loading submissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">My Submissions</h1>
          <p className="text-secondary-600 mt-1">Track your coding progress and solutions</p>
        </div>
        <Link
          to="/problems"
          className="btn-primary flex items-center space-x-2"
        >
          <Code className="w-4 h-4" />
          <span>Solve More Problems</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Submissions</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <Code className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Accepted</p>
              <p className="text-2xl font-bold text-success-600">{stats.accepted}</p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Success Rate</p>
              <p className="text-2xl font-bold text-primary-600">{stats.successRate}%</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="accepted">Accepted</option>
              <option value="wrong_answer">Wrong Answer</option>
              <option value="time_limit_exceeded">Time Limit Exceeded</option>
              <option value="runtime_error">Runtime Error</option>
            </select>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Languages</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 px-4 font-medium text-secondary-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-900">Problem</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-900">Language</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-900">Runtime</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-900">Memory</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-900">Submitted</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(submission.status)}
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(submission.status)}`}>
                        {getStatusText(submission.status)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <Link
                        to={`/problems/${submission.problem_id || submission.problemId}`}
                        className="font-medium text-secondary-900 hover:text-primary-600"
                      >
                        {submission.problem_title || submission.problemTitle}
                      </Link>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(submission.difficulty || 'Medium')}`}>
                          {submission.difficulty || 'Medium'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-secondary-700">{submission.language}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-secondary-700">
                      {submission.execution_time || submission.runtime > 0 ? `${submission.execution_time || submission.runtime} ms` : '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-secondary-700">
                      {submission.memory_usage || submission.memory > 0 ? `${submission.memory_usage || submission.memory} MB` : '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1 text-sm text-secondary-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(submission.submitted_at || submission.submittedAt)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-secondary-400 hover:text-secondary-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-secondary-400 hover:text-secondary-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-secondary-400 hover:text-secondary-600 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No submissions found</h3>
            <p className="text-secondary-500 mb-4">
              {submissions.length === 0 
                ? "You haven't submitted any solutions yet. Start solving problems to see your submissions here!"
                : "Try adjusting your search or filter criteria"
              }
            </p>
            {submissions.length === 0 && (
              <Link to="/problems" className="btn-primary">
                Start Solving Problems
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Submissions
