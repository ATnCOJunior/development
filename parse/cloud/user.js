// Provides endpoints for user signup and login

module.exports = function() {
    var express = require('express');
    var app = express();

    app.post('/compose', function(req, res) {
        var user = Parse.User.current();
        var fullName = user.get("fullName");
        var origin = req.body.origin;
        var message = req.body.message;
        var contact = req.body.contact;
        var contactNumber = req.body.contactNumber;

        var Notification = Parse.Object.extend("Notification");
        var notification = new Notification();

        notification.set("owner", "VJNxQ9QDbY"); //confirm working
        notification.set("code", 3); //confirm working
        notification.set("contact", contact); //confirm working
        notification.set("contactNumber", parseInt(contactNumber)); //confirm working
        notification.set("message", "Feedback from User/Merchant: " + message + ". Contact: " + contactNumber + ". Email: " + contact);
        notification.set("user", user); //confirm working
        notification.set("readStatus", 0); //confirm working

        notification.save(null, {
            success: function() {
                res.redirect(origin);
            },
            error: function(error) {
                res.set('error', error);
                res.redirect(origin, error);
            }
        })
    });


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

        var Notification = Parse.Object.extend("Notification");
        var notification = new Notification();

        user.set("points", newPointAmount);
        record.set("amount", dollarAmountNew);
        record.set("account", user.get("paypal"));
        record.set("user", user.get("username"));
        notification.set("owner", "VJNxQ9QDbY");
        notification.set("code", 2);
        notification.set("message", "Pending Cashout for User: " + user.get("username") + ", $" + dollarAmountNew);
        notification.set("amount", dollarAmountNew);
        notification.set("user", user);
        notification.set("readStatus", 0);

        notification.save(null, {
            success: function() {
                record.save(null, {
                    success: function() {
                        user.save(null, {
                            success: function() {
                                console.log("cashout successful!");
                                res.redirect("/user-transaction");
                            },
                            error: function() {
                                console.log("cashout not successful! user not saved");
                                res.redirect("/user-transaction");
                            }
                        });
                    },
                    error: function() {
                        console.log("cashout not successful! record not saved");
                        res.redirect("/user-transaction");
                    }
                });
            },
            error: function() {
                console.log("cashout not successful! notification not saved");
                res.redirect("/user-transaction");
            }
        });
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
    app.post('/update-user', function(req, res) {
        var user = Parse.User.current();

        user.setEmail(req.body.email, null);

        user.save({
            fullName: req.body.fullName,
            paypal: req.body.paypal
        }, {
            success: function(user) {
                res.redirect(req.body.origin);
            },
            error: function(user, error) {
                res.set('error', error);
                res.redirect(req.body.origin, error);
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
            success: function(user) {
                user.set("name", req.body.name);
                user.save(null, {
                    success: function(savedUserObject) {
                        res.redirect("/admin-account-merchant");
                    },
                    error: function(object, error) {
                        console.log('Failed to save object: ' + error.message);
                        res.redirect('/admin')
                    }
                });
                res.redirect("/admin-account-merchant");
            },
            error: function(error) {
                console.log(error);
                console.log("error");
                res.redirect("/admin");
            },
            useMasterKey: true

        }); // find all the women

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
    app.post('/signup-merchant', function(req, res) {
        var origin = req.body.origin;
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
            if (origin != "/merchant") {
                Parse.User.logIn("admin", "admin").then(function(user) {
                    res.redirect(origin);
                });
            } else {
                res.redirect(origin);
            }
        }, function(error) {
            if (origin != "/merchant") {
                res.redirect(origin, {
                    flash: error.message
                });

            } else {
                res.render('login', {
                    flash: error.message
                });
            }
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

    // Render the login page
    app.get('/login-user', function(req, res) {
        res.render('login-user');
    });


    // Logs in the user
    app.post('/login-user', function(req, res) {
        Parse.User.logIn(req.body.username, req.body.password).then(function(user) {
            if (Parse.User.current().get('username') == "admin") {
                res.redirect('/admin');
            } else {
                // Get the latest bookmarks to show
                var query = new Parse.Query("Bookmark");
                query.equalTo("user", Parse.User.current());
                query.include("user");
                query.include("bookmark_image");
                query.include("bookmark_image.imageMetadata");
                query.descending("createdAt");

                query.find({
                    success: function(objects) {
                        console.log("bookmarks query successful");
                        for (var i = 0; i < objects.length; i++) {
                            var image = objects[i].get("bookmark_image");
                            var imageMetadata = image.get("imageMetadata");
                            var promoEnd = imageMetadata.get("promoEnd");
                            var today = new Date();
                            var timeDiff = Math.abs(promoEnd.getTime() - today.getTime());
                            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                            console.log(diffDays);
                            if(diffDays<=3 & objects[i].get("notified")==0){
                                var Notification = Parse.Object.extend("Notification");
                                var notification = new Notification();

                                notification.set("owner", Parse.User.current().id);
                                notification.set("code", 9);
                                notification.set("image",image);
                                notification.set("message", "Bookmarked Ad Expiring in 3 Days. Ad: " + imageMetadata.get("title") + ".");
                                notification.set("readStatus", 0);

                                objects[i].set("notified", 1);

                                notification.save(null, {
                                    success: function() {
                                        console.log("expiry notification successful");
                                        objects[i].save(null,{
                                            success: function(){
                                                console.log("notified successfully updated");
                                            },
                                            error: function(){
                                                console.log("notified not successfully updated");
                                            }
                                        });
                                    },
                                    error: function() {
                                        console.log("expiry notification unsuccessful");
                                    }
                                });
                            }
                        }
                        res.redirect('/user');
                    },
                    error: function(err) {
                        res.send(500, err);
                    }
                });
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
        var paypal = req.body.paypal;
        var dob = req.body.dob;

        var user = new Parse.User();
        user.set('username', username);
        user.set('password', password);
        user.set('firstName', firstName);
        user.set('lastName', lastName);
        user.set('fullName', fullName);
        user.set('paypal', paypal);
        user.set('gender', gender);
        user.set('dob', dob);
        user.set('points', 0);
        user.set('email', email);
        user.set('type', "customer");
        user.set('occupation', occupation);
        user.set('likes', 0);
        user.set('shares', 0);

        user.signUp().then(function(user) {
            res.redirect('/user');
        }, function(error) {
            // Show the error message and let the user try again
            res.render('login-user', {
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