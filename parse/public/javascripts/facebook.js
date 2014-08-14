function FacebookMod(facebookId) {
	//this.applicationId = parseApplicationId,
	//this.jsKey = parseJavascriptKey,
	this.facebookId = facebookId;
	
	this.init = function() {
		Parse.FacebookUtils.init({
			appId: this.facebookId,
			status: true,
			xfbml: true,
			version: 'v2.0'
		});
	
	},
	
	this.login = function() {
		this.init();
		
		Parse.FacebookUtils.logIn("public_profile, email, user_friends", {
			success: function(user) {
				console.log(JSON.stringify(user));	
			 	window.location.href = "/user";
			},
			error: function(user, error) {
			  console.log(JSON.stringify(error, null, " "));
			  alert("User cancelled the facebook login or did not fully authorize");
			}
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