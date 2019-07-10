// Import Requires
const express = require('express');
const middleware = require('../middleware');

// Import Models
const Campground = require('../models/campground');

// Initialize Express Router
const router = express.Router();

// INDEX - Show all Campgrounds
router.get('/', (req, res) => {
  // Get campgrounds from DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      // Render Campgrounds Template
      res.render('campgrounds/index', { campgrounds });
    }
  });
});

// NEW - Form to add new Campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// CREATE - Add new Campground
router.post('/', middleware.isLoggedIn, (req, res) => {
  // Get data from form
  const { name, price, image, description } = req.body;

  // Get user data
  const author = { id: req.user._id, username: req.user.username };

  // Create new Campground
  const newCampground = { name, price, image, description, author };

  // Add to campground to DB
  Campground.create(newCampground, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      // Redirect to campgrounds page
      res.redirect('/campgrounds');
    }
  });
});

// SHOW - Show a specific Campground
router.get('/:id', (req, res) => {
  // Get the campground Id
  const campgroundId = req.params.id;

  // Find the campground by Id
  Campground.findById(campgroundId)
    .populate('comments')
    .exec((err, campground) => {
      if (err) {
        console.log(err);
      } else {
        // Render the show template
        res.render('campgrounds/show', { campground });
      }
    });
});

// EDIT - Form to update an existing Campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  // Get the campground by Id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      // Render the edit template
      res.render('campgrounds/edit', { campground });
    }
  });
});

// UPDATE - Update the existing Campground
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  // Find and update the campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      // Redirect to Show template
      res.redirect(`/campgrounds/${campground._id}`);
    }
  });
});

// DESTROY - Delete an existing Campground
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  // Find and remove the campground
  Campground.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

// Export the router
module.exports = router;
