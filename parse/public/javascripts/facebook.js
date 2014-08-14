function FacebookMod(facebookId) {
	//this.applicationId = parseApplicationId,
	//this.jsKey = parseJavascriptKey,
	this.facebookId = facebookId;
	
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

				if (!user.existed()){ //sign up as new user
                    self.currentUserInfo();
					window.location.href = "/user";
					
				} else { //response is null or have error
					self.currentUserInfo();
					window.location.href = "/user"
				}					

			},
			error: function(user, error) {
			  console.log(JSON.stringify(error, null, " "));
			  alert("User cancelled the facebook login or did not fully authorize");
			}
		});
	}, 
	
	this.currentUserInfo = function() {
		var self = this;
		FB.api('/me', function(userInfo){
			FB.api('/me/picture', function(imageURL){
				userInfo.data = imageURL.data;
				
				FB.api('me/permissions', function(permissionList) {
					console.log(JSON.stringify(permissionList));
				});
				
				self.insertUser(Parse.User.current(), userInfo);
			});
		
		});
	},
	
	this.insertUser = function(user, userInfo) {
	
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
	
	function logout() {
		Parse.FacebookUtils.logOut();
	},

	function checkPermissions() {
		FB.api('/me/permissions', function(response) {
			console.log(response);
		});
	};
}