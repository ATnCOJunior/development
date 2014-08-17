
//In order to authenticate your app, you must pass the authorization code 
//and your app secret to the Graph API token endpoint at 
//https://graph.facebook.com/oauth/access_token 

//If you plan on using the FB.api function to make calls to their Graph API, 
//then you need the code to get the access token. But if you 
//only need to authenticate the user, then what you have will do that just fine.

function FacebookMod(facebookId) {
	//this.applicationId = parseApplicationId,
	//this.jsKey = parseJavascriptKey,
	this.facebookId = facebookId;
	//this.accessToken;
	//this.currentUserID;
	
	this.init = function() {
		Parse.FacebookUtils.init({
			appId: this.facebookId,
			xfbml: true,
			version: 'v2.0'
		});
		
		FB.init({
			appId      : this.facebookId,
			xfbml      : true,
			version    : 'v2.0'
        });
	},

	this.login = function() {
		this.init();
		var self = this;
		Parse.FacebookUtils.logIn("public_profile, email, user_friends, publish_actions", {
			success: function(user) {
				console.log(user);
				if (!user.existed()){ //sign up as new user
                    self.currentUserInfo(function(status) {
						if (status) {
							self.getUserLoginStaus(function(loginStatus){
								if(loginStatus){
									window.location.href = "/user";
								}
								else {
									alert("something went wrong when calling getUserLoginStaus under FacebookUtils login");
									window.location.href = "/";
								}
							});
							
						} else {
							alert("Login Failed");
							window.location.href = "/";
						}
					});
					
				} else { //response is null or have error
					self.currentUserInfo(function(status) {
					
						if (status) {
							window.location.href = "/user";
						} else {
							alert("Login Failed");
							window.location.href = "/";
						}
					});
				}					

			},	
			error: function(user, error) {
			  console.log(JSON.stringify(error, null, " "));
			  alert(JSON.stringify(error));
			  alert("User cancelled the facebook login or did not fully authorize");
			}
		});
	}, 
	
	this.currentUserInfo = function(callback) {
		var self = this;
		FB.api('/me', function(userInfo){
			FB.api('/me/picture', function(imageURL){
				userInfo.data = imageURL.data;
				
				self.insertUser(Parse.User.current(), userInfo, function(status) {
					callback(status);
				});
			});
		});
	},

	this.insertUser = function(user, userInfo, callback) {
	
		user.save(null, {
			success: function(user) {
				user.set("emailaddress", userInfo.email);
				user.set('firstName', userInfo.first_name);
				user.set('lastName', userInfo.last_name);
				user.set('gender', userInfo.gender);
				user.set('linkToFb', userInfo.link);
				user.set('fullName', userInfo.name);
				user.set('profilePhotoUrl', userInfo.data.url);
				user.set('points', 0);
				
				user.save();
				callback(true);
			}, 
			error: function (user, error) {
				callback(false);
			}
		});
	},

	this.getUserLoginStaus = function(callback) {
		FB.getLoginStatus(function(response) {
			
			callback(response.status, response);
			
			//if response.status === 'connected' 
				// the user is logged in and has authenticated your
				// app, and response.authResponse supplies
				// the user's ID, a valid access token, a signed
				// request, and the time the access token 
				// and signed request each expire

			//if response.status === 'not_authorized'
				// the user is logged in to Facebook, 
				// but has not authenticated your app
			// else {
				//the user isn't logged in to Facebook.
		
		});
	},

	this.getUserInfo = function(callback) {
		this.init();
		var user = Parse.User.current();

		var json = { 
			lastName: user.get("lastName"),
			imageURL: user.get("profilePhotoUrl"),
			fullName: user.get("fullName"),
			username: user.get("username"),
			email: user.get("emailaddress"),
			gender: user.get("gender"),
			facebookLink: user.get("linkToFb"),
			points: user.get("points")
		};
		
		callback(json);
	},
	
	this.logout = function() {
		alert('logging you out');
		Parse.FacebookUtils.logOut();
	},

	this.feed = function(link){
		alert(link);
		
		FB.ui(
		{
		    method: 'share',
		    href: link
		},
		function(response) {
			if (response && !response.error_code) {
		      alert('Posting completed.');
		      alert("response id recieved is" + response.objectId);
		    } else {
		    	console.log(response.error_code);
		      alert('Error while posting.');
		    }
		  }
		);
			alert("FB.ui is being entered!");
	},
	

    function checkPermissions() {
		FB.api('/me/permissions', function(response) {
			console.log(response);
		});
	};


};
