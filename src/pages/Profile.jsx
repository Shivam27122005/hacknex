import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext'
import { getRecentSubmissions, getUserStats } from '../services/supabaseService'
import { supabase } from '../lib/supabase'
import { 
  User, 
  Mail, 
  Calendar, 
  Code, 
  Trophy, 
  Target, 
  TrendingUp, 
  CheckCircle,
  Clock,
  Camera,
  Upload,
  X
} from 'lucide-react'

const Profile = () => {
  const { user, updateProfile } = useUser()
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [showAvatarUpload, setShowAvatarUpload] = useState(false)
  const fileInputRef = useRef(null)

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

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB')
        return
      }
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target.result)
        setShowAvatarUpload(true)
      }
      reader.readAsDataURL(file)
    }
  }

  // Upload avatar to Supabase Storage
  const uploadAvatar = async () => {
    if (!avatarPreview || !user?.id) return
    
    // Check if Supabase client is initialized
    if (!supabase) {
      alert('Database connection not available. Please refresh the page.')
      return
    }

    setAvatarLoading(true)
    try {
      // Convert base64 to blob
      const response = await fetch(avatarPreview)
      const blob = await response.blob()
      
      // Create unique filename with user folder
      const fileExt = blob.type.split('/')[1]
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      console.log('Uploading avatar:', { fileName, fileType: blob.type })
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: true
        })
      
      if (error) {
        console.error('Supabase upload error:', error)
        throw error
      }
      
      console.log('Upload successful:', data)
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)
      
      console.log('Public URL:', publicUrl)
      
      // Update user profile with new avatar URL
      const result = await updateProfile({ avatar_url: publicUrl })
      
      if (result.success) {
        setShowAvatarUpload(false)
        setAvatarPreview(null)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert(`Failed to upload avatar: ${error.message || 'Please try again.'}`)
    } finally {
      setAvatarLoading(false)
    }
  }

  // Remove avatar
  const removeAvatar = async () => {
    try {
      // If user has an existing avatar, try to delete the file
      if (user?.avatar_url) {
        // Extract the file path from the URL
        const url = new URL(user.avatar_url)
        const filePath = url.pathname.split('/').slice(2).join('/') // Remove /storage/v1/object/public/
        
        if (filePath) {
          console.log('Deleting avatar file:', filePath)
          const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([filePath])
          
          if (deleteError) {
            console.error('Error deleting avatar file:', deleteError)
          }
        }
      }
      
      const result = await updateProfile({ avatar_url: '' })
      if (result.success) {
        setShowAvatarUpload(false)
        setAvatarPreview(null)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error removing avatar:', error)
      alert(`Failed to remove avatar: ${error.message || 'Please try again.'}`)
    }
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
          <div className="flex-shrink-0 relative">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
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

      {/* Avatar Upload Modal */}
      {showAvatarUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Profile Photo</h3>
              <button 
                onClick={() => {
                  setShowAvatarUpload(false)
                  setAvatarPreview(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <img 
                src={avatarPreview} 
                alt="Preview" 
                className="w-32 h-32 rounded-full mx-auto object-cover"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={uploadAvatar}
                disabled={avatarLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center disabled:opacity-50"
              >
                {avatarLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </button>
              <button
                onClick={removeAvatar}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats && stats.map((stat, index) => (
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