// Import Requires
const express = require('express');
const middleware = require('../middleware');

// Import Models
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// Initialize Express Router
const router = express.Router({ mergeParams: true });

// NEW - Form to add new Comment
router.get('/new', middleware.isLoggedIn, (req, res) => {
  // Find campground by Id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      // Render new comments template
      res.render('comments/new', { campground });
    }
  });
});

// CREATE - Add new Comment
router.post('/', middleware.isLoggedIn, (req, res) => {
  // Find campground by Id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // Create a new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          // Flash error message
          req.flash('error', 'Something went wrong!');

          // Go Back
          res.redirect('back');
        } else {
          // Add the user data to comment
          comment.author = { id: req.user._id, username: req.user.username };

          // Save the comment
          comment.save();

          // Add comment to campground
          campground.comments.push(comment);

          // Save the campground
          campground.save();

          // Flash success message
          req.flash('success', 'Successfully added your comment.');

          // Redirect to the campground
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

// EDIT - Form to edit an existing comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  // Find the comment by Id
  Comment.findById(req.params.comment_id, (err, comment) => {
    if (err) {
      res.redirect('back');
    } else {
      // Render comment edit template
      res.render('comments/edit', { campground_id: req.params.id, comment });
    }
  });
});

// UPDATE - Update the comment
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  // Find and update the comment
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// Destroy - Delete an existing comment
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  // Find and delete the comment
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) {
      res.redirect('back');
    } else {
      // Flash success message
      req.flash('success', 'Comment successfully deleted.');

      // Redirect to Campground Show
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// Export the router
module.exports = router;
