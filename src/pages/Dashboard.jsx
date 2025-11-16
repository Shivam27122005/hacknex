
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { getDashboardData, getTimeSpent, updateUserStreak } from '../services/supabaseService'
import { 
  CheckCircle, 
  XCircle,
  Play,
  Calendar,
  BarChart3,
  Zap,
  Code,
  Users,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react'

// Simple utility functions
const getDifficultyColor = (difficulty) => {
  const colors = {
    'Easy': 'text-green-600 bg-green-100',
    'Medium': 'text-yellow-600 bg-yellow-100',
    'Hard': 'text-red-600 bg-red-100'
  }
  return colors[difficulty] || 'text-gray-600 bg-gray-100'
}

const getStatusIcon = (status) => {
  if (status === 'solved') return <CheckCircle className="w-5 h-5 text-green-600" />
  if (status === 'attempted') return <XCircle className="w-5 h-5 text-yellow-600" />
  return <Play className="w-5 h-5 text-gray-400" />
}

// Helper function to format time ago
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

// Simple number formatting utility
const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

// Simple Card Component
const SimpleCard = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-xl shadow-md border border-gray-200 p-6 ${className}`} {...props}>
    {children}
  </div>
)

// Stats Card Component
const StatsCard = ({ title, value, change, changeType, icon, description }) => (
  <SimpleCard hover className="text-center hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-center mb-4">
      <div className={`w-12 h-12 ${changeType === 'positive' ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center  justify-center`}>
        {icon}
      </div>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-gray-600 mb-2">{title}</p>
    {description && <p className="text-sm text-gray-500">{description}</p>}
    {change && (
      <div className="mt-3">
        <span className={`text-sm font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-1">from last week</span>
      </div>
    )}
  </SimpleCard>
)

