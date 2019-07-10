// Module Imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const seedDB = require('./seeds');

// seedDB();

// Initialize Express
const app = express();

// Model Imports
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');

// Route Imports
const indexRoutes = require('./routes');
const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');

console.log(process.env.DATABASEURL);

// Connect to DB
mongoose.connect('mongodb://localhost:27017/YelpCamp', {
  useNewUrlParser: true,
  useFindAndModify: false
});

// Set ejs as view engine
app.set('view engine', 'ejs');

// Use body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Use method-override
app.use(methodOverride('_method'));

// Use connect-flash
app.use(flash());

// Use express-session
app.use(
  require('express-session')({
    secret: 'The ultra extreme super secret line',
    resave: false,
    saveUninitialized: false
  })
);

// Use passport
app.use(passport.initialize());
app.use(passport.session());

// Global Data Middleware
app.use(function(req, res, next) {
  // Send user data
  res.locals.currentUser = req.user;
  // Send Flash Error
  res.locals.error = req.flash('error');
  // Send Flash Success
  res.locals.success = req.flash('success');

  // Move on
  next();
});

// Passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Serve Public Files
app.use(express.static(`${__dirname}/public`));

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// Listen on port 3000
app.listen(3000 || process.env.PORT, () => {
  console.log('YelpCamp server has started!');
});
