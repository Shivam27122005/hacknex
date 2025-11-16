-- =====================================================
-- HACKNHEX SUPABASE SCHEMA
-- Complete database schema for the coding platform
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE (extends Supabase Auth)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rank TEXT DEFAULT 'Bronze',
  rating INTEGER DEFAULT 0,
  problems_solved INTEGER DEFAULT 0,
  total_submissions INTEGER DEFAULT 0,
  accuracy NUMERIC(5,2) DEFAULT 0.00,
  streak INTEGER DEFAULT 0,
  languages TEXT[] DEFAULT ARRAY['JavaScript'],
  github_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. PROBLEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.problems (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  examples JSONB DEFAULT '[]'::jsonb,
  constraints TEXT[] DEFAULT ARRAY[]::TEXT[],
  related_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
  companies TEXT[] DEFAULT ARRAY[]::TEXT[],
  acceptance NUMERIC(5,2) DEFAULT 0.00,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  test_cases JSONB DEFAULT '[]'::jsonb,
  starter_code JSONB DEFAULT '{}'::jsonb,
  solution JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  problem_id INTEGER REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
  problem_title TEXT NOT NULL,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compilation_error', 'pending')),
  execution_time INTEGER,
  memory_usage NUMERIC(10,2),
  test_cases_passed INTEGER DEFAULT 0,
  total_test_cases INTEGER DEFAULT 0,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. USER_PROBLEM_STATUS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_problem_status (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  problem_id INTEGER REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('solved', 'attempted', 'not_attempted')),
  attempts INTEGER DEFAULT 0,
  last_attempted_at TIMESTAMP WITH TIME ZONE,
  solved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- =====================================================
-- 5. CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  points INTEGER DEFAULT 0,
  criteria JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. USER_ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id INTEGER REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- =====================================================
-- 8. LEADERBOARD TABLE (Materialized View)
-- =====================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS public.leaderboard AS
SELECT 
  u.id,
  u.username,
  u.name,
  u.avatar_url,
  u.rating,
  u.problems_solved,
  u.accuracy,
  u.rank,
  ROW_NUMBER() OVER (ORDER BY u.rating DESC, u.problems_solved DESC) as position
FROM public.users u
ORDER BY u.rating DESC, u.problems_solved DESC;

-- Index for leaderboard
CREATE UNIQUE INDEX IF NOT EXISTS leaderboard_id_idx ON public.leaderboard(id);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_rating ON public.users(rating DESC);
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON public.problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_category ON public.problems(category);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_problem_id ON public.submissions(problem_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
CREATE INDEX IF NOT EXISTS idx_user_problem_status_user_id ON public.user_problem_status(user_id);
CREATE INDEX IF NOT EXISTS idx_user_problem_status_problem_id ON public.user_problem_status(problem_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update user stats after submission
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update problems_solved and total_submissions
  UPDATE public.users
  SET 
    total_submissions = (SELECT COUNT(*) FROM public.submissions WHERE user_id = NEW.user_id),
    problems_solved = (SELECT COUNT(DISTINCT problem_id) FROM public.submissions WHERE user_id = NEW.user_id AND status = 'accepted'),
    accuracy = CASE 
      WHEN (SELECT COUNT(*) FROM public.submissions WHERE user_id = NEW.user_id) > 0 
      THEN ROUND((SELECT COUNT(*)::NUMERIC FROM public.submissions WHERE user_id = NEW.user_id AND status = 'accepted') * 100.0 / (SELECT COUNT(*) FROM public.submissions WHERE user_id = NEW.user_id), 2)
      ELSE 0 
    END,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update problem acceptance rate
CREATE OR REPLACE FUNCTION update_problem_acceptance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.problems
  SET 
    acceptance = CASE 
      WHEN (SELECT COUNT(*) FROM public.submissions WHERE problem_id = NEW.problem_id) > 0 
      THEN ROUND((SELECT COUNT(*)::NUMERIC FROM public.submissions WHERE problem_id = NEW.problem_id AND status = 'accepted') * 100.0 / (SELECT COUNT(*) FROM public.submissions WHERE problem_id = NEW.problem_id), 2)
      ELSE 0 
    END,
    updated_at = NOW()
  WHERE id = NEW.problem_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user_problem_status
CREATE OR REPLACE FUNCTION update_user_problem_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Use security definer to bypass RLS for this function
  INSERT INTO public.user_problem_status (user_id, problem_id, status, attempts, last_attempted_at, solved_at)
  VALUES (
    NEW.user_id, 
    NEW.problem_id, 
    CASE WHEN NEW.status = 'accepted' THEN 'solved' ELSE 'attempted' END,
    1,
    NOW(),
    CASE WHEN NEW.status = 'accepted' THEN NOW() ELSE NULL END
  )
  ON CONFLICT (user_id, problem_id) 
  DO UPDATE SET 
    status = CASE 
      WHEN NEW.status = 'accepted' THEN 'solved'
      WHEN EXCLUDED.status = 'solved' THEN 'solved'
      ELSE 'attempted'
    END,
    attempts = user_problem_status.attempts + 1,
    last_attempted_at = NOW(),
    solved_at = CASE WHEN NEW.status = 'accepted' THEN NOW() ELSE user_problem_status.solved_at END,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user creation from auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_submission_created ON public.submissions;
DROP TRIGGER IF EXISTS on_submission_for_problem ON public.submissions;
DROP TRIGGER IF EXISTS on_submission_for_status ON public.submissions;

-- Trigger to create user profile on auth signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update user stats after submission
CREATE TRIGGER on_submission_created
  AFTER INSERT ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- Trigger to update problem acceptance
CREATE TRIGGER on_submission_for_problem
  AFTER INSERT ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION update_problem_acceptance();

-- Trigger to update user_problem_status
CREATE TRIGGER on_submission_for_status
  AFTER INSERT ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION update_user_problem_status();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_problem_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Anyone can view problems" ON public.problems;
DROP POLICY IF EXISTS "Users can view own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can insert own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can view own status" ON public.user_problem_status;
DROP POLICY IF EXISTS "Users can insert own status" ON public.user_problem_status;
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can view all user achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON public.user_achievements;

-- Users table policies
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Problems table policies
CREATE POLICY "Anyone can view problems" ON public.problems FOR SELECT USING (true);

-- Submissions table policies
CREATE POLICY "Users can view own submissions" ON public.submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own submissions" ON public.submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User problem status policies
CREATE POLICY "Users can view own status" ON public.user_problem_status FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own status" ON public.user_problem_status FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Functions can insert status" ON public.user_problem_status;
CREATE POLICY "Functions can insert status" ON public.user_problem_status FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT INSERT ON public.user_problem_status TO authenticated;

-- Categories policies
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);

-- Achievements policies
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- User achievements policies
CREATE POLICY "Users can view all user achievements" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Users can insert own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- ADDITIONAL HELPER FUNCTIONS
-- =====================================================

-- Function to get user category progress
CREATE OR REPLACE FUNCTION get_user_category_progress(p_user_id UUID)
RETURNS TABLE (
  name TEXT,
  solved BIGINT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.category as name,
    COUNT(DISTINCT CASE WHEN ups.status = 'solved' THEN ups.problem_id END) as solved,
    COUNT(DISTINCT p.id) as count
  FROM public.problems p
  LEFT JOIN public.user_problem_status ups ON p.id = ups.problem_id AND ups.user_id = p_user_id
  GROUP BY p.category
  ORDER BY p.category;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get activity data for charts
CREATE OR REPLACE FUNCTION get_user_activity(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  date DATE,
  submissions_count BIGINT,
  problems_solved BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(s.submitted_at) as date,
    COUNT(*) as submissions_count,
    COUNT(DISTINCT CASE WHEN s.status = 'accepted' THEN s.problem_id END) as problems_solved
  FROM public.submissions s
  WHERE s.user_id = p_user_id
    AND s.submitted_at >= CURRENT_DATE - INTERVAL '1 day' * p_days
  GROUP BY DATE(s.submitted_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get language stats
CREATE OR REPLACE FUNCTION get_user_language_stats(p_user_id UUID)
RETURNS TABLE (
  language TEXT,
  count BIGINT,
  accepted BIGINT,
  accuracy NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.language,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE s.status = 'accepted') as accepted,
    ROUND(
      (COUNT(*) FILTER (WHERE s.status = 'accepted')::NUMERIC / COUNT(*)) * 100, 
      2
    ) as accuracy
  FROM public.submissions s
  WHERE s.user_id = p_user_id
  GROUP BY s.language
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get streak calculation
CREATE OR REPLACE FUNCTION calculate_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  streak INTEGER := 0;
  current_date DATE := CURRENT_DATE;
  check_date DATE;
BEGIN
  -- Check if user has activity today or yesterday
  IF NOT EXISTS (
    SELECT 1 FROM public.submissions 
    WHERE user_id = p_user_id 
      AND DATE(submitted_at) >= CURRENT_DATE - INTERVAL '1 day'
  ) THEN
    RETURN 0;
  END IF;
  
  -- Count consecutive days
  FOR check_date IN 
    SELECT DISTINCT DATE(submitted_at) 
    FROM public.submissions 
    WHERE user_id = p_user_id 
    ORDER BY DATE(submitted_at) DESC
  LOOP
    IF check_date = current_date - streak THEN
      streak := streak + 1;
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  RETURN streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user streak (call this daily or on submission)
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET streak = calculate_user_streak(p_user_id),
      updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- Avatar storage policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects 
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload avatars" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own avatars" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own avatars" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
