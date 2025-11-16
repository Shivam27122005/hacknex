# Quick Start Guide - Authentication System

## 🚀 Quick Setup (5 minutes)

### 1. Set Up Supabase
1. Create account at https://supabase.com
2. Create new project (takes ~2 minutes)
3. Go to SQL Editor → Run `/supabase/schema.sql`
4. Get credentials from Settings → API

### 2. Configure Environment
Create `.env` file in project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_ENV=development
VITE_API_URL=http://localhost:5000
```

### 3. Seed Sample Data (Optional)
After creating your account, add test data:
1. Login to your app and copy your user ID from browser console
2. Or run this in Supabase SQL Editor:
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
   ```
3. Open `/supabase/seed.sql`, uncomment the test submissions section
4. Replace `YOUR_USER_ID_HERE` with your actual user ID
5. Run the INSERT statements in SQL Editor
6. Your dashboard will now show sample data!

### 4. Disable Email Confirmation (for testing)
1. Supabase Dashboard → Authentication → Providers
2. Click Email provider
3. **Uncheck "Confirm email"**
4. Save

### 5. Run the App
```bash
npm install
npm run dev
```

Visit: http://localhost:5173

## ✅ Features Implemented

### 1. **User Registration** (`/register`)
- Username validation (unique, min 3 chars)
- Email validation
- Password validation (min 6 chars)
- Password confirmation
- Automatic profile creation in database
- Auto-login after registration (if email confirmation disabled)
- Redirect to email verification page (if email confirmation enabled)

### 2. **User Login** (`/login`)
- Email/password authentication
- Form validation
- Error handling with user-friendly messages
- Remember me option
- Redirect to intended page after login
- Session persistence

### 3. **Forgot Password** (`/forgot-password`)
- Email validation
- Password reset email sent via Supabase
- Success/error feedback
- Link back to login

### 4. **Reset Password** (`/reset-password`)
- Secure password update
- Password confirmation
- Automatic redirect to login after success
- Form validation

### 5. **Email Verification** (`/verify-email`)
- Email confirmation handling
- Resend verification option
- Success/error states
- Dark theme UI

## 🧪 Test the Complete Flow

### Test 1: Registration → Login
```
1. Go to http://localhost:5173/register
2. Fill in:
   - Username: johndoe
   - Email: john@test.com
   - Password: Test123
   - Confirm: Test123
3. Click "Create Account"
4. Should redirect to dashboard automatically
5. Logout
6. Login with same credentials at /login
```

### Test 2: Forgot Password Flow
```
1. Go to http://localhost:5173/forgot-password
2. Enter email: john@test.com
3. Click "Send Reset Instructions"
4. Check email for reset link
5. Click link (opens /reset-password)
6. Enter new password
7. Login with new password
```

### Test 3: Duplicate Username Prevention
```
1. Try to register with existing username
2. Should show error: "Username is already taken"
```

### Test 4: Invalid Credentials
```
1. Try to login with wrong password
2. Should show: "Invalid email or password"
```

## 📊 Database Structure

After registration, check Supabase tables:

### `auth.users` (Supabase Auth)
- id, email, encrypted_password
- email_confirmed_at
- created_at, updated_at

### `public.users` (Your App Data)
- id (references auth.users)
- username, email, name
- avatar_url, bio
- problems_solved, rating, rank
- streak, accuracy
- etc.

## 🔐 Security Features

✅ Row Level Security (RLS) enabled
✅ Secure password hashing (Supabase Auth)
✅ Email verification support
✅ Password reset with secure tokens
✅ CSRF protection
✅ Session management
✅ Database triggers for profile creation

## 🎨 UI Components

All pages use consistent dark theme:
- Background: `bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`
- Cards: `bg-slate-800/50 border border-slate-700`
- Buttons: `bg-blue-600 hover:bg-blue-700`
- Inputs: `bg-slate-900/50 border-slate-600`
- Text: `text-white`, `text-slate-400`

## 🛠️ API Functions Available

