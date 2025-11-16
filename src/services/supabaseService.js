import { supabase } from '../lib/supabase'

/**
 * Supabase Service - Centralized database operations
 */

// ==================== USER OPERATIONS ====================

export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return { success: false, error: error.message }
  }
}

export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { success: false, error: error.message }
  }
}

export const getUserStats = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('problems_solved, total_submissions, accuracy, streak, rating, rank')
      .eq('id', userId)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return { success: false, error: error.message }
  }
}

// ==================== PROBLEM OPERATIONS ====================

export const getAllProblems = async (filters = {}) => {
  try {
    let query = supabase
      .from('problems')
      .select('*')
      .order('id', { ascending: true })

    // Apply filters
    if (filters.difficulty) {
      query = query.eq('difficulty', filters.difficulty)
    }
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching problems:', error)
    return { success: false, error: error.message }
  }
}

export const getProblemById = async (problemId) => {
  try {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('id', problemId)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching problem:', error)
    return { success: false, error: error.message }
  }
}

export const getProblemsWithStatus = async (userId) => {
  try {
    // Get all problems
    const { data: problems, error: problemsError } = await supabase
      .from('problems')
      .select('*')
      .order('id', { ascending: true })

    if (problemsError) throw problemsError

    // Get user's problem statuses
    const { data: statuses, error: statusError } = await supabase
      .from('user_problem_status')
      .select('problem_id, status')
      .eq('user_id', userId)

    if (statusError) throw statusError

    // Merge status with problems
    const statusMap = new Map(statuses.map(s => [s.problem_id, s.status]))
    const problemsWithStatus = problems.map(problem => ({
      ...problem,
      status: statusMap.get(problem.id) || 'not_attempted'
    }))

    return { success: true, data: problemsWithStatus }
  } catch (error) {
    console.error('Error fetching problems with status:', error)
    return { success: false, error: error.message }
  }
}

export const getUserProblemStatus = async (userId, problemId) => {
  try {
    const { data, error } = await supabase
      .from('user_problem_status')
      .select('*')
      .eq('user_id', userId)
      .eq('problem_id', problemId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // Ignore "not found" error
    return { success: true, data: data || { status: 'not_attempted' } }
  } catch (error) {
    console.error('Error fetching user problem status:', error)
    return { success: false, error: error.message }
  }
}

// ==================== SUBMISSION OPERATIONS ====================

export const getUserSubmissions = async (userId, filters = {}) => {
  try {
    let query = supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.language) {
      query = query.eq('language', filters.language)
    }
    if (filters.problemId) {
      query = query.eq('problem_id', filters.problemId)
    }

    const { data, error } = await query

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return { success: false, error: error.message }
  }
}

export const createSubmission = async (submissionData) => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .insert([{
        ...submissionData,
        submitted_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error creating submission:', error)
    return { success: false, error: error.message }
  }
}

export const getRecentSubmissions = async (userId, limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching recent submissions:', error)
    return { success: false, error: error.message }
  }
}

// ==================== DASHBOARD OPERATIONS ====================

