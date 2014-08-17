var appid = "MZVlTYAzuOWwZ1JH9xMAhlVpyEG2banAtMVaCiI3";
var jsKey = "rOvhJctAZsQkZVkPv7nsvV4XvJ2bz00E8qm7I67A";
var restAPIKey = "J3uSlWUvKMyC31ibsJ7GVWKXjHArX7q1GVTuacfj";
// var facebookMod = new FacebookMod("661965090552510");
var facebookMod = new FacebookMod("639663216116031");

$(function() {
  // Facebook Function Initiation
  Parse.initialize(appid, jsKey);
  console.log("deployed to pengho parse acct!");
  // Make all of special links magically post the form
  // when it has a particular data-action associated
  $("a[data-action='post']").click(function(e) {
    var el = $(e.target);
    el.closest("form").submit();
    return false;
  });

  $('.like').click(function(e) {
    var metadataId = e.currentTarget.getAttribute('metadataid');

    $.ajax({
      type: "POST",
      url: "https://api.parse.com/1/functions/likeImage",
      headers: {
        "X-Parse-Application-Id": appid,
        "X-Parse-REST-API-Key": restAPIKey
      },
      data: {
        metadataId: metadataId
      }
    }).done(function(msg) {
      console.log("Data Saved");
    });
  });

  $('.share').click(function(e) {
    var metadataId = e.currentTarget.getAttribute('metadataid');

    $.ajax({
      type: "POST",
      url: "https://api.parse.com/1/functions/shareImage",
      headers: {
        "X-Parse-Application-Id": appid,
        "X-Parse-REST-API-Key": restAPIKey
      },
      data: {
        metadataId: metadataId
      }
    }).done(function(msg) {
      console.log("Data Saved");
    });
  });


  $('.adsimage').click(function(event) {
    $('.popup-image').attr("src", event.target.src);
  });


  $('.adsimage').click(function(event) {
    var str = event.target.alt;
    var parts = str.split(",");
      $('.companyName').text(parts[0]);
      $('.promoInfo').text(parts[1]);
      $('.expiry').text(parts[2]);
      $('.site').text(parts[3]);
  });

  $('.approve').click(function(event) {
    var metadataId = event.currentTarget.getAttribute('metadataid');
    $.ajax({
      type: "POST",
      url: "https://the-central-market.parseapp.com/i/" + metadataId + "/approve",
      headers: {
        "X-Parse-Application-Id": appid,
        "X-Parse-REST-API-Key": restAPIKey
      },
      data: {
        metadataId: metadataId
      }
    }).done(function(msg) {
      console.log("Image Approve");
    });
    //Do POST to /:id/approve
  });

  $('.reject').click(function(event) {
    var metadataId = event.currentTarget.getAttribute('metadataid');
    $.ajax({
      type: "POST",
      url: "https://the-central-market.parseapp.com/i/" + metadataId + "/reject",
      headers: {
        "X-Parse-Application-Id": appid,
        "X-Parse-REST-API-Key": restAPIKey
      },
      data: {
        metadataId: metadataId
      }
    }).done(function(msg) {
      console.log("Image Reject");
    });
    //Do POST to /:id/reject
  });

  //Button in popup
  $('#approve-button').click(function(event) {
    //Do POST to /:id/approve
  });

  //Button in popup
  $('#reject-button').click(function(event) {
    //Do POST to /:id/reject
  });

});

Uploader = Backbone.View.extend({
  events: {
    "submit": "upload",
    "change input[type=file]": "upload",
    "click .upload": "showFile"
  },

  initialize: function() {
    var self = this;
    this.fileUploadControl = this.$el.find("input[type=file]")[0];
  },

  showFile: function(e) {
    this.fileUploadControl.click();
    return false;
  },

  upload: function() {
    var self = this;

    if (this.fileUploadControl.files.length > 0) {
      this.$(".upload").html("Uploading <img src='/images/spinner.gif' />");
      var file = this.fileUploadControl.files[0];
      var name = "image.jpg";
      var parseFile = new Parse.File(name, file);

      // First, we save the file using the javascript sdk
      parseFile.save().then(function() {
        // Then, we post to our custom endpoint which will do the post
        // processing necessary for the image page
        $.post("/i", {
          file: {
            "__type": "File",
            "url": parseFile.url(),
            "name": parseFile.name()
          }, 
          title: self.$("[name=title]").val(),
          category: self.$("[name=category]").val(),
          expiry: self.$("[name=expiry]").val(),
          location: self.$("[name=location]").val(),
          desc: self.$("[name=desc]").val()

        }, function(data) {
          if (data.error) {
            console.log(data.error);
          } else {
            window.location.reload();
          }
        });
      });
    } else {
      alert("Please select a file");
    }

    return false;
  }
});
