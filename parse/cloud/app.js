/**
 * Module dependencies.
 */

// These lines are required to initialize Express.
var express = require('express');
var expressLayouts = require('cloud/express-layouts');

var app = express();

var parseExpressCookieSession = require('parse-express-cookie-session');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');

// Global app configuration section
app.set('views', 'cloud/views'); // Specify the folder to find templates
app.set('view engine', 'ejs'); // Set the template engine

app.use(expressLayouts); // Use the layout engine for express
app.use(parseExpressHttpsRedirect()); // Automatically redirect non-secure urls to secure ones
app.use(express.bodyParser()); // Middleware for reading request body
app.use(express.methodOverride());

// Use Session Variables
app.use(express.cookieParser('asxP7Y1RX470f7cHlQ7VVk3LWYuPNynpVuxtU7mV'));
app.use(parseExpressCookieSession({
  fetchUser: true,
  key: 'image.sess',
  cookie: {
    maxAge: 3600000 * 24 * 30
  }
}));

// Views

app.locals._ = require('underscore');

var Image = Parse.Object.extend("Image");

// Homepage endpoint
app.get('/', function(req, res) {
  // Get the latest images to show
  var query = new Parse.Query(Image);
  query.include("imageMetadata");
  query.equalTo("approval", "1");
  query.descending("createdAt");
  query.limit(7);

  query.find({
    success: function(objects) {
      res.render('home', {
        images: objects
      });
    }
  });

  // query.find().then(function(objects) {
  //   res.render('home', {
  //     images: objects
  //   });
  // });
});

app.get('/latest', function(req, res) {
  // Get the ending images to show
  var query = new Parse.Query(Image);

  query.equalTo("approval", "1");
  query.descending("createdAt");
  query.limit(7);

  query.find({
    success: function(objects) {
      res.render('home', {
        images: objects
      });
    }
  });

  // query.find().then(function(objects) {
  //   res.render('home', {
  //     images: objects
  //   });
  // });
});

app.get('/trending', function(req, res) {
  // Get the trending images to show
  var query = new Parse.Query(Image);
  query.include("imageMetadata");
  query.equalTo("approval", "1");
  query.descending("view");
  query.limit(7);

  query.find({
    success: function(objects) {
      res.render('home', {
        images: objects
      });
    }
  });
});

// Merchant endpoint
app.get('/merchant', function(req, res) {
  if (!Parse.User.current()) {
    res.redirect('/');
  }

  // Get the latest images to show
  var query = new Parse.Query(Image);
  query.include("imageMetadata");
  query.equalTo("user", Parse.User.current());
  query.descending("createdAt");
  query.limit(7);

  query.find({
    success: function(objects) {
      res.render('merchant', {
        images: objects
      });
    }
  });

  // query.find().then(function(objects) {
  //   res.render('merchant', { images: objects });
  // });
});

// Admin endpoint
app.get('/admin', function(req, res) {
  if (Parse.User.current() && Parse.User.current().get('username')=="admin") {
    // Get the latest images to show
    var query = new Parse.Query(Image);
    query.include("imageMetadata");
    query.descending("createdAt");
    query.limit(7);

    query.find().then(function(objects) {
      res.render('admin', {
        images: objects
      });
    });
  } else {
    res.redirect('/');
  }
});

// User endpoints
app.use('/', require('cloud/user'));

// Image endpoints

app.use('/i', require('cloud/image'));

// Run on Cloud Code Server.
app.listen();