export const getDashboardData = async (userId) => {
  try {
    // Get user stats
    const statsResult = await getUserStats(userId)
    if (!statsResult.success) throw new Error(statsResult.error)

    // Get recent submissions with problem details
    const { data: recentSubmissions, error: submissionsError } = await supabase
      .from('submissions')
      .select(`
        *,
        problems:problem_id (
          id,
          title,
          difficulty,
          category
        )
      `)
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(5)

    if (submissionsError) throw submissionsError

    // Get category progress using RPC function
    const { data: categoryProgress, error: categoryError } = await supabase
      .rpc('get_user_category_progress', { p_user_id: userId })

    // If RPC doesn't exist, calculate manually
    let categoryData = []
    if (categoryError) {
      console.warn('RPC function not available, calculating category progress manually:', categoryError)
      
      // Get all problems grouped by category
      const { data: allProblems } = await supabase
        .from('problems')
        .select('id, category')
      
      // Get user's solved problems with category
      const { data: userStatus } = await supabase
        .from('user_problem_status')
        .select(`
          problem_id,
          status,
          problems:problem_id(category)
        `)
        .eq('user_id', userId)
        .eq('status', 'solved')

      // Group by category
      const categoryMap = new Map()
      
      // Count all problems per category
      allProblems?.forEach(problem => {
        const cat = problem.category
        if (!categoryMap.has(cat)) {
          categoryMap.set(cat, { name: cat, count: 0, solved: 0 })
        }
        categoryMap.get(cat).count++
      })

      // Count solved problems per category
      userStatus?.forEach(status => {
        const cat = status.problems?.category
        if (cat && categoryMap.has(cat)) {
          categoryMap.get(cat).solved++
        }
      })

      categoryData = Array.from(categoryMap.values())
        .filter(cat => cat.count > 0)
        .sort((a, b) => a.name.localeCompare(b.name))
    } else {
      categoryData = categoryProgress || []
    }

    return {
      success: true,
      data: {
        stats: statsResult.data,
        recentSubmissions: recentSubmissions || [],
        categoryProgress: categoryData
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return { success: false, error: error.message }
  }
}

// ==================== LEADERBOARD OPERATIONS ====================

export const getLeaderboard = async (limit = 100) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, name, avatar_url, rating, problems_solved, accuracy, rank')
      .order('rating', { ascending: false })
      .order('problems_solved', { ascending: false })
      .limit(limit)

    if (error) throw error
    
    // Add position
    const leaderboardData = data.map((user, index) => ({
      ...user,
      position: index + 1
    }))

    return { success: true, data: leaderboardData }
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return { success: false, error: error.message }
  }
}

// ==================== CATEGORIES OPERATIONS ====================

export const getAllCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { success: false, error: error.message }
  }
}

// ==================== TIME TRACKING ====================

export const getTimeSpent = async (userId) => {
  try {
    // Calculate from submissions - sum of execution times
    const { data, error } = await supabase
      .from('submissions')
      .select('execution_time, submitted_at')
      .eq('user_id', userId)

    if (error) throw error

    // Calculate total time from submission timestamps
    let totalMinutes = 0
    if (data && data.length > 0) {
      // Group by date and calculate session times
      const sessions = new Map()
      data.forEach(submission => {
        const date = new Date(submission.submitted_at).toDateString()
        if (!sessions.has(date)) {
          sessions.set(date, [])
        }
        sessions.get(date).push(new Date(submission.submitted_at))
      })

      // Calculate time for each session (assume 30 min per session minimum)
      sessions.forEach(timestamps => {
        timestamps.sort((a, b) => a - b)
        let sessionTime = 30 // minimum session time in minutes
        
        for (let i = 1; i < timestamps.length; i++) {
          const diff = (timestamps[i] - timestamps[i-1]) / 1000 / 60
          if (diff < 120) { // if within 2 hours, add to session
            sessionTime += diff
          } else {
            sessionTime += 30 // new session
          }
        }
        totalMinutes += sessionTime
      })
    }

    const hours = Math.round(totalMinutes / 60)
    return { success: true, data: hours }
  } catch (error) {
    console.error('Error calculating time spent:', error)
    return { success: false, error: error.message }
  }
}

// ==================== ACTIVITY & ANALYTICS ====================

export const getUserActivity = async (userId, days = 30) => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_activity', { p_user_id: userId, p_days: days })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching user activity:', error)
    return { success: false, error: error.message }
  }
}

export const getLanguageStats = async (userId) => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_language_stats', { p_user_id: userId })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching language stats:', error)
    return { success: false, error: error.message }
  }
}

export const updateUserStreak = async (userId) => {
  try {
    const { error } = await supabase
      .rpc('update_user_streak', { p_user_id: userId })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error updating user streak:', error)
    return { success: false, error: error.message }
  }
}
