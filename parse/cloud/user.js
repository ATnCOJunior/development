// Provides endpoints for user signup and login

module.exports = function(){
  var express = require('express');
  var app = express();

  // Updates the user's profile info
  app.post('/update', function(req, res) {
    var user = Parse.User.current();

    user.save({
      company: req.body.company,
      email: req.body.email,
      website: req.body.website,
      social: req.body.social,
      desc: req.body.desc
    }, {
      success: function(user) {
        res.redirect("/merchant");
      },
      error: function(user, error) {
        res.set('error', error);
        res.redirect("/merchant", error);
      }
    });
  });


  // MERCHANT FUNCTIONS

  // Renders the signup page
  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  // Signs up a new user
  app.post('/signup', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var company = req.body.company;
    var email = req.body.email;
    var website = req.body.website;
    var social = req.body.social;
    var desc = req.body.desc;

    var user = new Parse.User();
    user.set('username', username);
    user.set('password', password);
    user.set('company', company);
    user.set('email', email);
    user.set('website', website);
    user.set('social', social);
    user.set('desc', desc);
    user.set('type', "merchant");
    
    user.signUp().then(function(user) {
      res.redirect('/merchant');
    }, function(error) {
      // Show the error message and let the user try again
      res.render('login', { flash: error.message });
    });
  });

  // Render the login page
  app.get('/login', function(req, res) {
      res.render('login');
  });

  // Logs in the user
  app.post('/login', function(req, res) {
    Parse.User.logIn(req.body.username, req.body.password).then(function(user) {
      if (Parse.User.current().get('username')=="admin"){
        res.redirect('/admin');
      }else{
        res.redirect('/merchant#profile');
      }
    }, function(error) {
      // Show the error message and let the user try again
      res.render('login', { flash: error.message });
    });
  });

  app.get('/logout', function(req, res) {
    Parse.User.logOut();
    res.redirect('/');
  });
  // Logs out the user
  app.post('/logout', function(req, res) {
    Parse.User.logOut();
    res.redirect('/');
  });

  // CUSTOMER FUNCTIONS

  // MERCHANT SIGN-UP FUNCTIONS

  // Renders the signup page
  app.get('/user-signup', function(req, res) {
    res.render('user-signup');
  });

  // Signs up a new user
  app.post('/user-signup', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var fullName = firstName + " " + lastName;
    var gender = req.body.gender;
    var email = req.body.email;
    var occupation = req.body.occupation;

    var user = new Parse.User();
    user.set('username', username);
    user.set('password', password);
    user.set('firstName', firstName);
    user.set('lastName', lastName);
    user.set('fullName', fullName);
    user.set('gender', gender);
    user.set('points', 0);
    user.set('email', email);
    user.set('type', "customer");
    user.set('occupation', occupation);
    
    user.signUp().then(function(user) {
      res.redirect('/user');
    }, function(error) {
      // Show the error message and let the user try again
      res.render('user-login', { flash: error.message });
    });
  });

  // Render the login page
  app.get('/user-login', function(req, res) {
      res.render('user-login');
  });

  // Logs in the user
  app.post('/user-login', function(req, res) {
    Parse.User.logIn(req.body.username, req.body.password).then(function(user) {
      if (user.get("type") == "customer") {
        res.redirect('/user');
      }else{
        res.render('login', { flash: "Invalid Username or Password" });
      }
    }, function(error) {
      // Show the error message and let the user try again
      res.render('login', { flash: error.message });
    });
  });

  app.get('/user-logout', function(req, res) {
    Parse.User.logOut();
    res.redirect('/');
  });
  // Logs out the user
  app.post('/logout', function(req, res) {
    Parse.User.logOut();
    res.redirect('/');
  });


  return app;
}();


