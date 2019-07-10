// Import Models
const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middleware = {
  checkCampgroundOwnership: function(req, res, next) {
    // Is user logged in?
    if (req.isAuthenticated()) {
      // Find the relevant campground
      Campground.findById(req.params.id, (err, campground) => {
        if (err) {
          // Flash error message
          req.flash('error', 'Campground Not Found!');

          // Go Back
          res.redirect('back');
        } else {
          // Is user the author?
          if (campground.author.id.equals(req.user._id)) {
            // Move on
            next();
          } else {
            // Flash error message
            req.flash('error', "You don't have permission to do that!");

            // Go Back
            res.redirect('back');
          }
        }
      });
    } else {
      // Flash error message
      req.flash('error', 'You need to be logged in to do that!');

      // Go Back
      res.redirect('back');
    }
  },
  checkCommentOwnership: function(req, res, next) {
    // Is user logged in?
    if (req.isAuthenticated()) {
      // Find the relevant campground
      Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
          res.redirect('back');
        } else {
          // Is user the author?
          if (comment.author.id.equals(req.user._id)) {
            // Move on
            next();
          } else {
            // Flash error message
            req.flash('error', "You don't have permission to do that!");

            // Go Back
            res.redirect('back');
          }
        }
      });
    } else {
      // Flash error message
      req.flash('error', 'You need to be logged in to do that!');

      // Go Back
      res.redirect('back');
    }
  },
  isLoggedIn: function(req, res, next) {
    // Move on if the user is authenticated
    if (req.isAuthenticated()) {
      return next();
    }
    // Flash error message
    req.flash('error', 'You need to be logged in to do that!');

    // Redirect to login
    res.redirect('/login');
  }
};

// Export the middlewares
module.exports = middleware;
