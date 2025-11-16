// Application Constants
export const APP_CONFIG = {
  name: 'Hackn\'hex',
  version: '1.0.0',
  description: 'A competitive programming platform for coding enthusiasts',
  author: 'Ashwin',
  github: 'https://github.com/ashwinhacker'
}

// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      logout: '/api/auth/logout',
      refresh: '/api/auth/refresh'
    },
    problems: {
      list: '/api/problems',
      detail: '/api/problems/:id',
      submit: '/api/problems/:id/submit',
      categories: '/api/problems/categories'
    },
    users: {
      profile: '/api/users/profile',
      submissions: '/api/users/submissions',
      stats: '/api/users/stats'
    },
    contests: {
      list: '/api/contests',
      detail: '/api/contests/:id',
      register: '/api/contests/:id/register'
    }
  }
}

// Problem Categories
export const PROBLEM_CATEGORIES = [
  { id: 'arrays', name: 'Arrays', icon: '📊', difficulty: 'Easy', count: 150 },
  { id: 'strings', name: 'Strings', icon: '🔤', difficulty: 'Easy', count: 120 },
  { id: 'linked-lists', name: 'Linked Lists', icon: '🔗', difficulty: 'Medium', count: 80 },
  { id: 'trees', name: 'Trees', icon: '🌳', difficulty: 'Medium', count: 90 },
  { id: 'graphs', name: 'Graphs', icon: '🕸️', difficulty: 'Hard', count: 70 },
  { id: 'dynamic-programming', name: 'Dynamic Programming', icon: '⚡', difficulty: 'Hard', count: 60 },
  { id: 'greedy', name: 'Greedy', icon: '🎯', difficulty: 'Medium', count: 45 },
  { id: 'backtracking', name: 'Backtracking', icon: '🔄', difficulty: 'Hard', count: 35 },
  { id: 'binary-search', name: 'Binary Search', icon: '🔍', difficulty: 'Medium', count: 55 },
  { id: 'two-pointers', name: 'Two Pointers', icon: '👆👆', difficulty: 'Medium', count: 40 }
]

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: {
    name: 'Easy',
    color: 'success',
    rating: 800,
    points: 10
  },
  MEDIUM: {
    name: 'Medium',
    color: 'warning',
    rating: 1200,
    points: 20
  },
  HARD: {
    name: 'Hard',
    color: 'error',
    rating: 1800,
    points: 30
  }
}

// User Ranks
export const USER_RANKS = [
  { name: 'Bronze', minRating: 0, maxRating: 799, color: 'amber-600' },
  { name: 'Silver', minRating: 800, maxRating: 1199, color: 'gray-400' },
  { name: 'Gold', minRating: 1200, maxRating: 1599, color: 'yellow-500' },
  { name: 'Platinum', minRating: 1600, maxRating: 1999, color: 'cyan-500' },
  { name: 'Diamond', minRating: 2000, maxRating: 2399, color: 'purple-500' },
  { name: 'Master', minRating: 2400, maxRating: 2799, color: 'red-500' },
  { name: 'Grandmaster', minRating: 2800, maxRating: 9999, color: 'pink-500' }
]

// Programming Languages
export const PROGRAMMING_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', extension: '.js', icon: '🟨' },
  { id: 'python', name: 'Python', extension: '.py', icon: '🐍' },
  { id: 'cpp', name: 'C++', extension: '.cpp', icon: '🔵' },
  { id: 'java', name: 'Java', extension: '.java', icon: '☕' },
  { id: 'go', name: 'Go', extension: '.go', icon: '🔵' },
  { id: 'rust', name: 'Rust', extension: '.rs', icon: '🦀' },
  { id: 'csharp', name: 'C#', extension: '.cs', icon: '🟪' },
  { id: 'php', name: 'PHP', extension: '.php', icon: '🟦' }
]

// Submission Status
export const SUBMISSION_STATUS = {
  ACCEPTED: { name: 'Accepted', color: 'success', icon: '✅' },
  WRONG_ANSWER: { name: 'Wrong Answer', color: 'error', icon: '❌' },
  TIME_LIMIT_EXCEEDED: { name: 'Time Limit Exceeded', color: 'warning', icon: '⏰' },
  MEMORY_LIMIT_EXCEEDED: { name: 'Memory Limit Exceeded', color: 'warning', icon: '💾' },
  RUNTIME_ERROR: { name: 'Runtime Error', color: 'error', icon: '💥' },
  COMPILATION_ERROR: { name: 'Compilation Error', color: 'error', icon: '🔧' },
  PENDING: { name: 'Pending', color: 'secondary', icon: '⏳' }
}

// Navigation Items
export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', path: '/', icon: 'Home', description: 'Overview of your progress' },
  { name: 'Problems', path: '/problems', icon: 'Code', description: 'Browse coding problems' },
  { name: 'Submissions', path: '/submissions', icon: 'CheckCircle', description: 'View your submissions' },
  { name: 'Profile', path: '/profile', icon: 'User', description: 'Manage your profile' },
  { name: 'Leaderboard', path: '/leaderboard', icon: 'Trophy', description: 'See top performers' },
  { name: 'Contests', path: '/contests', icon: 'Award', description: 'Participate in contests' }
]

// Theme Colors
export const THEME_COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  }
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'hacknhex_auth_token',
  USER_DATA: 'hacknhex_user_data',
  THEME: 'hacknhex_theme',
  LANGUAGE: 'hacknhex_language',
  CODE_EDITOR_SETTINGS: 'hacknhex_editor_settings'
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
}

// Time Constants
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000
}

// Achievement Types
export const ACHIEVEMENT_TYPES = {
  FIRST_BLOOD: { name: 'First Blood', description: 'Solved your first problem', points: 10 },
  STREAK_MASTER: { name: 'Streak Master', description: 'Maintained 10+ day streak', points: 25 },
  SPEED_DEMON: { name: 'Speed Demon', description: 'Solved 5 problems in one day', points: 20 },
  ACCURACY_KING: { name: 'Accuracy King', description: 'Achieved 90%+ accuracy', points: 30 },
  LANGUAGE_POLYGLOT: { name: 'Language Polyglot', description: 'Solved problems in 5+ languages', points: 35 },
  PROBLEM_SOLVER: { name: 'Problem Solver', description: 'Solved 100+ problems', points: 50 },
  CONTEST_CHAMPION: { name: 'Contest Champion', description: 'Won a coding contest', points: 100 }
}
