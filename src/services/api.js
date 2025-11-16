import { API_CONFIG } from '../constants'

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.baseURL
    this.timeout = API_CONFIG.timeout
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('hacknhex_auth_token')
  }

  // Get default headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    }

    const token = this.getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  // Make HTTP request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: this.getHeaders(),
      ...options
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    
    return this.request(url, { method: 'GET' })
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  // Upload file
  async upload(endpoint, file, onProgress) {
    const formData = new FormData()
    formData.append('file', file)

    const xhr = new XMLHttpRequest()
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100
          onProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText)
            resolve({ success: true, data })
          } catch (error) {
            reject(new Error('Invalid JSON response'))
          }
        } else {
          reject(new Error(`HTTP error! status: ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Network error'))
      })

      xhr.addEventListener('abort', () => {
        reject(new Error('Request aborted'))
      })

      xhr.open('POST', `${this.baseURL}${endpoint}`)
      
      const token = this.getAuthToken()
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }

      xhr.send(formData)
    })
  }
}

// Create singleton instance
const apiService = new ApiService()

export default apiService