### In Components (via `useUser()` hook):
```javascript
const { 
  user,              // Current user object
  isAuthenticated,   // Boolean
  isLoading,         // Boolean
  register,          // Function(credentials)
  login,             // Function(credentials)
  logout,            // Function()
  resetPassword,     // Function(email)
  updatePassword,    // Function(newPassword)
  updateProfile      // Function(profileData)
} = useUser()
```

### Usage Examples:
```javascript
// Register
const result = await register({
  username: 'johndoe',
  email: 'john@test.com',
  password: 'Test123'
})

// Login
const result = await login({
  email: 'john@test.com',
  password: 'Test123'
})

// Reset Password
const result = await resetPassword('john@test.com')

// Update Password
const result = await updatePassword('NewPassword123')
```

## 🐛 Common Issues & Solutions

### "Missing Supabase environment variables"
→ Create `.env` file with correct values
→ Restart dev server (`Ctrl+C` then `npm run dev`)

### "Invalid login credentials"
→ Check if email confirmation is enabled
→ Verify account if needed
→ Check password is correct

### User created but can't see in database
→ Check `auth.users` AND `public.users` tables
→ Verify trigger `on_auth_user_created` exists

### CORS errors
→ Use `http://localhost:5173` not `127.0.0.1`
→ Check Supabase URL configuration

### Email not received
→ Check spam folder
→ Disable email confirmation for testing
→ Use real email provider in production

## 📝 Code Files Modified/Created

### Modified:
- ✅ `/src/context/UserContext.jsx` - Added register, resetPassword, updatePassword functions
- ✅ `/src/pages/Login.jsx` - Updated forgot password link
- ✅ `/src/pages/Register.jsx` - Connected to real register function
- ✅ `/src/pages/VerifyEmail.jsx` - Updated theme
- ✅ `/src/App.jsx` - Added new routes

### Created:
- ✅ `/src/pages/ForgotPassword.jsx` - Password reset request page
- ✅ `/src/pages/ResetPassword.jsx` - Password update page
- ✅ `.env.example` - Environment variable template
- ✅ `AUTHENTICATION_SETUP.md` - Detailed setup guide
- ✅ `QUICKSTART.md` - This file

## 🚀 Next Steps

1. ✅ Authentication is working
2. ⏭️ Seed database with problems: Run `/supabase/seed.sql`
3. ⏭️ Test problem solving flow
4. ⏭️ Set up code execution backend
5. ⏭️ Deploy to production

## 💡 Pro Tips

- Use browser DevTools → Application → Local Storage to see Supabase session
- Check Network tab to see API calls to Supabase
- Use Supabase Dashboard → Logs for debugging
- Enable email confirmation in production
- Set up custom SMTP for production emails

## 📞 Need Help?

1. Check browser console for errors
2. Check Supabase logs in dashboard
3. Review `AUTHENTICATION_SETUP.md` for detailed guide
4. Check Supabase docs: https://supabase.com/docs

## 📊 Dashboard Features

The dashboard displays real-time data from the database:

### Stats Cards
- **Problems Solved**: Total count of accepted submissions
- **Current Streak**: Consecutive days with submissions (auto-calculated)
- **Accuracy Rate**: Percentage of accepted submissions
- **Time Spent**: Estimated coding time based on submission patterns

### Recent Problems Section
- Shows your last 5 submissions with status (solved/attempted)
- Click to review or continue solving problems
- Empty state shown when no submissions exist

### Category Progress
- Tracks solved problems per category (Arrays, Strings, Trees, etc.)
- Progress bars show completion percentage
- Data fetched using optimized SQL functions

### Database Functions Used
```sql
-- Get category progress for user
get_user_category_progress(user_id)

-- Calculate user streak
calculate_user_streak(user_id)

-- Update user stats (called automatically on new submission)
update_user_stats()
```

All data is automatically updated via database triggers when you submit solutions!

---

**Status:** ✅ Fully Functional
**Last Updated:** November 2024
