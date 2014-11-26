//for deployment
// var appid = "MZVlTYAzuOWwZ1JH9xMAhlVpyEG2banAtMVaCiI3";
// var jsKey = "rOvhJctAZsQkZVkPv7nsvV4XvJ2bz00E8qm7I67A";
// var restAPIKey = "J3uSlWUvKMyC31ibsJ7GVWKXjHArX7q1GVTuacfj";

//for dev
var appid = "n1z14zFUHMK01hZWLLFRs81fsbbLmUUdndvnuetB";
var jsKey = "xOwM1WsUwddJBoJZOeXZEY3HXNl4KbShZXK5qkLh";
var restAPIKey = "mrPxxmjU2CjBUYPDttDrM46o1sq4xaBF0IwiBs88";


//var facebookMod = new FacebookMod("639663216116031"); //deployment
var facebookMod; //dev

$(function() {
    // Facebook Function Initiation
    Parse.initialize(appid, jsKey);

    facebookMod = new FacebookMod("639663216116031");
    //facebookMod = new FacebookMod("683418888407130");
    console.log("facebookMod: " + facebookMod);

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

    // $('.share').click(function(e) {
    //     var metadataId = e.currentTarget.getAttribute('metadataid');

    //     $.ajax({
    //         type: "POST",
    //         url: "https://api.parse.com/1/functions/shareImage",
    //         headers: {
    //             "X-Parse-Application-Id": appid,
    //             "X-Parse-REST-API-Key": restAPIKey
    //         },
    //         data: {
    //             metadataId: metadataId
    //         }
    //     }).done(function(msg) {
    //         console.log("Data Saved");
    //     });
    // });

    // $('#shareButton').click(function() {
    //     var obj = {
    //       method: 'feed',
    //       link: 'https://thefoodiemarket-dev.parseapp.com/i/<%=imageID%>',
    //       picture: ,//the picture you want for the caption
    //       name: 'aaa',
    //       caption: 'aaa',
    //       description: 'aaa',
    //       display: 'popup'
    //     };

    //     function callback(response) {
    //        //here you can check the response and see if it was shared
    //        if (response && response.post_id){
    //          post('/share');
    //        }
    //     }


    //     FB.ui(obj, callback);
    // });


    $('.adsimage').click(function(event) {
        $('.popup-image').attr("src", event.target.src);
    });


    $('.adsimage').click(function(event) {
        var str = event.target.alt;
        var parts = str.split(",");
        $('.companyName').text(parts[0]);
        $('.promoInfo').text(parts[1]);
        $('.promoStart').text(parts[2]);
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

    //Button in popup
    $('#approve-button').click(function(event) {
        //Do POST to /:id/approve
    });

    //Button in popup
    $('#reject-button').click(function(event) {
        //Do POST to /:id/reject
    });

    // bookmark
    $('.bookmark-switch').click(function(event) {
        var text = $(this).text();

        if(text == "Bookmark"){
            var Bookmark = Parse.Object.extend("Bookmark");
            var bookmark = new Bookmark();

            // Make a new bookmark

            // if ($(event.currentTarget).is(':checked')) {
            var imageId = $(event.currentTarget).attr('title');
            var userId = $('#userID').val();

            var img = Parse.Object.extend("Image");
            var image = new img();
            image.id = imageId;

            var user = new Parse.User();
            user.id = userId;

            bookmark.set("bookmark_image", image);
            bookmark.set("user", user);
            bookmark.save(null, {
                success: function(bookmark) {
                    // Execute any logic that should take place after the object is saved.
                    console.log('New bookmark created with objectId: ' + image.id + ' for user ' + user.id);
                    $('.bookmark-switch').text("Unbookmark");
                },
                error: function(bookmark, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    console.log('Failed to create new bookmark, with error code: ' + error.message);
                }
            });
        }else{
            var query = new Parse.Query("Bookmark");
            var imageID = $(event.currentTarget).attr('title');

            query.equalTo("user", Parse.User.current());
            query.include("user");
            query.include("bookmark_image");
            query.include("bookmark_image.imageMetadata");
            query.descending("createdAt");

            query.find({
                success: function(objects) {
                    for (var i = objects.length - 1; i >= 0; i--) {
                        if(objects[i].get("bookmark_image").id == imageID){
                            objects[i].destroy({
                            success: function(myObject) {
                               console.log("bookmark destroyed");
                               $('.bookmark-switch').text("Bookmark");
                            },
                            error: function(err) {
                                console.log("bookmark not destroyed");
                            }
                        });   
                        }
                    };
                },
                error: function(err) {
                    console.log("retrieval of bookmarks failed");
                }   
            });
        }


        // var Bookmark = Parse.Object.extend("Bookmark");
        // var bookmark = new Bookmark();

        // // Make a new bookmark

        // // if ($(event.currentTarget).is(':checked')) {
        // var imageId = $(event.currentTarget).attr('title');
        // var userId = $('#userID').val();

        // var img = Parse.Object.extend("Image");
        // var image = new img();
        // image.id = imageId;

        // var user = new Parse.User();
        // user.id = userId;

        // bookmark.set("bookmark_image", image);
        // bookmark.set("user", user);
        // bookmark.save(null, {
        //     success: function(bookmark) {
        //         // Execute any logic that should take place after the object is saved.
        //         console.log('New bookmark created with objectId: ' + image.id + ' for user ' + user.id);
        //     },
        //     error: function(bookmark, error) {
        //         // Execute any logic that should take place if the save fails.
        //         // error is a Parse.Error with an error code and message.
        //         console.log('Failed to create new bookmark, with error code: ' + error.message);
        //     }
        // });
        // // }
    });


    // share
    $('.share').click(function(event) {
        var attributes = event.currentTarget.title.split('|');

        console.log(attributes);

        var imgId = attributes[0];
        var title = attributes[1];
        var desc = attributes[2];
        var userId = attributes[3];

        var obj = {
            method: 'feed',
            name: 'The Foodie Market!',
            title: title,
            description: desc,
            link: 'https://thefoodiemarket.parseapp.com/i/' + imgId,
            display: 'popup'
        };

        function callback(response) {
            var query = new Parse.Query(Parse.User);
            query.get(userId, {
                success: function(user) {
                    user.set("shares", user.get("shares") + 1);
                    user.set("points", user.get("points") + 4);
                    user.save(null, {
                        success: function(savedUserObject) {
                            console.log("facebook share successful");

                        },
                        error: function(object, error) {
                            console.log('Failed to save object: ' + error.message);
                        }
                    });
                },
                error: function(error) {
                    console.log("cannot find user");
                }
            });


            var imageQuery = new Parse.Query(Parse.Object.extend("Image"));
            imageQuery.include("imageMetadata");
            imageQuery.get(imgId, {
                success: function(image) {
                    var imageMetadata = image.get("imageMetadata");
                    console.log("shares: " + imageMetadata.get("shares"));
                    imageMetadata.set("shares", imageMetadata.get("shares") + 1);
                    imageMetadata.save(null, {
                        success: function(savedUserObject) {
                            console.log("image share count addition successful");

                        },
                        error: function(object, error) {
                            console.log('Failed to save object: ' + error.message);
                        }
                    });
                },
                error: function(error) {
                    console.log("cannot find image");
                    console.log("error: " + error);
                }
            });
        }

        FB.ui(obj, callback);
    });


    $('#merchant-transaction-message-list a').click(function(event) {
        var attributes = event.currentTarget.title.split(',');

        var likeCount = parseInt(attributes[1]);
        var shareCount = parseInt(attributes[2]);
        var addCount = parseInt(attributes[3]);
        var total = likeCount * 0.4 + shareCount * 0.8 + addCount * 50;

        console.log(attributes);

        $('#imagePreview').attr('src', attributes[0]);
        $('#likeCount').text('x' + likeCount);
        $('#likeCountSum').text('$ ' + (likeCount * 0.4).toFixed(2));
        $('#shareCount').text('x' + shareCount);
        $('#shareCountSum').text('$ ' + (shareCount * 0.8).toFixed(2));
        $('#addCount').text('x' + addCount);
        $('#addCountSum').text('$ ' + (addCount * 50).toFixed(2));
        $('#subtotal').text('$' + (total).toFixed(2));
        $('#totalDue').text('$' + (total).toFixed(2));
        $('#paypalAmount').attr('value', total);
    });

    $('#admin-inbox-message-list a').click(function(event) {
        var attributes = event.currentTarget.title.split('|');

        var title = attributes[0];
        var date = attributes[1];
        var user = attributes[2];
        var message = attributes[3];
        var imageUrl = attributes[4];
        var imageId = attributes[5];
        console.log(attributes);
        $('#feedback-type').text(title);
        $('#feedback-time').text(date);
        $('#feedback-user').text(user);
        $('#feedback-content').text(message);
        if (imageUrl != null) {
            $('#feedback-image').attr('src', imageUrl);
        }
        // console.log("title: " + title);
        // if(imageId!=""){
        //     var buttons = $('#approve-buttons');
        //     console.log("check for buttons: " + buttons);
        //     buttons
        //         .removeClass('display-none')
        //         .addClass('animation-fadeInQuick2');

        //     $('#approve-btn').click(function() {
        //         location.href="/i/"+imageId+"/approve";
        //     });
        //     $('#bad-image').click(function(){
        //         location.href="/i/"+imageId+"/reject/bad-image";
        //     });
        //     $('#bad-content').click(function(){
        //         location.href="/i/"+imageId+"/reject/bad-content";
        //     });
        // }
    });

    $('#merchant-inbox-message-list a').click(function(event) {
        var attributes = event.currentTarget.title.split('|');

        var title = attributes[0];
        var date = attributes[1];
        var message = attributes[2];
        $('#feedback-type').text(title);
        $('#feedback-time').text(date);
        $('#feedback-content').text(message);
    });

    $('#user-inbox-message-list a').click(function(event) {
        var attributes = event.currentTarget.title.split('|');

        var title = attributes[0];
        var date = attributes[1];
        var message = attributes[2];
        var imageUrl = attributes[3];
        $('#feedback-type').text(title);
        $('#feedback-time').text(date);
        $('#feedback-content').text(message);
        if (imageUrl != null) {
            $('#feedback-image').attr('src', imageUrl);
        }
    });

    $('#admin-acc-merchant-list a').click(function(event) {

        var attributes = event.currentTarget.title.split(',');

        console.log(attributes);

        $('#admin-acc-merchant-list-userid').attr('value', attributes[0]);
        $('#admin-acc-merchant-list-company').attr('value', attributes[1]);
        $('#admin-acc-merchant-list-email').attr('value', attributes[2]);
        $('#admin-acc-merchant-list-website').attr('value', attributes[3]);
        $('#admin-acc-merchant-list-social').attr('value', attributes[4]);
        $('#admin-acc-merchant-list-desc').attr('value', attributes[5]);
    });

    $('#admin-trans-user a').click(function(event) {

        var attributes = event.currentTarget.title.split(',');

        console.log(attributes);

        $('#admin-trans-user-name').attr('value', attributes[0]);
        $('#admin-trans-user-amount').attr('value', attributes[1]);
        $('#admin-trans-user-account').attr('value', attributes[2]);
    });

});

Uploader = Backbone.View.extend({
    events: {
        "click .submit": "upload",
        // "change input[type=file]": "upload",
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
            this.$("button.submit").html('<i class="fa fa-asterisk fa-2x fa-spin"></i>');
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
                    promoStart: self.$("[name=promoStart]").val(),
                    location: self.$("[name=location]").val(),
                    desc: self.$("[name=desc]").val(),
                    promoEnd: self.$("[name=promoEnd]").val(),
                    likes: 0,
                    shares: 0,
                    addDays: 0,
                    paid: 0,
                    views: 0
                }, function(data) {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        window.location.href = "https://thefoodiemarket.parseapp.com/merchant";
                    }
                });
            });
        } else {
            alert("Please select a file");
        }

        return false;
    }
});