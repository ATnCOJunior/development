// Provides endpoints for user signup and login

module.exports = function() {
    var express = require('express');
    var app = express();

    // Cashout function
    app.post('/cashout', function(req, res) {
        var user = Parse.User.current();
        var pointAmount = req.body.pointAmount;
        var dollarAmount = req.body.dollarAmount;

        var pointAmountNew = parseInt(pointAmount);
        var dollarAmountNew = parseInt(dollarAmount);
        var newPointAmount = user.get("points") - pointAmountNew;


        var Record = Parse.Object.extend("Record");
        var record = new Record();

        user.set("points", newPointAmount);
        record.set("amount", dollarAmountNew);
        record.set("account", user.get("paypal"));
        record.set("user", user.get("username"));
        record.save();
        user.save();

        res.redirect("/user-transaction");
    });



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

    // Updates the user's profile info
    app.post('/update-trans', function(req, res) {
        // var User = Parse.User;
        // var query = new Parse.Query(User);
        // var user;
        // var userid = req.body.userid;
        // query.equalTo("objectId", userid);
              console.log(req.body.userid);
        var query = new Parse.Query(Parse.User);
        query.get(req.body.userid, {
            success: function (user) {
                console.log("success");
                console.log(user);

             res.redirect("/admin-account-merchant");
            },
            error: function (error) {
                console.log(error);
                console.log("error");
                          res.redirect("/admin");
            }, 
            useMasterKey: true

        });  // find all the women
 
        // query.find({
        //     success: function(users) {
        //         user = users[0];
        //         user.save({
        //             company: req.body.company,
        //             email: req.body.email,
        //             website: req.body.website,
        //             social: req.body.social,
        //             desc: req.body.desc
        //         }, {
        //             success: function(user) {
        //                 res.redirect("/admin-account-merchant");
        //             },
        //             error: function(object, error) {
        //                 res.set('error', error);
        //                 res.redirect("/admin-account-merchant", error);
        //             }
        //         });
        //     },
        //     error: function(error) {
        //         console.log(error);
        //     }
        // });

    });

    // MERCHANT FUNCTIONS

    // Renders the signup page
    app.get('/signup-merchant', function(req, res) {
        res.render('signup-merchant');
    });

    // Signs up a new user
    app.post('/signup-user', function(req, res) {
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
            res.render('login', {
                flash: error.message
            });
        });
    });

    // Render the login page
    app.get('/login-merchant', function(req, res) {
        res.render('login-merchant');
    });

    app.post('/login-merchant', function(req, res) {
        Parse.User.logIn(req.body.username, req.body.password).then(function(user) {
            if (Parse.User.current().get('username') == "admin") {
                res.redirect('/admin');
            } else if (user.get("type") == "merchant") {
                res.redirect('/merchant');
            } else {
                res.render('login-merchant');
            }
        }, function(error) {
            // Show the error message and let the user try again
            res.render('login-merchant', {
                flash: error.message
            });
        });
    });

    // Logs in the user
    app.post('/login-user', function(req, res) {
        Parse.User.logIn(req.body.username, req.body.password).then(function(user) {
            if (Parse.User.current().get('username') == "admin") {
                res.redirect('/admin');
            } else {
                res.redirect('/user');
            }
        }, function(error) {
            // Show the error message and let the user try again
            res.render('login-user', {
                flash: error.message
            });
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
    app.get('/signup-user', function(req, res) {
        res.render('signup-user');
    });

    // Signs up a new user
    app.post('/signup-user', function(req, res) {
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
            res.render('login-user', {
                flash: error.message
            });
        });
    });

    // Render the login page
    app.get('/login-user', function(req, res) {
        res.render('login-user');
    });

    // Logs in the user
    app.post('/login-user', function(req, res) {
        Parse.User.logIn(req.body.username, req.body.password).then(function(user) {
            if (user.get("type") == "customer") {
                res.redirect('/user');
            } else {
                res.render('login', {
                    flash: "Invalid Username or Password"
                });
            }
        }, function(error) {
            // Show the error message and let the user try again
            res.render('login', {
                flash: error.message
            });
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