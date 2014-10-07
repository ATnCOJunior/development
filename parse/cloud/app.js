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

// IMAGE GALLERY

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
  if (!Parse.User.current() || Parse.User.current().get("type") != "customer") {
    res.redirect('/login-user');
  }

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
  if (!Parse.User.current() || Parse.User.current().get("type") != "merchant") {
    res.redirect('/login-merchant');
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
    res.redirect('/login-user');
  }
});

// IMAGE GALLERY END //

// MERCHANT FEATURE
// UPLOAD
app.get('/merchant-upload', function(req, res){
  res.render('merchant-upload');
});

// TRANSACTION - MERCHANT
app.get('/merchant-transaction', function(req, res){
  if (!Parse.User.current() || Parse.User.current().get("type") != "merchant") {
    res.redirect('/login-merchant');
  }

  // Get the latest images to show
  var query = new Parse.Query(Image);
  query.equalTo("user", Parse.User.current());
  query.include("imageMetadata");
  query.include("user");
  query.descending("createdAt");
  // query.equalTo("approval", "2");
  // query.equalTo("paid", 0);

  query.find({
    success: function(objects) {
      res.render('merchant-transaction', {
        images: objects
      });
    }
  });
});
// TRANSACTION MERCHANT SUCCESS
app.get('/merchant-transaction-success', function(req, res){
  res.render('merchant-transaction-success');
});

app.post('/merchant-transaction-success', function(req, res){
  res.render('merchant-transaction-success');
});

// INBOX
app.get('/merchant-inbox', function(req, res){
  if (!Parse.User.current() || Parse.User.current().get("type") != "merchant") {
    res.redirect('/login-merchant');
  }

  var query = new Parse.Query("Notification");
  query.equalTo("owner", Parse.User.current().id);
  query.equalTo("readStatus", 0);
  query.include("user");
  query.include("image");

  query.find({
    success: function(objects) {
      res.render('merchant-inbox', {
        notifications: objects
      });
    },
    error: function(err) {
      res.send(500, err);
    }
  });
});


// USER FEATURE
// USER LOGIN
app.get('/login-user', function(req, res){
  res.render('login-user');
});
// USER SIGNUP
app.get('/signup-user', function(req, res){
  res.render('signup-user');
});
// TRANSACTION
app.get('/user-transaction', function(req, res){
  res.render('user-transaction');
});
// INBOX
app.get('/user-inbox', function(req, res){
  if (!Parse.User.current() || Parse.User.current().get("type") != "customer") {
    res.redirect('/login-user');
  }

  // Get the latest notifications to show
  var query = new Parse.Query("Notification");
  query.equalTo("owner", Parse.User.current().id);
  query.include("image");
  query.include("user");
  query.descending("createdAt");

  query.find({
    success: function(objects) {
      res.render('user-inbox', {
        notifications: objects
      });
    }
  });
  //res.render('userInbox');
});
// BOOKMARK
app.get('/user-bookmark', function(req, res) {
  if (!Parse.User.current() || Parse.User.current().get("type") != "customer") {
    res.redirect('/login-user');
  }

  // Get the latest bookmarks to show
  var query = new Parse.Query("Bookmark");
  query.equalTo("user", Parse.User.current());
  query.include("user");
  query.include("bookmark_image");
  query.include("bookmark_image.imageMetadata");
  query.descending("createdAt");

  query.find({
    success: function(objects) {
      res.render('user-bookmark', {
        bookmarks: objects
      });
    },
    error: function(err) {
      res.send(500, err);
    }
  });
  //res.render('bookmark');
});

// ADMIN FEATURE - ACCOUNT MANAGEMENT
// INBOX
app.get('/admin-inbox', function(req, res){
  if (!Parse.User.current() || Parse.User.current().get("type") != "admin") {
    res.redirect('/login-merchant');
  }

  var query = new Parse.Query("Notification");
  query.equalTo("owner", Parse.User.current().id);
  query.equalTo("readStatus", 0);
  query.descending("createdAt");
  query.include("user");
  query.include("image");

  query.find({
    success: function(objects) {
      res.render('admin-inbox', {
        notifications: objects
      });
    },
    error: function(err) {
      res.send(500, err);
    }
  });
});
// ADD MERCHANT
app.get('/admin-add-merchant', function(req, res){
  res.render('admin-add-merchant');
});

// MERCHANT TABLE
app.get('/admin-account-merchant', function(req, res){
  var query = new Parse.Query("User");
  query.equalTo("type", "merchant");

  query.find({
    success: function(objects){
      res.render('admin-account-merchant', {
        merchants: objects
      });
    }
  });
});

// MERCHANT PAYMENT
app.get('/admin-transaction-merchant', function(req, res){
  res.render('admin-transaction-merchant');
});
// USER PAYMENT
app.get('/admin-transaction-user', function(req, res){
  var query = new Parse.Query("Record");
  query.descending("createdAt");

  query.find({
    success: function(objects) {
      res.render('admin-transaction-user', {
        records: objects
      });
    }
  });
});
// ADD USER
app.get('/admin-add-user', function(req, res){
  res.render('admin-add-user');
});
// MERCHANT USER
app.get('/admin-account-user', function(req, res){
  res.render('admin-account-user');
});

// User endpoints
app.use('/', require('cloud/user'));

// Image endpoints

app.use('/i', require('cloud/image'));

// Run on Cloud Code Server.
app.listen();