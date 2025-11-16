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
  X,
  Edit3,
  Save,
  Trash2,
  AlertTriangle
} from 'lucide-react'

const Profile = () => {
  const { user, updateProfile, logout } = useUser()
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [showAvatarUpload, setShowAvatarUpload] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    github_url: '',
    linkedin_url: '',
    website_url: ''
  })
  const [deletingAccount, setDeletingAccount] = useState(false)
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

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        github_url: user.github_url || '',
        linkedin_url: user.linkedin_url || '',
        website_url: user.website_url || ''
      })
    }
  }, [user])

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

  // Handle profile edit
  const handleEditChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Save profile changes
  const saveProfile = async () => {
    try {
      const result = await updateProfile(editData)
      if (result.success) {
        setIsEditing(false)
        alert('Profile updated successfully!')
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert(`Failed to update profile: ${error.message || 'Please try again.'}`)
    }
  }

  // Delete account
  const deleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    setDeletingAccount(true)
    try {
      // First, delete user's avatar if exists
      if (user?.avatar_url) {
        try {
          const url = new URL(user.avatar_url)
          const filePath = url.pathname.split('/').slice(2).join('/')
          if (filePath) {
            await supabase.storage.from('avatars').remove([filePath])
          }
        } catch (error) {
          console.error('Error deleting avatar:', error)
        }
      }

      // Delete user from auth
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
      
      if (deleteError) {
        throw deleteError
      }

      // Logout and redirect
      await logout()
      alert('Account deleted successfully.')
    } catch (error) {
      console.error('Error deleting account:', error)
      alert(`Failed to delete account: ${error.message || 'Please try again.'}`)
    } finally {
      setDeletingAccount(false)
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
          <p className="text-gray-600 mt-1">View and manage your coding profile</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={saveProfile}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
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
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => handleEditChange('username', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) => handleEditChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => handleEditChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{user?.name || user?.username || 'User'}</h2>
                <p className="text-gray-600">@{user?.username || 'username'}</p>
                {user?.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
                {user?.location && (
                  <div className="flex items-center space-x-1 mt-2 text-gray-600">
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1 mt-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-700 font-medium">{user?.rating || 0}</span>
                  <span className="text-gray-500">rating</span>
                  <span className="ml-2 text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{user?.rank || 'Beginner'}</span>
                </div>
              </div>
            )}

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

            {/* Social Links */}
            {isEditing ? (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={editData.github_url}
                    onChange={(e) => handleEditChange('github_url', e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={editData.linkedin_url}
                    onChange={(e) => handleEditChange('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={editData.website_url}
                    onChange={(e) => handleEditChange('website_url', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="flex space-x-3 mt-4">
                {user?.github_url && (
                  <a href={user.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                    <span className="sr-only">GitHub</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
                {user?.linkedin_url && (
                  <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
                {user?.website_url && (
                  <a href={user.website_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                    <span className="sr-only">Website</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </a>
                )}
              </div>
            )}
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

      {/* Account Management */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Account Management</h3>
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Data */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h4 className="font-medium text-gray-900">Export Your Data</h4>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Download a copy of your coding progress, submissions, and profile information.
            </p>
            <button className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors">
              Export Data
            </button>
          </div>
          
          {/* Download Solutions */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              <h4 className="font-medium text-gray-900">Download Solutions</h4>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Export all your accepted solutions as code files for offline access.
            </p>
            <button className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors">
              Download Solutions
            </button>
          </div>
          
          {/* Deactivate Account */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h4 className="font-medium text-gray-900">Deactivate Account</h4>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Temporarily disable your account. Your data will be preserved and you can reactivate anytime.
            </p>
            <button 
              onClick={() => alert('Account deactivation feature coming soon!')}
              className="px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium transition-colors"
            >
              Deactivate Account
            </button>
          </div>
          
          {/* Delete Account */}
          <div className="border border-red-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <h4 className="font-medium text-gray-900">Delete Account</h4>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Permanently remove your account and all associated data. This action cannot be undone.
            </p>
            <button
              onClick={deleteAccount}
              disabled={deletingAccount}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {deletingAccount ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-blue-700 text-sm">
              <strong>Developer Tip:</strong> Before deleting your account, consider exporting your solutions and progress. 
              You can also deactivate your account temporarily if you plan to return later.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile