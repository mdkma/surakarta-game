var database = firebase.database();

// function saveTest() {
//     window.alert("hhaha");
//     firebase.database().ref('users/').set({
//         t1: 'wo'
//     });
//     window.alert("555");
// }

// saveTest();

var turn = 1; // 0 for black, 1 for red
var capture_ai = 0;
var capture_you = 0;
var dragSrc = '';
var availableNormalMoves = [];
var availableCaptures = [];

function nextRound() {
    console.log('--------------------next round');
    updateProgressCloud();
    // check win/lose in this round
    if ((capture_ai >= 12) || (capture_you) >= 12){
        stop();
    }
    turn = 1 - turn;
    if (turn === 0){//AI's turn
        document.getElementById('turn').innerHTML = "It's Mr. AI's Turn";
        document.getElementById('turn').style.color = 'black';
        for (i = 0; i < 2; i++) { 
            for (j = 0; j < 6; j++){
                if (document.getElementById('p'+i+'-'+j)){
                    document.getElementById('p'+i+'-'+j).style.opacity = 1;
                    document.getElementById('p'+i+'-'+j).setAttribute("draggable", "true");
                }
            }
        }
        for (i = 4; i < 6; i++) { 
            for (j = 0; j < 6; j++){
                if (document.getElementById('p'+i+'-'+j)){
                    document.getElementById('p'+i+'-'+j).style.opacity = 0.5;
                    document.getElementById('p'+i+'-'+j).setAttribute("draggable", "false");
                }
            }
        }
    } else {
        document.getElementById('turn').innerHTML = "It's Your Turn";
        document.getElementById('turn').style.color = 'red';
        for (i = 0; i < 2; i++) { 
            for (j = 0; j < 6; j++){
                if (document.getElementById('p'+i+'-'+j)){
                    document.getElementById('p'+i+'-'+j).style.opacity = 0.5;
                    document.getElementById('p'+i+'-'+j).setAttribute("draggable", "false");
                }
            }
        }
        for (i = 4; i < 6; i++) { 
            for (j = 0; j < 6; j++){
                if (document.getElementById('p'+i+'-'+j)){
                    document.getElementById('p'+i+'-'+j).style.opacity = 1;
                    document.getElementById('p'+i+'-'+j).setAttribute("draggable", "true");
                }
            }
        }
    }
} 

function stop(){
    if (capture_ai > capture_you){
        alert('GAME STOP!\nMr. AI Won!');
    } else if (capture_ai < capture_you){
        alert('GAME STOP!\nYou Won! Congratulations!');
    } else {
        alert('GAME STOP!\nYou and Mr. AI leave same amount of pieces on the board, nobody wins.');
    }
}

function restart(){
    location.reload();
}

function capture(){
    if (turn === 0){ // now it's black turn, captured a red piece
        capture_ai += 1;
        document.getElementById('capture-ai').innerHTML = capture_ai;
    } else {
        capture_you += 1;
        document.getElementById('capture-you').innerHTML = capture_you;
    }
}

// FIREBASE OPERATIONS

function updateProgressCloud(){
    var locForPieces = {};
    for (i = 0; i < 2; i++){
        for (j = 0; j < 6; j++){
            if (document.getElementById('p'+i+'-'+j) != null){
                locForPieces['p'+i+'-'+j] = document.getElementById('p'+i+'-'+j).parentElement.id;
            } else {
                // this piece is already been captured
                locForPieces['p'+i+'-'+j] = 'captured';
            }
        }
    }
    for (i = 4; i < 6; i++){
        for (j = 0; j < 6; j++){
            if (document.getElementById('p'+i+'-'+j) != null){
                locForPieces['p'+i+'-'+j] = document.getElementById('p'+i+'-'+j).parentElement.id;
            } else {
                // this piece is already been captured
                locForPieces['p'+i+'-'+j] = 'captured';
            }
        }
    }
    database.ref('battle/').set({
        board: locForPieces
    });

}

function initPieces(){
    document.getElementById('startPage').style.display='none';
    html = '';
    for (i = 0; i < 2; i++) { 
        html += '<tr>';
        for (j = 0; j < 6; j++){
            html += "<td id='b"+i+"-"+j+"' ondrop='drop(event)' ondragover='allowDrop(event)'><div id='p"+i+"-"+j+"' class='piece piece1' draggable='true' ondragstart='drag(event)'></div></td>"
        }
        html += '</tr>';
    }
    for (i = 2; i < 4; i++) { 
        html += '<tr>';
        for (j = 0; j < 6; j++){
            html += "<td id='b"+i+"-"+j+"' ondrop='drop(event)' ondragover='allowDrop(event)'></td>"
        }
        html += '</tr>';
    }
    for (i = 4; i < 6; i++) { 
        html += '<tr>';
        for (j = 0; j < 6; j++){
            html += "<td id='b"+i+"-"+j+"' ondrop='drop(event)' ondragover='allowDrop(event)'><div id='p"+i+"-"+j+"' class='piece piece2' draggable='true' ondragstart='drag(event)'></div></td>"
        }
        html += '</tr>';
    }
    document.getElementById('table').innerHTML = html;
    // updateProgressCloud();
    nextRound();
}

function allowDrop(ev) {
    ev.preventDefault();
}

function detectAvailable(x, y, id, dragSrc){
    availableNormalMoves = [];
    availableCaptures = [];
    // detect available locations by normal move
    for (i = x-1; i < x+2; i++){
        for (j = y-1; j < y+2; j++){
            var ele = document.getElementById('b'+j+'-'+i);
            if (ele != null){
                if (ele.childNodes.length <= 0){
                    document.getElementById('b'+j+'-'+i).style.border = '1px solid black';
                    availableNormalMoves.push('b'+j+'-'+i);
                }
            }
        }
    }
    // detect potential capture pieces
    var pts = initSearchPoints(x, y);
    // console.log(pts);
    for (i = 0; i < pts.length; i++){
        temp_result = search(pts[i][0], pts[i][1], x, y, x, y, pts[i][2]);
        if (temp_result != ""){
            // check whether this point is from opposite side or not
            var ele = document.getElementById(temp_result);
            if (ele != null){
                if (ele.childNodes.length > 0){
                    if (turn === 0){// black turn
                        if (ele.childNodes[0].id[1] > 3){ // from opposite side
                            availableCaptures.push(temp_result);
                        }
                    } else {//red turn
                        if (ele.childNodes[0].id[1] < 3){ // from opposite side
                            availableCaptures.push(temp_result);
                        }
                    }
                }
            }
        }
    }
    for (i = 0; i < availableCaptures.length; i++){
        document.getElementById(availableCaptures[i]).style.border = '1px solid red';
    }
    console.log('availableNormalMoves:', availableNormalMoves);
    console.log('availableCaptures:', availableCaptures);
}

function drag(ev) {
    // console.log('move from: ', ev.path[1].id);
    dragSrc = ev.path[0].id;
    var id = ev.path[1].id;
    var x = parseInt(id[3]);
    var y = parseInt(id[1]);
    ev.dataTransfer.setData("text", ev.target.id);
    detectAvailable(x, y, id, dragSrc);
}

function jump(my_x, my_y){
    if (Math.abs(my_y - my_x) < 3){ // left top and right buttom 8 points
        return [my_y, my_x, true];
    } else { // right top and left buttom 8 points
        return [(5-my_y), (5-my_x), true];
    }
}

function initSearchPoints(my_x, my_y){
    // for edge point, there are two possible directions
    // for not edge poitns, there are 2/4 possible directions
    if (my_x === 0){ //left edge
        return [jump(my_x, my_y), [my_x+1, my_y, false]];
    } else if (my_x === 5){ //right edge
        return [jump(my_x, my_y), [my_x-1, my_y, false]];
    } else if (my_y === 0){ //top edge
        return [jump(my_x, my_y), [my_x, my_y+1, false]];
    } else if (my_y === 5){ //bottom edge
        return [jump(my_x, my_y), [my_x, my_y-1, false]];
    } else { // not edge point
        return [[my_x, (my_y+1), false], [my_x, (my_y-1), false], [(my_x+1), my_y, false], [(my_x-1), my_y, false]];
    }
}

function nextOne(my_x, my_y, prev_x, prev_y){
    if (my_x === 0 || my_x === 5 || my_y === 0 || my_y ===5){ // corner points
        if ((my_x === prev_y && my_y === prev_x) || my_x+prev_y === 5 && my_y+prev_x === 5){
            // if last move is a jump, now same line/col move
            if (my_x === 0){// go down from top
                return [my_x+1, my_y, false];
            } else if (my_x === 5){// go up from button
                return [my_x-1, my_y, false];
            } else if (my_y === 0){// go right from most left
                return [my_x, my_y+1, false];
            } else if (my_y === 5){// go left from the most right
                return [my_x, my_y-1, false];
            }
        } else {
            // now must jump coz last move is not a jump but now at corner
            return jump(my_x, my_y);
        }
    } else { // not corner points
        // if previous move is also in the same line/column, can use formula
        return [(2*my_x-prev_x), (2*my_y-prev_y), false];
    }
}

