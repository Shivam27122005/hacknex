import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { Code } from 'lucide-react';
import { supabase } from '../lib/supabase';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the token from the URL
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        const next = searchParams.get('next') || '/';

        if (type === 'signup' && token) {
          // Verify the email using the token
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup',
            email: email || undefined,
          });

          if (error) throw error;

          setStatus('success');
          setMessage('Your email has been verified successfully!');
          
          // Redirect to login or dashboard after a short delay
          setTimeout(() => {
            navigate('/login', { state: { message: 'Email verified successfully! Please log in.' } });
          }, 3000);
        } else if (type === 'recovery' && token) {
          // Handle password reset verification
          setStatus('verify-password-reset');
          setMessage('Please enter your new password');
        } else {
          setStatus('error');
          setMessage('Invalid verification link. Please try again or request a new one.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(error.message || 'An error occurred during verification. Please try again.');
      }
    };

    // If we have an email in location state, use it
    if (location.state?.email) {
      setEmail(location.state.email);
    }

    verifyEmail();
  }, [location, navigate]);

  const handleResendVerification = async () => {
    try {
      setStatus('verifying');
      setMessage('Sending verification email...');
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (error) throw error;

      setStatus('success');
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error resending verification:', error);
      setStatus('error');
      setMessage(error.message || 'Failed to resend verification email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Code className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">Hack'nhex</span>
          </Link>
        </div>

        {/* Verification Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 backdrop-blur-sm">
          {status === 'verifying' && (
            <div className="animate-pulse">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-900/50">
                <Mail className="h-8 w-8 text-blue-400" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-white">Verifying your email</h2>
              <p className="mt-2 text-sm text-slate-400">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-900/50">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-white">Email Verified!</h2>
              <p className="mt-2 text-sm text-slate-400">{message}</p>
              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Go to Login
                </Link>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-900/50">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-white">Verification Failed</h2>
              <p className="mt-2 text-sm text-slate-400">{message}</p>
              
              {email && (
                <div className="mt-6">
                  <button
                    onClick={handleResendVerification}
                    className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Resend Verification Email
                  </button>
                </div>
              )}
              
              <div className="mt-4">
                <Link
                  to="/register"
                  className="text-sm font-medium text-blue-400 hover:text-blue-300"
                >
                  Back to Registration
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Support */}
        <div className="text-center text-sm text-slate-400">
          <p>Need help? <a href="mailto:support@hacknhex.com" className="font-medium text-blue-400 hover:text-blue-300">Contact support</a></p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
