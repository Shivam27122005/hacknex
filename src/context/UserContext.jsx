import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getUserProfile, getUserStats } from '../services/supabaseService';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!supabase) {
          console.error('Supabase client not initialized');
          setIsLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user profile from database
          const profileResult = await getUserProfile(session.user.id);
          
          if (profileResult.success) {
            setUser(profileResult.data);
            setIsAuthenticated(true);
          } else {
            // Create default user profile if doesn't exist
            const defaultUser = {
              id: session.user.id,
              email: session.user.email,
              username: session.user.email.split('@')[0],
              name: session.user.user_metadata?.name || session.user.email.split('@')[0],
              avatar_url: session.user.user_metadata?.avatar_url || '',
              problems_solved: 0,
              total_submissions: 0,
              accuracy: 0,
              streak: 0,
              rating: 0,
              rank: 'Beginner'
            };
            setUser(defaultUser);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    if (!supabase) {
      console.error('Cannot set up auth listener: Supabase client not initialized');
      return;
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profileResult = await getUserProfile(session.user.id);
        if (profileResult.success) {
          setUser(profileResult.data);
          setIsAuthenticated(true);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Register function
  const register = async (credentials) => {
    try {
      setIsLoading(true);
      
      if (!supabase) {
        throw new Error('Database connection not available. Please refresh the page.');
      }
      
      if (!credentials.email || !credentials.password || !credentials.username) {
        throw new Error('Please fill in all required fields');
      }

      // Check if username is already taken
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', credentials.username)
        .single();

      if (existingUser) {
        throw new Error('Username is already taken');
      }

      // Sign up with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            username: credentials.username,
            name: credentials.username
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Registration failed. Please try again.');
      }

      // Check if email confirmation is required
      if (authData.session) {
        // User is automatically logged in (email confirmation disabled)
        const profileResult = await getUserProfile(authData.user.id);
        
        if (profileResult.success) {
          setUser(profileResult.data);
          setIsAuthenticated(true);
          return { success: true, data: profileResult.data, emailConfirmationRequired: false };
        }
      } else {
        // Email confirmation required
        return { 
          success: true, 
          emailConfirmationRequired: true,
          message: 'Please check your email to confirm your account.' 
        };
      }

      return { success: true, data: authData.user };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      
      if (!supabase) {
        throw new Error('Database connection not available. Please refresh the page.');
      }
      
      if (!credentials.email || !credentials.password) {
        throw new Error('Please enter both email and password');
      }

      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (authError) {
        // Provide user-friendly error messages
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please try again.');
        } else if (authError.message.includes('Email not confirmed')) {
          throw new Error('Please confirm your email address before signing in.');
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Login failed. Please try again.');
      }

      // Fetch user profile
      const profileResult = await getUserProfile(authData.user.id);
      
      if (profileResult.success) {
        setUser(profileResult.data);
        setIsAuthenticated(true);
        return { success: true, data: profileResult.data };
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      setIsLoading(true);
      
      if (!email) {
        throw new Error('Please enter your email address');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return { 
        success: true, 
        message: 'Password reset instructions have been sent to your email.' 
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send password reset email.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Update password function (after reset)
  const updatePassword = async (newPassword) => {
    try {
      setIsLoading(true);
      
      if (!newPassword) {
        throw new Error('Please enter a new password');
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      return { 
        success: true, 
        message: 'Password updated successfully.' 
      };
    } catch (error) {
      console.error('Password update error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to update password.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const { updateUserProfile } = await import('../services/supabaseService');
      const result = await updateUserProfile(user.id, profileData);
      
      if (result.success) {
        setUser(result.data);
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to update profile. Please try again.' 
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    resetPassword,
    updatePassword,
    updateProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
