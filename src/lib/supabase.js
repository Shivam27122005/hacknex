import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Present' : 'Missing');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  console.error('Current env values:', {
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'exists' : 'missing'
  });
}

// Create and export the Supabase client with safe defaults
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
}) : null;

if (!supabase) {
  console.error('Failed to initialize Supabase client. Check environment variables.');
}

// Test the connection only if client is initialized
if (supabase) {
  supabase.auth.getSession()
    .then(({ data: { session } }) => {
      console.log('Supabase connection successful. Session:', session ? 'Active' : 'No active session');
    })
    .catch(error => {
      console.error('Supabase connection error:', error);
    });
}

// Helper function to get user session
export const getSession = async () => {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
