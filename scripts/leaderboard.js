
function LeaderBoard() {
    var userId = "TAqkdKHp8haLKiuPvBwLK5I14gY2";
    //var userId = firebase.auth().currentUser.uid;
    var userScore;
    var leaderboardRef = firebase.database().ref('/leaderboard/');
    var userInTop10 = false;


    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    var tbdy = document.createElement('tbody');
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.appendChild(document.createTextNode('Rank'));
    tr.appendChild(td);
    var td = document.createElement('td');
    td.appendChild(document.createTextNode('Name'));
    tr.appendChild(td);
    var td = document.createElement('td');
    td.appendChild(document.createTextNode('Score'));
    tr.appendChild(td);
    var td = document.createElement('td');
    td.appendChild(document.createTextNode('Wins'));
    tr.appendChild(td);
    var td = document.createElement('td');
    td.appendChild(document.createTextNode('Losses'));
    tr.appendChild(td);
    tbdy.appendChild(tr);

    var curRank = 1;
    leaderboardRef.orderByChild("score").limitToFirst(10).on("child_added", function(snapshot) {
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
        td.appendChild(document.createTextNode(snapshot.val().score));
        tr.appendChild(td);
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(snapshot.val().wins));
        tr.appendChild(td);
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(snapshot.val().losses));
        tr.appendChild(td);
        tbdy.appendChild(tr);
    });

    if (! userInTop10){
        var userRank = 1;
        leaderboardRef.orderByChild("score").on("child_added", function(snapshot) {
            if(snapshot.key == userId){
                td.appendChild(document.createTextNode(userRank));
                tr.appendChild(td);
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(snapshot.val().name));
                tr.appendChild(td);
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(snapshot.val().score));
                tr.appendChild(td);
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(snapshot.val().wins));
                tr.appendChild(td);
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(snapshot.val().losses));
                tr.appendChild(td);
                tbdy.appendChild(tr);
            }
            rank = rank + 1
        });
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
}