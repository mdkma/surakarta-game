// Initialize Firebase
var config = {
    apiKey: "AIzaSyAGrQb35wvwEt6BVfHfzBfhRclRTiAsYgI",
    authDomain: "sarakarta-game.firebaseapp.com",
    databaseURL: "https://sarakarta-game.firebaseio.com",
    projectId: "sarakarta-game",
    storageBucket: "sarakarta-game.appspot.com",
    messagingSenderId: "903935335659"
  };
firebase.initializeApp(config);

var database = firebase.database();

var user;
var name, email, photoUrl, uid;

function initLeaderboard(_uid, _name, _email) {
	var postData = {
        name: _name,
        email: _email,
	    score: 1200,
	    wins: 0,
	    losses: 0
	};
	var updates = {};
	updates['/leaderboard/' + uid] = postData;
	database.ref().update(updates);
}


firebase.auth().onAuthStateChanged(function(_user) {
    user = _user;
    console.log(user.email);
	if (user != null) {
		name = user.displayName;
		email = user.email;
		photoURL = user.photoURL;
		uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
		               	// this value to authenticate with your backend server, if
		               	// you have one. Use User.getToken() instead.

		database.ref('/leaderboard/' + uid).once('value').then(function(snapshot) {
			if (snapshot.val()==null) {
				console.log("create new leaderboard!");
				initLeaderboard(uid, name, email);
			}
		});
	}
});