// Recent Problem Item
const RecentProblemItem = ({ problem }) => (
  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
    <div className="flex items-center space-x-4">
      {getStatusIcon(problem.status)}
      <div>
        <h3 className="font-medium text-gray-900">{problem.title}</h3>
        <div className="flex items-center space-x-2 mt-1">
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          <span className="text-xs text-gray-500">{problem.category}</span>
        </div>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm text-gray-500">{problem.time}</p>
      <Link to={`/problems/${problem.id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
        {problem.status === 'solved' ? 'Review' : 'Continue'}
      </Link>
    </div>
  </div>
)

// Challenge Card
const ChallengeCard = ({ challenge }) => (
  <SimpleCard className="hover:shadow-lg transition-shadow ">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-medium text-gray-900">{challenge.title}</h3>
      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
        {challenge.difficulty}
      </span>
    </div>
    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
      <span className="flex items-center">
        <Calendar className="w-4 h-4 mr-1" />
        {challenge.date}
      </span>
      <span className="flex items-center">
        <Users className="w-4 h-4 mr-1" />
        {challenge.participants} participants
      </span>
    </div>
    <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
      Register
    </button>
  </SimpleCard>
)

// Quick Action
const QuickAction = ({ to, icon, label, description, colorClass }) => (
  <Link to={to} className="block">
    <SimpleCard className="group hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-3">
        <div className={`p-3 ${colorClass} rounded-lg group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {label}
          </h3>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </SimpleCard>
  </Link>
)

// Category Progress Component
const CategoryProgress = ({ category }) => {
  const progress = category.count > 0 ? Math.min((category.solved / category.count) * 100, 100) : 0
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{category.name}</span>
        <span className="text-sm text-gray-500">
          {category.solved}/{category.count}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { user } = useUser()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        
        // Update user streak first
        await updateUserStreak(user.id)
        
        // Fetch all dashboard data
        const result = await getDashboardData(user.id)
        const timeResult = await getTimeSpent(user.id)
        
        if (result.success) {
          setDashboardData(result.data)
        } else {
          console.error('Dashboard data error:', result.error)
        }
        
        if (timeResult.success) {
          setTimeSpent(timeResult.data)
        } else {
          console.error('Time spent error:', timeResult.error)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user?.id])
  
  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  // Data arrays from Supabase
  const stats = [
    { 
      title: 'Problems Solved', 
      value: formatNumber(dashboardData.stats.problems_solved || 0), 
      change: '+5', 
      changeType: 'positive', 
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      description: 'Total problems completed'
    },
    { 
      title: 'Current Streak', 
      value: `${dashboardData.stats.streak || 0} days`, 
      change: '+3', 
      changeType: 'positive', 
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      description: 'Consecutive days active'
    },
    { 
      title: 'Accuracy Rate', 
      value: `${dashboardData.stats.accuracy || 0}%`, 
      change: '+7%', 
      changeType: 'positive', 
      icon: <Target className="w-6 h-6 text-yellow-600" />,
      description: 'Success rate on submissions'
    },
    { 
      title: 'Time Spent', 
      value: `${timeSpent}h`, 
      change: '+8h', 
      changeType: 'positive', 
      icon: <Clock className="w-6 h-6 text-gray-600" />,
      description: 'Total coding time'
    }
  ]

  const recentProblems = dashboardData.recentSubmissions.map((submission) => ({
    id: submission.problem_id,
    title: submission.problems?.title || submission.problem_title || 'Unknown Problem',
    difficulty: submission.problems?.difficulty || 'Medium',
    status: submission.status === 'accepted' ? 'solved' : 'attempted',
    category: submission.problems?.category || 'General',
    time: formatTimeAgo(submission.submitted_at)
  }))

  const categoryProgress = dashboardData.categoryProgress || []

  const quickActions = [
    {
      to: '/problems',
      icon: <Code className="w-5 h-5 text-blue-600" />,
      label: 'Browse Problems',
      description: 'Explore coding challenges',
      colorClass: 'bg-blue-100'
    },
    {
      to: '/submissions',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      label: 'View Submissions',
      description: 'Check your solutions',
      colorClass: 'bg-green-100'
    },
    {
      to: '/profile',
      icon: <BarChart3 className="w-5 h-5 text-gray-600" />,
      label: 'Progress Stats',
      description: 'Track your growth',
      colorClass: 'bg-gray-100'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || user?.username || 'User'}! 👋</h1>
          <p className="text-gray-600 mt-1">Keep up the great work on your coding journey</p>
        </div>
        <Link to="/problems" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2">
          <Play className="w-4 h-4" />
          <span>Start Coding</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Problems */}
        <div className="lg:col-span-2">
          <SimpleCard>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Recent Problems</h2>
                <p className="text-gray-600 mt-1">Your latest coding activities</p>
              </div>
              <Link to="/problems" className="text-blue-600 hover:text-blue-700 font-medium">View All</Link>
            </div>
            <div className="space-y-4">
              {recentProblems.length > 0 ? (
                recentProblems.map((problem) => (
                  <RecentProblemItem key={problem.id} problem={problem} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Code className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No recent submissions yet</p>
                  <Link to="/problems" className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block">
                    Start solving problems
                  </Link>
                </div>
              )}
            </div>
          </SimpleCard>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <SimpleCard>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <QuickAction key={index} {...action} />
              ))}
            </div>
          </SimpleCard>

          {/* Category Progress */}
          <SimpleCard>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Progress</h2>
            <p className="text-gray-600 mb-4">Track your learning path</p>
            <div className="space-y-4">
              {categoryProgress.length > 0 ? (
                categoryProgress.map((category, index) => (
                  <CategoryProgress key={index} category={category} />
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No progress data available yet</p>
                </div>
              )}
            </div>
          </SimpleCard>
        </div>
      </div>

      {/* Progress Chart Placeholder */}
      <SimpleCard>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Progress</h2>
            <p className="text-gray-600 mt-1">Visualize your coding journey</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Week</button>
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg">Month</button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Year</button>
          </div>
        </div>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Progress chart will be displayed here</p>
            <p className="text-sm text-gray-400">Coming soon with detailed analytics</p>
          </div>
        </div>
      </SimpleCard>
    </div>
  )
}

export default Dashboard
