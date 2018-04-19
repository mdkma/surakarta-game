firebase.auth().onAuthStateChanged(function(_user) {
    user = _user;
    console.log(user.email);
	if (user != null) {

		database.ref("leaderboard/"+uid).once("value", function(snapshot) {
            userInfo = snapshot.val();
            document.getElementById("nameInput").value = name;
            document.getElementById("emailInput").value = email;
            if (userInfo.gender != null ){
                document.getElementById("genderInput").value = userInfo.gender;
            }
            if (userInfo.age != null){
                document.getElementById("ageInput").value = userInfo.age;
            }
            document.getElementById("scoreInput").value = userInfo.score;
            document.getElementById("winsInput").value = userInfo.wins;
            document.getElementById("lossesInput").value = userInfo.losses;
        });
	} else {
		window.location.href = 'index.html';
	}
});

function updateProfile() {
    var _gender = document.getElementById("genderInput").value;
    var _age = document.getElementById("ageInput").value;
    var updates = {};
    if (_gender!="-- Please Select --") {
        updates.gender = _gender;
    }
    if (_age!="" && _age>=0) {
        updates.age = _age; 
    }
    database.ref('leaderboard/'+firebase.auth().currentUser.uid).update(updates).then(function() {
        document.getElementById("updateStatus").innerHTML = "Update Successfully!";
    });
}
