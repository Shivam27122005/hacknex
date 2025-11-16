import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Code, 
  Trophy, 
  User, 
  FileText,
  Settings,
  BookOpen,
  Activity,
  Brain,
  List,
  Target,
  TrendingUp,
  Zap,
  Star
} from 'lucide-react'
import { useUser } from '../context/UserContext'
import { supabase } from '../lib/supabase'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [quickStats, setQuickStats] = useState({
    solvedToday: 0,
    currentStreak: 0,
    totalSolved: 0
  })
  const location = useLocation()
  const { user } = useUser()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Problems', href: '/problems', icon: Code },
    { name: 'Submissions', href: '/submissions', icon: Trophy },
    { name: 'Profile', href: '/profile', icon: User },
    // { name: 'Insights', href: '/insights', icon: Activity },
  ]

  const categories = [
    { name: 'Arrays', count: 150, difficulty: 'Easy', icon: List },
    { name: 'Strings', count: 120, difficulty: 'Easy', icon: BookOpen },
    { name: 'Linked Lists', count: 80, difficulty: 'Medium', icon: Target },
    { name: 'Trees', count: 90, difficulty: 'Medium', icon: TrendingUp },
    { name: 'Dynamic Programming', count: 60, difficulty: 'Hard', icon: Zap },
    { name: 'Graphs', count: 70, difficulty: 'Hard', icon: Star },
  ]

  const isActive = (path) => location.pathname === path

  // Fetch real quick stats from database
  useEffect(() => {
    const fetchQuickStats = async () => {
      if (!user?.id || !supabase) return

      try {
        // Get user stats
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('problems_solved, streak')
          .eq('id', user.id)
          .single()

        if (userError) throw userError

        // Get submissions from today
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayISO = today.toISOString()

        const { data: todaySubmissions, error: submissionsError } = await supabase
          .from('submissions')
          .select('problem_id, status')
          .eq('user_id', user.id)
          .eq('status', 'accepted')
          .gte('submitted_at', todayISO)

        if (submissionsError) throw submissionsError

        // Count unique problems solved today
        const uniqueProblemsSolvedToday = new Set(
          todaySubmissions?.map(s => s.problem_id) || []
        ).size

        setQuickStats({
          solvedToday: uniqueProblemsSolvedToday,
          currentStreak: userData?.streak || 0,
          totalSolved: userData?.problems_solved || 0
        })
      } catch (error) {
        console.error('Error fetching quick stats:', error)
      }
    }

    fetchQuickStats()
  }, [user])

  return (
    <div className={`bg-white border-r border-secondary-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-secondary-100 transition-colors mb-4"
        >
          {isCollapsed ? (
            <TrendingUp className="w-5 h-5 text-secondary-600" />
          ) : (
            <TrendingUp className="w-5 h-5 text-secondary-600" />
          )}
        </button>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 font-medium">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        {!isCollapsed && (
          <div className="border-t border-secondary-200 my-6" />
        )}

        {/* Problem Categories */}
        {!isCollapsed && (
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 mb-3">
              Problem Categories
            </h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon
                const difficultyColor = {
                  'Easy': 'text-success-600',
                  'Medium': 'text-warning-600',
                  'Hard': 'text-error-600'
                }

                return (
                  <Link
                    key={category.name}
                    to={`/problems?category=${encodeURIComponent(category.name)}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 text-secondary-500 group-hover:text-secondary-700" />
                      <div>
                        <div className="text-sm font-medium text-secondary-900">
                          {category.name}
                        </div>
                        <div className="text-xs text-secondary-500">
                          {category.count} problems
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      difficultyColor[category.difficulty]
                    } bg-opacity-10 ${
                      category.difficulty === 'Easy' ? 'bg-success-100' :
                      category.difficulty === 'Medium' ? 'bg-warning-100' :
                      'bg-error-100'
                    }`}>
                      {category.difficulty}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {!isCollapsed && (
          <>
            <div className="border-t border-secondary-200 my-6" />
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-secondary-900">
                Quick Stats
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary-600">Solved Today</span>
                  <span className="font-medium text-success-600">{quickStats.solvedToday}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary-600">Current Streak</span>
                  <span className="font-medium text-primary-600">{quickStats.currentStreak} days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary-600">Total Solved</span>
                  <span className="font-medium text-secondary-900">{quickStats.totalSolved}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Sidebar
