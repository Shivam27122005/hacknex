import React, { useState, useEffect } from 'react'
import { 
  Activity, 
  Clock, 
  Code, 
  GitBranch, 
  Zap, 
  Target,
  TrendingUp,
  Calendar,
  Coffee,
  Moon,
  Sun,
  BarChart3,
  PieChart,
  Timer
} from 'lucide-react'

const DevInsights = () => {
  const [insights, setInsights] = useState({
    todayStats: {
      linesOfCode: 247,
      timeSpent: '3h 42m',
      bugsFixed: 3,
      featuresCompleted: 1
    },
    weeklyTrends: {
      mostProductiveTime: '2-4 PM',
      favoriteLanguage: 'JavaScript',
      avgSessionLength: '2h 15m',
      streakDays: 5
    },
    codingPatterns: {
      peakHours: [14, 15, 16, 20, 21],
      languageDistribution: {
        'JavaScript': 65,
        'CSS': 20,
        'HTML': 10,
        'JSON': 5
      },
      projectFocus: 'Frontend Development'
    }
  })

  const [timeRange, setTimeRange] = useState('week')

  const getProductivityColor = (hour) => {
    if (insights.codingPatterns.peakHours.includes(hour)) {
      return 'bg-green-500'
    } else if (hour >= 9 && hour <= 18) {
      return 'bg-blue-300'
    } else if (hour >= 19 && hour <= 23) {
      return 'bg-purple-300'
    }
    return 'bg-gray-200'
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <div className={`bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-lg p-4 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-${color}-100 text-sm`}>{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && <p className={`text-${color}-200 text-xs mt-1`}>{subtitle}</p>}
        </div>
        <Icon className={`w-8 h-8 text-${color}-200`} />
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Dev Insights</h1>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Code}
          title="Lines of Code"
          value={insights.todayStats.linesOfCode}
          subtitle="Today"
          color="blue"
        />
        <StatCard
          icon={Timer}
          title="Time Spent"
          value={insights.todayStats.timeSpent}
          subtitle="Active coding"
          color="green"
        />
        <StatCard
          icon={Target}
          title="Bugs Fixed"
          value={insights.todayStats.bugsFixed}
          subtitle="Great debugging!"
          color="red"
        />
        <StatCard
          icon={Zap}
          title="Features Done"
          value={insights.todayStats.featuresCompleted}
          subtitle="Keep it up!"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coding Heatmap */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
            Daily Activity Heatmap
          </h3>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 24 }, (_, hour) => (
              <div
                key={hour}
                className={`h-8 rounded ${getProductivityColor(hour)} flex items-center justify-center`}
                title={`${hour}:00 - ${hour + 1}:00`}
              >
                <span className="text-xs text-white font-medium">
                  {hour < 10 ? `0${hour}` : hour}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>12 AM</span>
            <span>Peak: {insights.weeklyTrends.mostProductiveTime}</span>
            <span>12 PM</span>
          </div>
        </div>

        {/* Language Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 text-purple-600 mr-2" />
            Language Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(insights.codingPatterns.languageDistribution).map(([lang, percentage]) => (
              <div key={lang} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{lang}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trends */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            Weekly Trends
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Most Productive Time</span>
              <span className="font-medium text-gray-900">{insights.weeklyTrends.mostProductiveTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Favorite Language</span>
              <span className="font-medium text-gray-900">{insights.weeklyTrends.favoriteLanguage}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Session Length</span>
              <span className="font-medium text-gray-900">{insights.weeklyTrends.avgSessionLength}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Streak</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{insights.weeklyTrends.streakDays} days</span>
                <div className="flex space-x-1">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < insights.weeklyTrends.streakDays ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 text-orange-600 mr-2" />
            Focus Areas
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Frontend Development</p>
                <p className="text-sm text-gray-600">Primary focus this week</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">React Components</p>
                <p className="text-sm text-gray-600">Building reusable UI</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">User Experience</p>
                <p className="text-sm text-gray-600">Improving interactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DevInsights
