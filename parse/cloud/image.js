var requireUser = require('cloud/require-user');

var Image = Parse.Object.extend({
  className: "Image",

  title: function() {
    var title = this.get('title') || "Untitled";
    return title;
  }
});

module.exports = function() {
  var express = require('express');
  var app = express();

  app.locals._ = require('underscore');

  // Creates a new image
  app.post('/', function(req, res) {
    if (req.body.file) {
      var image = new Image();
      image.set("sizeOriginal", req.body.file);

      var ImageMetadata = Parse.Object.extend("ImageMetadata");
      var imageMetadata = new ImageMetadata();

      imageMetadata.set("title", req.body.title);
      imageMetadata.set("category", req.body.category);
      imageMetadata.set("expiry", req.body.expiry);
      imageMetadata.set("location", req.body.location);
      imageMetadata.set("desc", req.body.desc);
      
      imageMetadata.set("addDays", 0);
      imageMetadata.set("paid", 0);
      imageMetadata.set("shares", 0);
      imageMetadata.set("likes", 0);
      imageMetadata.set("views", 0);
      
      imageMetadata.set("approval", "0")

      image.set("imageMetadata", imageMetadata);
      console.log("creation at image.js"+imageMetadata);
      // Set up the ACL so everyone can read the image
      // but only the owner can have write access
      var acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      acl.setWriteAccess("3xhM0lDzrs", true);
      if (Parse.User.current()) {
        image.set("user", Parse.User.current());
        acl.setWriteAccess(Parse.User.current(), true);
      }
      image.setACL(acl);

      // Save the image and return some info about it via json
      image.save().then(function(image) {
        var Notification = Parse.Object.extend("Notification");
        var notification = new Notification();

        notification.set("owner", "MVUYgJSM9w");
        notification.set("code", 1);
        notification.set("message", "Ads Approval for Merchant: " + Parse.User.current().get("username") + ", ad: " + imageMetadata.get("title"));
        notification.set("image", image);
        notification.set("user", Parse.User.current());
        notification.set("readStatus", 0);

        notification.save(null, {
          success: function() {
            console.log("notifcation for upload successful");
            res.redirect('/merchant#pending');
          },
          error: function() {
            console.log("notification for upload not successful");
            res.redirect('/merchant#pending');
          }
        });
      }, function(error) {
        res.json({
          error: error
        });
      });
    } else {
      res.json({
        error: 'No file uploaded!'
      });
    }
  });

  // View all the latest images
  app.get('/latest', function(req, res) {
    var query = new Parse.Query(Image);

    query.descending("createdAt");

    query.find().then(function(objects) {
      res.render('image/list', {
        images: objects,
        title: "Latest"
      });
    });
  });

  // Shows images you uploaded
  app.get('/mine', requireUser, function(req, res) {
    var query = new Parse.Query(Image);

    query.descending("createdAt");
    query.equalTo("user", Parse.User.current());

    query.find().then(function(objects) {
      res.render('image/list', {
        images: objects,
        title: "My Images"
      });
    });
  });


  app.get('/:id/approve', function(req, res) {
    var id = req.params.id;

    // Build the query to find an image by id
    var query = new Parse.Query(Image);
    query.equalTo("objectId", id);
    query.include("imageMetadata");

    query.find().then(function(objects) {
      if (objects.length === 0) {
        res.send("Image not found - 1");
      } else {
        var image = objects[0];
        var imageMetadata = image.get("imageMetadata");

        var Notification = Parse.Object.extend("Notification");
        var notification = new Notification();

        notification.set("owner", image.get("user").id);
        notification.set("code", 4);
        notification.set("message", "Ad approved by admin for ad: " + imageMetadata.get("title"));
        notification.set("readStatus", 0);
        notification.save(null, {
          success: function() {
            console.log("ads approved notification not successful");
            Parse.Cloud.run('approveImage', {
              metadataId: imageMetadata.id,
              expiry: imageMetadata.get("expiry")
            }).then(function() {
              // Render the template to show one image
              res.redirect('/admin');
            }, function(error) {
              res.send("Error: " + error);
            });
          },
          error: function(error) {
            console.log("ads approved notification not successful");
            res.send("Error: " + error);
          }
        }); 
      }
    }, function(error) {
      res.send("Image not found");
    });
  });


  app.get('/:id/reject', function(req, res) {
    var id = req.params.id;

    var reason = req.params.reason;
    console.log(reason);

    // Build the query to find an image by id
    var query = new Parse.Query(Image);
    query.equalTo("objectId", id);
    query.include("imageMetadata");

    query.find().then(function(objects) {
      if (objects.length === 0) {
        res.send("Image not found - 1");
      } else {
        var Notification = Parse.Object.extend("Notification");
        var notification = new Notification();
        var image = objects[0];
        var imageMetadata = image.get("imageMetadata");

        notification.set("owner", image.get("user").id);
        notification.set("code", 5);
        notification.set("message", "Ad approved by admin for ad: " + imageMetadata.get("title") + ", reason: " + imageMetadata.get("reasonForRejection"));
        notification.set("readStatus", 0);
        notification.save(null, {
          success: function() {
            console.log("ads approved notification not successful");
            Parse.Cloud.run('rejectImage', {
              metadataId: imageMetadata.id,
              expiry: imageMetadata.get("expiry")
            }).then(function() {
              // Render the template to show one image
              res.redirect('/admin');
            }, function(error) {
              res.send("Error: " + error);
            });
          },
          error: function(error) {
            console.log("ads approved notification not successful");
            res.send("Error: " + error);
          }
        });
      }
    }, function(error) {
      res.send("Image not found");
    });
  });



  //Shows one image
  // app.post('/:id/approve', function(req, res) {
  //   var id = req.params.id;

  //   // Build the query to find an image by id
  //   var query = new Parse.Query(Image);
  //   query.equalTo("objectId", id);
  //   query.include("imageMetadata");

  //   query.find().then(function(objects) {
  //     if (objects.length === 0) {
  //       res.send("Image not found");
  //     } else {
  //       var image = objects[0];
  //       image.set("approval", "1");
  //       image.save();
  //       // Update metadata on image (adds a view)
  //       Parse.Cloud.run('viewImage', {
  //         metadataId: image.get("imageMetadata").id
  //       }).then(function() {
  //         // Render the template to show one image
  //         res.render('image/show', {
  //           image: image,
  //           size: 'sizeNormal',
  //           title: image.title()
  //         });
  //       }, function(error) {
  //         res.send("Error: " + error);
  //       });
  //     }
  //   }, function(error) {
  //     res.send("Image not found");
  //   });
  // });

  //Shows one image
  app.get('/:id', function(req, res) {
    var id = req.params.id;

    // Build the query to find an image by id
    var query = new Parse.Query(Image);
    query.equalTo("objectId", id);
    query.include("imageMetadata");

    query.find().then(function(objects) {
      if (objects.length === 0) {
        res.send("Image not found");
      } else {
        var image = objects[0];

        // Update metadata on image (adds a view)
        Parse.Cloud.run('viewImage', {
          metadataId: image.get("imageMetadata").id
        }).then(function() {
          // Render the template to show one image
          res.render('image/show', {
            image: image,
            size: 'sizeNormal',
            title: image.title()
          });
        }, function(error) {
          res.send("Error: " + error);
        });
      }
    }, function(error) {
      res.send("Image not found");
    });
  });

  return app;
}();