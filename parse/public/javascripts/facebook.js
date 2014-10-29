function FacebookMod(facebookId) {
    var self = this;

    Parse.FacebookUtils.init({
        appId: facebookId,
        xfbml: true,
        version: 'v2.1',
        status: false
    });

    this.login = function() {
        Parse.FacebookUtils.logIn('public_profile, email, user_friends, publish_actions', {
            success: function(user) {
                if (!user.existed()) {
                    FB.api('/me', function(userInfo) {
                        FB.api('/me/picture', function(response) {
                            var avatar = response.data.url;
                            user.setEmail(userInfo.email);
                            user.set("emailaddress", userInfo.email);
                            user.set('firstName', userInfo.first_name);
                            user.set('lastName', userInfo.last_name);
                            user.set('gender', userInfo.gender);
                            user.set('linkToFb', userInfo.link);
                            user.set('fullName', userInfo.name);
                            user.set('profilePhotoUrl', avatar);
                            user.set('points', 0);
                            user.set('type', 'customer');
                            user.set('likes', 0);
                            user.set('shares', 0);
                            user.save();
                            self.postFBLogin(user);
                        });
                    });
                } else {
                    self.postFBLogin(user);
                }
            },
            error: function(user, error) {
                alert("User cancelled the Facebook login or did not fully authorize. Error =" + error.message);
            }
        });
    };

    this.postFBLogin = function(user) {
        var sessionToken = user._sessionToken;
        // Post the login
        $.ajax({
            url: '/fblogin',
            type: 'post',
            data: {
                sessionToken: sessionToken
            },
            success: function(data) {

                // If an error, show the prompt
                if (data.errorCode === 101) {
                    alert("Facebook login error.");
                }

                window.location = '/user';
            },
            error: function(error) {
                alert("postFBLogin -- post error = " + error);
            }
        });
    }
};

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
};