function search(my_x, my_y, prev_x, prev_y, start_x, start_y, circle) {
    // console.log(my_x, my_y);
    // Terminate Condition: go back to start point
    if (my_x === start_x && my_y === start_y){
        return "";
    }
    // Detect whether capture
    var ele = document.getElementById('b'+my_y+'-'+my_x);
    if (ele != null){
        if (ele.childNodes.length > 0){
            // console.log(ele.id);
            // console.log(ele.childNodes[0]);
            if (circle === true){
                return ele.id;
            } else {
                return "";
            }
        }
    }
    // Get next place
    nextOneAxis = nextOne(my_x, my_y, prev_x, prev_y);
    if (circle != true){
        if (nextOneAxis[2] === true){
            circle = true;
        }
    }
    // Search next place
    return search(nextOneAxis[0], nextOneAxis[1], my_x, my_y, start_x, start_y, circle);
}

function drop(ev) {
    // console.log('move to: ', ev.target.id);
    ev.preventDefault();
    finishFlag = false;
    // check whether don't move
    if (dragSrc === ev.target.id){
        alert('YOU ARE BACK!\nYou move this piece back to its original position. Please choose another move.');
    } else if (ev.target.id[0] === 'p'){ // move manually on a piece
        if (availableCaptures.indexOf(ev.path[1].id) != -1){
            // real capture
            alert('CAPTURE!');
            document.getElementById(ev.path[1].id).innerHTML = "";
            capture();
            // move to that location
            var data = ev.dataTransfer.getData("text");
            ev.path[1].appendChild(document.getElementById(data));
            finishFlag = true;
        } else{
            alert('WOOP! YOU CAN\'T CAPTURE IT!\nOther piece there and can\'t capture that piece. Please choose another move.');
        }
    } else{
        // move to that location
        if (ev.dataTransfer){ // manually
            console.log('****manually');
            var data = ev.dataTransfer.getData("text");
            ev.target.appendChild(document.getElementById(data));
            finishFlag = true;
        } else { // automatically
            if (ev.target.childNodes.length <= 0){
                console.log('****auto move: normal');
                // Case 2: nothing on that location, just move
                ev.target.appendChild(document.getElementById(dragSrc));
                finishFlag = true;
            } else {
                // Case 1: some pieces on that location, it's a capture
                // real capture
                console.log('****auto move: capture');
                alert('CAPTURE!');
                document.getElementById(ev.target.id).innerHTML = "";
                capture();
                // move to that location
                ev.target.appendChild(document.getElementById(dragSrc));
                finishFlag = true;
            }
        }
    }
    // remove reminder border
    var t = document.getElementById("table"),
        tableRows = t.getElementsByTagName("tr"),
        r = [], i, len, tds, j, jlen;

    for ( i =0, len = tableRows.length; i<len; i++) {
        tds = tableRows[i].getElementsByTagName('td');
        for( j = 0, jlen = tds.length; j < jlen; j++) {
            tds[j].style.border = '1px solid transparent';
        }
    }
    if (finishFlag){
        nextRound();
    }
}

var ref = database.ref("battle/board");
ref.on("value", function(snapshot) {
    updateProgressLocal(snapshot.val());
});

function updateProgressLocal(board){
    for (var key in board){
        var loc = board[key];
        // console.log('[][][][][]', key, loc);
        if (document.getElementById(key) != null){
            // this piece is still on the board
            originalLoc = document.getElementById(key).parentElement.id;
            // if (loc == "captured"){
            //     // Case 1: it's a captured piece, but not dismissed on local board
            //     alert('CAPTURE!');
            //     document.getElementById(originalLoc).innerHTML = "";
            //     capture();
            // } else
            if (originalLoc != loc && loc != "captured"){
                // Case 2: it's a move, should move this piece to new location
                // drop to that normal move
                dragSrc = key;
                var event = new DragEvent('drag');
                targetPiece = document.getElementById(loc);
                Object.defineProperty(event, 'target', {value: targetPiece, enumerable: true});
                drop(event);
            }
        } else {
            // this piece is not on the board, double check whether it's captured in DB
            if (loc != "captured"){
                console.error("DB_SYNC_ERROR: this piece should already captured, but DB shows not");
            }
        }
    }
}