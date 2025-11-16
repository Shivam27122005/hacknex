import React, { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { getRecentSubmissions, getUserStats } from '../services/supabaseService'
import { 
  User, 
  Mail, 
  Calendar, 
  Code, 
  Trophy, 
  Target, 
  TrendingUp, 
  CheckCircle,
  Clock
} from 'lucide-react'

const Profile = () => {
  const { user } = useUser()
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        const statsResult = await getUserStats(user.id)
        const submissionsResult = await getRecentSubmissions(user.id, 5)
        
        if (statsResult.success) {
          setStats([
            { label: 'Problems Solved', value: statsResult.data.problems_solved || 0, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
            { label: 'Total Submissions', value: statsResult.data.total_submissions || 0, icon: Code, color: 'text-blue-600', bgColor: 'bg-blue-50' },
            { label: 'Accuracy Rate', value: `${statsResult.data.accuracy || 0}%`, icon: Target, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
            { label: 'Current Streak', value: `${statsResult.data.streak || 0} days`, icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-50' }
          ])
        }
        
        if (submissionsResult.success && submissionsResult.data) {
          setRecentActivity(submissionsResult.data.map(submission => ({
            type: submission.status === 'accepted' ? 'solved' : 'attempted',
            problem: submission.problem_title,
            difficulty: getDifficultyFromSubmission(submission),
            time: formatTimeAgo(submission.submitted_at),
            language: submission.language
          })))
        }
      } catch (error) {
        console.error('Error fetching profile data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [user?.id])

  const getDifficultyFromSubmission = (submission) => {
    // You might need to join with problems table or store difficulty in submission
    return 'Medium' // Default fallback
  }

  const formatTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const seconds = Math.floor((now - date) / 1000)
    
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'text-green-600 bg-green-50',
      'Medium': 'text-yellow-600 bg-yellow-50',
      'Hard': 'text-red-600 bg-red-50'
    }
    return colors[difficulty] || 'text-gray-600 bg-gray-50'
  }

  const getActivityIcon = (type) => {
    if (type === 'solved') return <CheckCircle className="w-5 h-5 text-green-600" />
    return <Clock className="w-5 h-5 text-yellow-600" />
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">View your coding progress and stats</p>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
        <div className="flex items-start space-x-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{user?.name || user?.username || 'User'}</h2>
              <p className="text-gray-600">@{user?.username || 'username'}</p>
              <div className="flex items-center space-x-1 mt-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700 font-medium">{user?.rating || 0}</span>
                <span className="text-gray-500">rating</span>
                <span className="ml-2 text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{user?.rank || 'Beginner'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{user?.email || 'email@example.com'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Member since {user?.join_date ? new Date(user.join_date).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
          <Clock className="w-6 h-6 text-gray-500" />
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              {getActivityIcon(activity.type)}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">{activity.problem}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(activity.difficulty)}`}>
                    {activity.difficulty}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>{activity.language}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile
