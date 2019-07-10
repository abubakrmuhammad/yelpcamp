// Import Requires
const express = require('express');
const passport = require('passport');

// Import Models
const User = require('../models/user');

// Initialize Express Router
const router = express.Router();

// Root route
router.get('/', (req, res) => {
  // Check if user is logged in
  if (req.isAuthenticated()) {
    // Redirect to campgrounds
    return res.redirect('/campgrounds');
  }

  // Render landing template
  res.render('landing');
});

// Show Registeration Form
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Register a new user
router.post('/register', (req, res) => {
  // New User
  const newUser = new User({ username: req.body.username });
  // Use password
  const password = req.body.password;

  // Register new User
  User.register(newUser, password, (err, user) => {
    if (err) {
      // Flash error message
      req.flash('error', err.message);

      // Redirect
      return res.redirect('/register');
    } else {
      // Authenticate the user
      passport.authenticate('local')(req, res, () => {
        // Flash success message
        req.flash('success', `Welcome to YelpCamp ${user.username}`);

        // Redirect to campgrounds
        res.redirect('/campgrounds');
      });
    }
  });
});

// Show the login form
router.get('/login', (req, res) => {
  // Render login form
  res.render('users/login');
});

// Log In the User
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  })
);

// Log Out the User
router.get('/logout', (req, res) => {
  // Logout
  req.logout();

  // Flash success message
  req.flash('success', 'Successfully Logged You Out!');

  // Redirect to campgrounds
  res.redirect('/campgrounds');
});

// Export the router
module.exports = router;
