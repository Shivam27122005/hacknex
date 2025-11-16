const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const router = express.Router();

// MySQL connection
const db = require('./db');

// JWT secret - should be in environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
const REFRESH_TOKEN_EXPIRES_IN = '30d';

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Generate refresh token
const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

// Generate email verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate password reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// =====================================================
// MIDDLEWARE
// =====================================================

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.userId = decoded.userId;
  next();
};

// =====================================================
// ROUTES
// =====================================================

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    // Check if user already exists
    db.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username],
      async (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Server error' });
        }

        if (results.length > 0) {
          const existingUser = results[0];
          db.query('SELECT email FROM users WHERE id = ?', [existingUser.id], (err, userResults) => {
            if (userResults[0].email === email) {
              return res.status(400).json({ error: 'Email already registered' });
            } else {
              return res.status(400).json({ error: 'Username already taken' });
            }
          });
          return;
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Generate verification token
        const verificationToken = generateVerificationToken();
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create user
        const userId = crypto.randomUUID();
        db.query(
          `INSERT INTO users (id, username, email, password_hash, name, email_verified) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [userId, username, email, passwordHash, username, false],
          (err) => {
            if (err) {
              console.error('Error creating user:', err);
              return res.status(500).json({ error: 'Failed to create user' });
            }

            // Create verification token
            db.query(
              'INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
              [userId, verificationToken, tokenExpiry],
              (err) => {
                if (err) {
                  console.error('Error creating verification token:', err);
                }
              }
            );

            // Generate JWT tokens
            const token = generateToken(userId);
            const refreshToken = generateRefreshToken();

            // Save session
            const sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            db.query(
              `INSERT INTO user_sessions (user_id, token, refresh_token, ip_address, user_agent, expires_at) 
               VALUES (?, ?, ?, ?, ?, ?)`,
              [userId, token, refreshToken, req.ip, req.headers['user-agent'], sessionExpiry],
              (err) => {
                if (err) {
                  console.error('Error creating session:', err);
                }
              }
            );

            // Return user data and tokens
            res.status(201).json({
              success: true,
              message: 'User registered successfully',
              data: {
                user: {
                  id: userId,
                  username,
                  email,
                  name: username,
                  emailVerified: false
                },
                token,
                refreshToken,
                emailConfirmationRequired: true
              }
            });

            // TODO: Send verification email
            // sendVerificationEmail(email, verificationToken);
          }
        );
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Server error' });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];

        // Verify password
        const isValidPassword = await comparePassword(password, user.password_hash);
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if email is verified (optional - can disable for testing)
        // if (!user.email_verified) {
        //   return res.status(403).json({ error: 'Please verify your email before signing in' });
        // }

        // Generate tokens
        const token = generateToken(user.id);
        const refreshToken = generateRefreshToken();

        // Save session
        const sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        db.query(
          `INSERT INTO user_sessions (user_id, token, refresh_token, ip_address, user_agent, expires_at) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [user.id, token, refreshToken, req.ip, req.headers['user-agent'], sessionExpiry]
        );

        // Return user data without password
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          avatar_url: user.avatar_url,
          bio: user.bio,
          location: user.location,
          rank: user.rank,
          rating: user.rating,
          problems_solved: user.problems_solved,
          total_submissions: user.total_submissions,
          accuracy: user.accuracy,
          streak: user.streak,
          github_url: user.github_url,
          linkedin_url: user.linkedin_url,
          website_url: user.website_url
        };

        res.json({
          success: true,
          data: {
            user: userData,
            token,
            refreshToken
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify email
router.post('/verify-email', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Verification token required' });
    }

    // Find token
    db.query(
      'SELECT * FROM email_verification_tokens WHERE token = ? AND expires_at > NOW()',
      [token],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Server error' });
        }

        if (results.length === 0) {
          return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const verificationRecord = results[0];

        // Update user
        db.query(
          'UPDATE users SET email_verified = TRUE, email_verified_at = NOW() WHERE id = ?',
          [verificationRecord.user_id],
          (err) => {
            if (err) {
              console.error('Error updating user:', err);
              return res.status(500).json({ error: 'Failed to verify email' });
            }

            // Delete verification token
            db.query('DELETE FROM email_verification_tokens WHERE id = ?', [verificationRecord.id]);

            res.json({
              success: true,
              message: 'Email verified successfully'
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Request password reset
router.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user
    db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Server error' });
      }

      // Always return success even if email doesn't exist (security)
      if (results.length === 0) {
        return res.json({
          success: true,
          message: 'If the email exists, a password reset link has been sent'
        });
      }

      const user = results[0];
      const resetToken = generateResetToken();
      const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Save reset token
      db.query(
        'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
        [resetToken, tokenExpiry, user.id],
        (err) => {
          if (err) {
            console.error('Error saving reset token:', err);
            return res.status(500).json({ error: 'Server error' });
          }

          // TODO: Send reset email
          // sendPasswordResetEmail(email, resetToken);

          res.json({
            success: true,
            message: 'Password reset instructions have been sent to your email'
          });
        }
      );
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Find user with valid token
    db.query(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token],
      async (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Server error' });
        }

        if (results.length === 0) {
          return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        const user = results[0];
        const passwordHash = await hashPassword(newPassword);

        // Update password and clear reset token
        db.query(
          'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
          [passwordHash, user.id],
          (err) => {
            if (err) {
              console.error('Error updating password:', err);
              return res.status(500).json({ error: 'Failed to update password' });
            }

            // Invalidate all existing sessions
            db.query('DELETE FROM user_sessions WHERE user_id = ?', [user.id]);

            res.json({
              success: true,
              message: 'Password updated successfully'
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  try {
    db.query(
      'SELECT id, username, email, name, avatar_url, bio, location, `rank`, rating, problems_solved, total_submissions, accuracy, streak, github_url, linkedin_url, website_url FROM users WHERE id = ?',
      [req.userId],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Server error' });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.json({
          success: true,
          data: results[0]
        });
      }
    );
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Delete session
    db.query('DELETE FROM user_sessions WHERE token = ?', [token], (err) => {
      if (err) {
        console.error('Error deleting session:', err);
        return res.status(500).json({ error: 'Server error' });
      }

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Refresh token
router.post('/refresh-token', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    // Find session
    db.query(
      'SELECT user_id FROM user_sessions WHERE refresh_token = ? AND expires_at > NOW()',
      [refreshToken],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Server error' });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }

        const session = results[0];
        const newToken = generateToken(session.user_id);
        const newRefreshToken = generateRefreshToken();

        // Update session
        db.query(
          'UPDATE user_sessions SET token = ?, refresh_token = ?, updated_at = NOW() WHERE refresh_token = ?',
          [newToken, newRefreshToken, refreshToken],
          (err) => {
            if (err) {
              console.error('Error updating session:', err);
              return res.status(500).json({ error: 'Server error' });
            }

            res.json({
              success: true,
              data: {
                token: newToken,
                refreshToken: newRefreshToken
              }
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = { router, authenticateToken };
