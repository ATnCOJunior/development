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
			version: 'v2.1',
			status: false
		});

		FB.init({
			appId: this.facebookId,
			xfbml: true,
			version: 'v2.1',
			status: true
		});
	},

	this.login = function() {
		this.init();

		// function convertToLocalTime(serverDate) {

		//     var dt = new Date(Date.parse(serverDate));
		//     var localDate = dt;

		//     var gmt = localDate;
	 //        var min = gmt.getTime() / 1000 / 60; // convert gmt date to minutes
	 //        var localNow = new Date().getTimezoneOffset(); // get the timezone
	 //        // offset in minutes
	 //        var localTime = min - localNow; // get the local time

		//     var dateStr = new Date(localTime * 1000 * 60);
		//     // dateStr = dateStr.toISOString("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"); // this will return as just the server date format i.e., yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
		//     dateStr = dateStr.toISOString("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
		//     //dateStr = dateStr.toString("yyyy-MM-dd'T'HH:mm:ss");
		//     return dateStr;
		// }

		FB.login(
			function(response) {
				if (response.status == 'connected') {
					console.log('logged in');

					var dt = new Date(response.authResponse.expiresIn + Date.now());
					console.log("response.authResponse.expiresIn: " + response.authResponse.expiresIn);
					console.log("dt: " + dt);
					var authData = {
							"expiration_date": dt.toISOString(),
							"id": response.authResponse.userID,
							"access_token": response.authResponse.accessToken
					};

					Parse.FacebookUtils.logIn(authData, {
						success: function(user) {
							console.log('user ' + user.getUsername() + ' has been signed up successfully via facebook.');
							console.log('Parse.User.current(): ' + JSON.stringify(Parse.User.current()));
							window.location.href = "/user";
						},
						error: function(user, error) {
							console.log(JSON.stringify(error, null, " "));
						}
					});
				} else {
					console.log('not logged in ' + JSON.stringify(response));
				}
			}, {
				scope: "public_profile, email, user_friends, publish_actions"
			}
		);


		// FB.login(function(response) {
		// 	FB.getLoginStatus(function(response) {
		// 		if (response.status === 'connected') {
		// 			Parse.FacebookUtils.logIn(response.authResponse, {
		// 				success: function(user) {
		// 					console.log(user);
		// 					if (!user.existed()) { //sign up as new user
		// 						self.currentUserInfo(function(status) {
		// 							if (status) {
		// 								self.getUserLoginStatus(function(loginStatus) {
		// 									if (loginStatus) {
		// 										window.location.href = "/user";
		// 									} else {
		// 										alert("something went wrong when calling getUserLoginStaus under FacebookUtils login");
		// 										window.location.href = "/";
		// 									}
		// 								});

		// 							} else {
		// 								alert("Login Failed");
		// 								window.location.href = "/";
		// 							}
		// 						});

		// 					} else { //response is null or have error
		// 						self.currentUserInfo(function(status) {

		// 							if (status) {
		// 								window.location.href = "/user";
		// 							} else {
		// 								alert("Login Failed");
		// 								window.location.href = "/";
		// 							}
		// 						});
		// 					}

		// 				},
		// 				error: function(user, error) {
		// 					console.log(JSON.stringify(error, null, " "));
		// 					alert(JSON.stringify(error));
		// 					alert("User cancelled the facebook login or did not fully authorize");
		// 				}
		// 			});
		// 		}
		// 	}, {
		// 		scope: 'public_profile, email, user_friends, publish_actions',
		// 		return_scopes: true
		// 	});
		// });
	},

	this.currentUserInfo = function(callback) {
		var self = this;
		FB.api('/me', function(userInfo) {
			FB.api('/me/picture', function(imageURL) {
				userInfoData = imageURL;

				self.insertUser(Parse.User.current(), userInfo, userInfoData, function(status) {
					callback(status);
				});
			});
		});
	},

	this.insertUser = function(user, userInfo, userInfoData, callback) {

		user.save(null, {
			success: function(user) {
				user.set("emailaddress", userInfo.email);
				user.set('firstName', userInfo.first_name);
				user.set('lastName', userInfo.last_name);
				user.set('gender', userInfo.gender);
				user.set('linkToFb', userInfo.link);
				user.set('fullName', userInfo.name);
				user.set('profilePhotoUrl', userInfoData);
				user.set('points', 0);
				user.set('type', 'customer');
				user.set('likes', 0);
				user.set('shares', 0);

				user.save();

				callback(true);
			},
			error: function(user, error) {
				callback(false);
			}
		});
	},

	this.getUserLoginStatus = function(callback) {
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

	this.feed = function(link) {
		alert(link);

		FB.ui({
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