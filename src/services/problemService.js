import apiService from './api'
import { API_CONFIG } from '../constants'

class ProblemService {
  // Get all problems with filters
  async getProblems(filters = {}) {
    try {
      const response = await apiService.get(API_CONFIG.endpoints.problems.list, filters)
      return response
    } catch (error) {
      console.error('Error fetching problems:', error)
      throw error
    }
  }

  // Get problem by ID
  async getProblem(id) {
    try {
      const endpoint = API_CONFIG.endpoints.problems.detail.replace(':id', id)
      const response = await apiService.get(endpoint)
      return response
    } catch (error) {
      console.error(`Error fetching problem ${id}:`, error)
      throw error
    }
  }

  // Submit solution
  async submitSolution(problemId, data) {
    try {
      const endpoint = API_CONFIG.endpoints.problems.submit.replace(':id', problemId)
      const response = await apiService.post(endpoint, data)
      return response
    } catch (error) {
      console.error(`Error submitting solution for problem ${problemId}:`, error)
      throw error
    }
  }

  // Get problem categories
  async getCategories() {
    try {
      const response = await apiService.get(API_CONFIG.endpoints.problems.categories)
      return response
    } catch (error) {
      console.error('Error fetching problem categories:', error)
      throw error
    }
  }

  // Get problems by category
  async getProblemsByCategory(category, filters = {}) {
    try {
      const response = await apiService.get(API_CONFIG.endpoints.problems.list, {
        ...filters,
        category
      })
      return response
    } catch (error) {
      console.error(`Error fetching problems for category ${category}:`, error)
      throw error
    }
  }

  // Get problems by difficulty
  async getProblemsByDifficulty(difficulty, filters = {}) {
    try {
      const response = await apiService.get(API_CONFIG.endpoints.problems.list, {
        ...filters,
        difficulty
      })
      return response
    } catch (error) {
      console.error(`Error fetching problems for difficulty ${difficulty}:`, error)
      throw error
    }
  }

  // Search problems
  async searchProblems(query, filters = {}) {
    try {
      const response = await apiService.get(API_CONFIG.endpoints.problems.list, {
        ...filters,
        search: query
      })
      return response
    } catch (error) {
      console.error(`Error searching problems with query "${query}":`, error)
      throw error
    }
  }

  // Get user's problem status
  async getUserProblemStatus(problemId) {
    try {
      const endpoint = `/api/problems/${problemId}/status`
      const response = await apiService.get(endpoint)
      return response
    } catch (error) {
      console.error(`Error fetching problem status for ${problemId}:`, error)
      throw error
    }
  }

  // Get problem statistics
  async getProblemStats(problemId) {
    try {
      const endpoint = `/api/problems/${problemId}/stats`
      const response = await apiService.get(endpoint)
      return response
    } catch (error) {
      console.error(`Error fetching problem stats for ${problemId}:`, error)
      throw error
    }
  }

  // Get problem discussions
  async getProblemDiscussions(problemId, page = 1) {
    try {
      const endpoint = `/api/problems/${problemId}/discussions`
      const response = await apiService.get(endpoint, { page })
      return response
    } catch (error) {
      console.error(`Error fetching discussions for problem ${problemId}:`, error)
      throw error
    }
  }

  // Add problem to favorites
  async addToFavorites(problemId) {
    try {
      const endpoint = `/api/problems/${problemId}/favorite`
      const response = await apiService.post(endpoint)
      return response
    } catch (error) {
      console.error(`Error adding problem ${problemId} to favorites:`, error)
      throw error
    }
  }

  // Remove problem from favorites
  async removeFromFavorites(problemId) {
    try {
      const endpoint = `/api/problems/${problemId}/favorite`
      const response = await apiService.delete(endpoint)
      return response
    } catch (error) {
      console.error(`Error removing problem ${problemId} from favorites:`, error)
      throw error
    }
  }

  // Get user's favorite problems
  async getFavoriteProblems(filters = {}) {
    try {
      const endpoint = '/api/problems/favorites'
      const response = await apiService.get(endpoint, filters)
      return response
    } catch (error) {
      console.error('Error fetching favorite problems:', error)
      throw error
    }
  }

  // Get problem of the day
  async getProblemOfTheDay() {
    try {
      const endpoint = '/api/problems/daily'
      const response = await apiService.get(endpoint)
      return response
    } catch (error) {
      console.error('Error fetching problem of the day:', error)
      throw error
    }
  }

  // Get random problem
  async getRandomProblem(difficulty = null, category = null) {
    try {
      const endpoint = '/api/problems/random'
      const params = {}
      if (difficulty) params.difficulty = difficulty
      if (category) params.category = category
      
      const response = await apiService.get(endpoint, params)
      return response
    } catch (error) {
      console.error('Error fetching random problem:', error)
      throw error
    }
  }

  // Get problem recommendations
  async getProblemRecommendations(userId = null) {
    try {
      const endpoint = '/api/problems/recommendations'
      const params = userId ? { userId } : {}
      
      const response = await apiService.get(endpoint, params)
      return response
    } catch (error) {
      console.error('Error fetching problem recommendations:', error)
      throw error
    }
  }

  // Get problem leaderboard
  async getProblemLeaderboard(problemId, page = 1) {
    try {
      const endpoint = `/api/problems/${problemId}/leaderboard`
      const response = await apiService.get(endpoint, { page })
      return response
    } catch (error) {
      console.error(`Error fetching leaderboard for problem ${problemId}:`, error)
      throw error
    }
  }

  // Get problem solutions
  async getProblemSolutions(problemId, page = 1) {
    try {
      const endpoint = `/api/problems/${problemId}/solutions`
      const response = await apiService.get(endpoint, { page })
      return response
    } catch (error) {
      console.error(`Error fetching solutions for problem ${problemId}:`, error)
      throw error
    }
  }

  // Submit problem solution
  async submitProblemSolution(problemId, solutionData) {
    try {
      const endpoint = `/api/problems/${problemId}/solutions`
      const response = await apiService.post(endpoint, solutionData)
      return response
    } catch (error) {
      console.error(`Error submitting solution for problem ${problemId}:`, error)
      throw error
    }
  }

  // Rate problem
  async rateProblem(problemId, rating) {
    try {
      const endpoint = `/api/problems/${problemId}/rate`
      const response = await apiService.post(endpoint, { rating })
      return response
    } catch (error) {
      console.error(`Error rating problem ${problemId}:`, error)
      throw error
    }
  }

  // Report problem
  async reportProblem(problemId, reportData) {
    try {
      const endpoint = `/api/problems/${problemId}/report`
      const response = await apiService.post(endpoint, reportData)
      return response
    } catch (error) {
      console.error(`Error reporting problem ${problemId}:`, error)
      throw error
    }
  }
}

// Create singleton instance
const problemService = new ProblemService()

export default problemService
