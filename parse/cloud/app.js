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

//puts app's masterkey
//app.use(express.cookieParser('asxP7Y1RX470f7cHlQ7VVk3LWYuPNynpVuxtU7mV')); //deployment
app.use(express.cookieParser('Ooj1bqRPg7ENuoQQ6kkbsFPFNAJM42tm0mSLPFbx')); //dev
app.use(parseExpressCookieSession({
  fetchUser: true,
  key: 'image.sess',
  cookie: {
    maxAge: 3600000 * 24 * 30
  }
}));



// Views



app.locals._ = require('underscore');

var ImageMetadata = Parse.Object.extend("ImageMetadata");
var Image = Parse.Object.extend("Image");

// Homepage endpoint
app.get('/', function(req, res) {
  var innerQuery = new Parse.Query(ImageMetadata);
  innerQuery.equalTo("approval", "1");

  var query = new Parse.Query(Image);
  query.include("imageMetadata");
  query.include("user");
  query.matchesQuery("imageMetadata", innerQuery);
  query.descending("createdAt");
  query.find({
    success: function(objects) {
      var metaObjects = [];
      for (i =0; i < objects.length; i++){

        metaObjects.push(objects[i].get("imageMetadata"));
      }
      res.render('home', {
        images: objects,
        metaObjects: metaObjects
      });
    }
  });
});

// Additional Homepage endpoint
app.get('/trending', function(req, res) {
  var innerQuery = new Parse.Query(ImageMetadata);
  innerQuery.equalTo("approval", "1");

  var query = new Parse.Query(Image);
  query.include("imageMetadata");
  query.include("user");
  query.matchesQuery("imageMetadata", innerQuery);
  query.descending("views");
  query.find({
    success: function(objects) {
      var metaObjects = [];
      for (i =0; i < objects.length; i++){

        metaObjects.push(objects[i].get("imageMetadata"));
      }
      res.render('home', {
        images: objects,
        metaObjects: metaObjects
      });
    }
  });
});

// Additional Homepage endpoint
app.get('/ending', function(req, res) {
  var innerQuery = new Parse.Query(ImageMetadata);
  innerQuery.equalTo("approval", "1");

  var query = new Parse.Query(Image);
  query.include("imageMetadata");
  query.include("user");
  query.matchesQuery("imageMetadata", innerQuery);
  query.ascending("expiry");
  query.find({
    success: function(objects) {
      var metaObjects = [];
      for (i =0; i < objects.length; i++){

        metaObjects.push(objects[i].get("imageMetadata"));
      }
      res.render('home', {
        images: objects,
        metaObjects: metaObjects
      });
    }
  });
});

// User endpoint
app.get('/user', function(req, res) {
  var innerQuery = new Parse.Query(ImageMetadata);
  innerQuery.equalTo("approval", "1");

  var query = new Parse.Query(Image);
  query.include("imageMetadata");
  query.include("user");
  query.matchesQuery("imageMetadata", innerQuery);
  query.descending("createdAt");
  query.find({
    success: function(objects) {
      var metaObjects = [];
      for (i =0; i < objects.length; i++){

        metaObjects.push(objects[i].get("imageMetadata"));
      }
      res.render('user', {
        images: objects,
        metaObjects: metaObjects
      });
    }
  });
});

// Additional User endpoint
app.get('/user-trending', function(req, res) {
  var innerQuery = new Parse.Query(ImageMetadata);
  innerQuery.equalTo("approval", "1");

  var query = new Parse.Query(Image);
  query.include("imageMetadata");
  query.include("user");
  query.matchesQuery("imageMetadata", innerQuery);
  query.descending("views");
  query.find({
    success: function(objects) {
      var metaObjects = [];
      for (i =0; i < objects.length; i++){

        metaObjects.push(objects[i].get("imageMetadata"));
      }
      res.render('user', {
        images: objects,
        metaObjects: metaObjects
      });
    }
  });
});

// Additional User endpoint
app.get('/user-ending', function(req, res) {
  var innerQuery = new Parse.Query(ImageMetadata);
  innerQuery.equalTo("approval", "1");

  var query = new Parse.Query(Image);
  query.include("imageMetadata");
  query.include("user");
  query.matchesQuery("imageMetadata", innerQuery);
  query.ascending("expiry");
  query.find({
    success: function(objects) {
      var metaObjects = [];
      for (i =0; i < objects.length; i++){

        metaObjects.push(objects[i].get("imageMetadata"));
      }
      res.render('user', {
        images: objects,
        metaObjects: metaObjects
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
  query.equalTo("user", Parse.User.current());
  query.include("imageMetadata");
  query.include("user");
  query.descending("createdAt");

  query.find({
    success: function(objects) {
      res.render('merchant', {
        images: objects
      });
    }
  });
});

  // query.find().then(function(objects) {
  //   res.render('merchant', { images: objects });
  // });

// Admin endpoint
app.get('/admin', function(req, res) {
  if (Parse.User.current() && Parse.User.current().get('username') == "admin") {
    // Get the latest images to show
    var query = new Parse.Query(Image);
    query.include("imageMetadata");
    query.include("user");
    query.descending("createdAt");

    query.find().then(function(objects) {
      res.render('admin', {
        images: objects
      });
    });
  } else {
    res.redirect('/');
  }
});

// USER LOGIN
app.get('/user-login', function(req, res){
  res.render('user-login');
});
// USER SIGNUP
app.get('/user-signup', function(req, res){
  res.render('user-signup');
});

// UPLOAD
app.get('/upload', function(req, res){
  res.render('upload');
});

// INBOX
app.get('/userInbox', function(req, res){
  res.render('userInbox');
});

// User endpoints
app.use('/', require('cloud/user'));

// Image endpoints

app.use('/i', require('cloud/image'));

// Run on Cloud Code Server.
app.listen();