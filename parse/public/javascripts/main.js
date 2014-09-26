//for deployment
// var appid = "MZVlTYAzuOWwZ1JH9xMAhlVpyEG2banAtMVaCiI3";
// var jsKey = "rOvhJctAZsQkZVkPv7nsvV4XvJ2bz00E8qm7I67A";
// var restAPIKey = "J3uSlWUvKMyC31ibsJ7GVWKXjHArX7q1GVTuacfj";

//for dev
var appid = "n1z14zFUHMK01hZWLLFRs81fsbbLmUUdndvnuetB";
var jsKey = "xOwM1WsUwddJBoJZOeXZEY3HXNl4KbShZXK5qkLh";
var restAPIKey = "mrPxxmjU2CjBUYPDttDrM46o1sq4xaBF0IwiBs88";


//var facebookMod = new FacebookMod("639663216116031"); //deployment
var facebookMod = new FacebookMod("683418888407130"); //dev

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

    $('#message-list a').click(function(event) {
        var attributes = event.currentTarget.title.split(',');

        var likeCount = parseInt(attributes[1]);
        var shareCount = parseInt(attributes[2]);
        var addCount = parseInt(attributes[3]);
        var total = likeCount * 0.4 + shareCount * 0.8 + addCount * 50;
        console.log(attributes);
        $('#imagePreview').attr('src', attributes[0]);
        $('#likeCount').text('x' + likeCount);
        $('#likeCountSum').text('$ ' + likeCount * 0.4);
        $('#shareCount').text('x' + shareCount);
        $('#shareCountSum').text('$ ' + shareCount * 0.8);
        $('#addCount').text('x' + addCount);
        $('#addCountSum').text('$ ' + addCount * 50);
        $('#subtotal').text('$' + total);
        $('#totalDue').text('$' + total);
        $('#paypalAmount').attr('value', total);
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
                    expiry: self.$("[name=expiry]").val(),
                    location: self.$("[name=location]").val(),
                    desc: self.$("[name=desc]").val(),
                    likes:0,
                    shares:0,
                    addDays:0,
                    daysLeft:self.$("[name=expiry]").val(),
                    paid:0,
                    views:0
                }, function(data) {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        window.location.href = "https://thefoodiemarket-dev.parseapp.com/merchant";
                    }
                });
            });
        } else {
            alert("Please select a file");
        }

        return false;
    }
});