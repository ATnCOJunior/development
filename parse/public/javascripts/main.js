var appid = "dZDzsJP9gXfCgZyTD4oYq2lJ107NipEBnhDNm8ao";
var jsKey = "zTMtXXzOtVIt8S417svqxZDS6FdqQL1sxWVVekCg";
var restAPIKey = "pLl71HB63Mp4c8t1xXVXWMkxSIgPMazgR5XpGAmz";
var facebookMod = new FacebookMod("616634265075181");

$(function() {
  // Facebook Function Initiation
  Parse.initialize(appid, jsKey);

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


  $('.adsimg, .imgadmin').click(function(event) {
    $('#popup-image').attr("src", event.target.src);
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
    console.log("main.js in public");
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
          category: self.$("[name=category]").val()
        }, function(data) {
          window.location.href = "/i/" + data.id;
        });
      });
    } else {
      alert("Please select a file");
    }

    return false;
  }
});

