import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { 
  Search, 
  Bell, 
  User, 
  Menu, 
  X,
  Code,
  LogOut
} from 'lucide-react'

// Hacker Logo SVG Component for navbar
const HackerLogo = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#1e293b" stroke="#3b82f6" strokeWidth="2"/>
    <path d="M30 35L50 55L70 35" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M25 65L50 40L75 65" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="50" cy="50" r="8" fill="#ef4444"/>
    <path d="M20 20L80 80M80 20L20 80" stroke="#6366f1" strokeWidth="1" opacity="0.5"/>
  </svg>
)

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useUser()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/problems?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-secondary-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900">Hack'nhex</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
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
            </form>
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-100 transition-colors"
                >
                  <HackerLogo />
                  <span className="hidden sm:block text-sm font-medium text-secondary-700">
                    {user.name}
                  </span>
                  <User className="w-4 h-4 text-secondary-500" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </Link>
                    <Link
                      to="/submissions"
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Code className="w-4 h-4 mr-3" />
                      My Submissions
                    </Link>
                    <div className="border-t border-secondary-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-secondary-700 hover:text-secondary-900 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch}>
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
            </form>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
