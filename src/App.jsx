import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const Landing = lazy(() => import('./pages/Landing'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ProblemList = lazy(() => import('./pages/ProblemList'))
const ProblemDetail = lazy(() => import('./pages/ProblemDetail'))
const Profile = lazy(() => import('./pages/Profile'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'))
const Submissions = lazy(() => import('./pages/Submissions'))

// Layout component for authenticated pages
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors duration-300">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

// Layout component for public pages (login/register)
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-secondary-50">
      {children}
    </div>
  )
}

// Routes component that uses authentication context
const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary-50 dark:bg-secondary-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    }>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={
          !isAuthenticated ? (
            <PublicLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <Landing />
              </Suspense>
            </PublicLayout>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } />

        {/* Public Routes */}
        <Route path="/login" element={
          !isAuthenticated ? (
            <PublicLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <Login />
              </Suspense>
            </PublicLayout>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } />
        
        <Route path="/register" element={
          !isAuthenticated ? (
            <PublicLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <Register />
              </Suspense>
            </PublicLayout>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } />
        
        <Route path="/forgot-password" element={
          !isAuthenticated ? (
            <PublicLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <ForgotPassword />
              </Suspense>
            </PublicLayout>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } />
        
        <Route path="/reset-password" element={
          <PublicLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <ResetPassword />
            </Suspense>
          </PublicLayout>
        } />
        
        <Route path="/verify-email" element={
          <PublicLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <VerifyEmail />
            </Suspense>
          </PublicLayout>
        } />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <Dashboard />
              </Suspense>
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/problems" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <ProblemList />
              </Suspense>
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/problems/:id" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <ProblemDetail />
              </Suspense>
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <Profile />
              </Suspense>
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/submissions" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <Submissions />
              </Suspense>
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
      </Routes>
    </Suspense>
  );
}

const App = () => {
  useEffect(() => {
    console.log('App: Component mounted')
    return () => {
      console.log('App: Component unmounting')
    }
  }, [])

  console.log('App: Rendering...')
  
  return (
    <UserProvider>
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </UserProvider>
  )
}

export default App
