
function LeaderBoard() {
    var user = firebase.auth().currentUser;
    var userId
    var user_login = true;
    if(!user){
        user_login = false;
        userId = -1;
    }
    else{
        userId = user.uid;
    }
    var userScore;
    var leaderboardRef = firebase.database().ref('/leaderboard/');
    var userInTop10 = -1;

    var body = document.getElementsByTagName('body')[0];
    var tbl = document.getElementById('leaderboard');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');

    var curRank = 1;
    leaderboardRef.orderByChild("score").limitToLast(10).on("child_added", function(snapshot) {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        if (snapshot.key == userId) {
            userInTop10 = true;
        }

        td.appendChild(document.createTextNode(curRank));
        curRank = curRank + 1;
        tr.appendChild(td);
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(snapshot.val().name));
        tr.appendChild(td);
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(snapshot.val().score * -1));
        tr.appendChild(td);
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(snapshot.val().wins));
        tr.appendChild(td);
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(snapshot.val().losses));
        tr.appendChild(td);
        tbdy.appendChild(tr);
    });
    if (userInTop10 !== true && userInTop10 != -1 && user_login){
        var userRank = 1;
        leaderboardRef.orderByChild("score").on("child_added", function(snapshot) {
            console.log(4);
            if(snapshot.key == userId){
                var tr = document.createElement('tr');
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(userRank));
                tr.appendChild(td);
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(snapshot.val().name));
                tr.appendChild(td);
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(snapshot.val().score * -1));
                tr.appendChild(td);
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(snapshot.val().wins));
                tr.appendChild(td);
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(snapshot.val().losses));
                tr.appendChild(td);
                tbdy.appendChild(tr);
            }
            userRank = userRank + 1
        });
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
}