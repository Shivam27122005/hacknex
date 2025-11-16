# Authentication Setup Guide

This guide will help you set up the complete authentication system for Hack'nhex with Supabase.

## Prerequisites

- Node.js installed (v14 or higher)
- A Supabase account (https://supabase.com)
- Git installed

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose your organization and fill in project details:
   - Project name: `hacknhex` (or any name you prefer)
   - Database password: Create a strong password
   - Region: Choose closest to your location
   - Pricing plan: Free tier is fine for development

4. Wait for the project to be created (takes ~2 minutes)

## Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `/supabase/schema.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create all necessary tables, triggers, and Row Level Security policies.

## Step 3: Configure Authentication Settings

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. **Email Provider:**
   - Make sure "Email" is enabled
   - **IMPORTANT for testing:** Disable "Confirm email" if you want to test without email verification
   - For production, keep email confirmation enabled

3. **URL Configuration:**
   - Go to **Authentication** > **URL Configuration**
   - Set **Site URL** to: `http://localhost:5173` (for development)
   - Add **Redirect URLs:**
     - `http://localhost:5173/verify-email`
     - `http://localhost:5173/reset-password`
     - `http://localhost:5173/dashboard`

4. **Email Templates (Optional but Recommended):**
   - Go to **Authentication** > **Email Templates**
   - Customize "Confirm signup" template
   - Customize "Reset password" template

## Step 4: Get Your Supabase Credentials

1. In Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 5: Configure Environment Variables

1. In your project root, create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_APP_ENV=development
   VITE_API_URL=http://localhost:5000
   ```

3. **NEVER commit the `.env` file to Git!** It's already in `.gitignore`

## Step 6: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

## Step 7: Run the Application

Open two terminal windows:

**Terminal 1 - Frontend:**
```bash
npm run dev
```
This starts the Vite dev server at `http://localhost:5173`

**Terminal 2 - Backend (Optional):**
```bash
cd server
npm run dev
```
This starts the Express backend at `http://localhost:5000`

## Step 8: Test the Authentication Flow

### Sign Up (Registration)
1. Navigate to `http://localhost:5173`
2. Click "Sign up for free"
3. Fill in the registration form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test123`
   - Confirm Password: `Test123`
4. Click "Create Account"

**If email confirmation is DISABLED:**
- You'll be automatically logged in and redirected to the dashboard

**If email confirmation is ENABLED:**
- Check your email for the verification link
- Click the link to verify your account
- Then you can log in

### Sign In
1. Go to `http://localhost:5173/login`
2. Enter your credentials
3. Click "Sign in"

### Forgot Password
1. Go to `http://localhost:5173/login`
2. Click "Forgot your password?"
3. Enter your email address
4. Click "Send Reset Instructions"
5. Check your email for the reset link
6. Click the link and enter a new password

## Verify Database Setup

You can check if everything is working by:

1. Go to Supabase dashboard > **Table Editor**
2. You should see these tables:
   - `users`
   - `problems`
   - `submissions`
   - `user_problem_status`
   - `categories`
   - `achievements`
   - `user_achievements`

3. After registering a user, check the `users` table to see the new user entry

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists in the root directory
- Verify the variable names start with `VITE_`
- Restart the dev server after adding environment variables

### "Invalid login credentials"
- If email confirmation is enabled, check your email and verify your account first
- Make sure you're using the correct email and password
- Passwords are case-sensitive

### Email not received
- Check your spam/junk folder
- In Supabase dashboard, go to **Authentication** > **Users** to see if the user was created
- For development, consider disabling email confirmation in **Authentication** > **Providers**

### User created but profile not showing
- Check the `handle_new_user()` trigger is working
- Go to Supabase SQL Editor and verify the trigger exists
- Check browser console for errors

### CORS errors
- Make sure you're accessing the app at `http://localhost:5173` (not `127.0.0.1`)
- Check that the site URL in Supabase matches your dev server URL

## Security Notes

### Development vs Production

**Development Mode:**
- You can disable email confirmation for easier testing
- Use test email addresses
- Keep detailed error messages enabled

**Production Mode:**
- **ALWAYS enable email confirmation**
- Set up proper SMTP for reliable email delivery
- Update Site URL and Redirect URLs to your production domain
- Enable Row Level Security (already enabled in schema)
- Use environment-specific API keys

### Row Level Security (RLS)

The schema includes RLS policies that:
- Allow users to only view and edit their own data
- Prevent unauthorized access to submissions
- Allow public access to problems and leaderboards

These are already configured in the `schema.sql` file.

## Advanced Configuration

### Custom Email Templates

1. Go to **Authentication** > **Email Templates**
2. Customize the HTML/CSS for:
   - Confirmation emails
   - Password reset emails
   - Magic link emails

### OAuth Providers (Optional)

To add GitHub, Google, or other OAuth providers:

1. Go to **Authentication** > **Providers**
2. Enable the provider you want (e.g., GitHub)
3. Follow the provider-specific setup instructions
4. Add the callback URL to your OAuth app settings

### Email Rate Limiting

Supabase has built-in rate limiting:
- 4 emails per hour per user for password reset
- Configurable in **Authentication** > **Rate Limits**

## Next Steps

After authentication is working:
1. Seed the database with sample problems (use `/supabase/seed.sql`)
2. Test the problem-solving workflow
3. Set up code execution backend (if needed)
4. Configure production deployment

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check Supabase logs in the dashboard
3. Review the Supabase documentation: https://supabase.com/docs
4. Check the project README for additional information

---

**Last Updated:** November 2024
**Supabase Version:** Latest
**React Version:** 18.x
