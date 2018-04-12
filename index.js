var SVG_NS = 'http://www.w3.org/2000/svg';

now = [[1, 1, 1, 1, 1, 1],
			 [0, 1, 1, 1, 1, 1],
       [1, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0],
       [2, 2, 2, 2, 2, 2],
       [2, 2, 2, 2, 2, 2]]
       
colors = ["none", "black", "red"]
       
function draw (now) {
	var board = document.querySelector('svg')
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 6; x++) {
    	if (now[y][x] != 0) {
        var circle = document.createElementNS(SVG_NS, "circle")
        circle.setAttribute("id", `x${x}y${y}`)
        circle.setAttribute("cx", x * 100 + 300)
        circle.setAttribute("cy", y * 100 + 300)
        circle.setAttribute("r", 40)
        circle.setAttribute("fill", colors[now[y][x]])
        circle.addEventListener("click", function() {
          movable(now, x, y)
          console.log("movable", x, y)
        })
        board.appendChild(circle)
      }
    }
  }
}

// function movable (now, x, y) {
// 	var board = document.querySelector('svg')
//   //var circle = document.getElementById(`x${x}y${y}`)
  
//   // normal moves
//   var moves = []
//   for (let yy = Math.max(0, y - 1); yy <= Math.min(5, y + 1); yy++) {
//   	for (let xx = Math.max(0, x - 1); xx <= Math.min(5, x + 1); xx++) {
//       console.log(xx, yy)
//   		if (now[yy][xx] == 0) {
//         moves.push([xx, yy])
//         console.log(xx, yy)
// 			}
// 		}
// 	}
//   console.log(moves)
//   for (let i = 0; i < moves.length; i++) {
//   	var newCircle = document.createElementNS(SVG_NS, "circle")
//     newCircle.setAttribute("id", `x${moves[i][0]}y${moves[i][1]}`)
//     newCircle.setAttribute("cx", moves[i][0] * 100 + 300)
//     newCircle.setAttribute("cy", moves[i][1] * 100 + 300)
//     newCircle.setAttribute("r", 35)
//     newCircle.setAttribute("stroke-width", 5)
//     newCircle.setAttribute("stroke", colors[now[y][x]])
//     newCircle.setAttribute("fill", "none")
//     newCircle.addEventListener("click", function() {
//       move(now, x, y, moves, moves[i][0], moves[i][1])
//       console.log("move", x, y, moves[i][0], moves[i][1])
//     })
//     board.appendChild(newCircle)
//   }
  
//   // catch moves

// }

// function move (now, x, y, moves, nx, ny) {
// 	var board = document.querySelector('svg')
//   document.getElementById(`x${x}y${y}`).remove()
//   for (var i = 0; i < moves.length; i++) {
//   	document.getElementById(`#x${moves[i][0]}y${moves[i][1]}`).remove()
//   }
  
//   // normal moves
//   var path = document.createElementNS(SVG_NS, "path")
//   path.setAttribute("id", `x${x}y${y}nx${nx}ny${ny}`)
//   path.setAttribute("stroke-width", 10)
//   path.setAttribute("stroke", "none")
//   path.setAttribute("fill", "none")
//   path.setAttribute("d", `M 0 0 L ${(nx - x) * 100} 0 L 0 ${(ny - y) * 100}`)

//   var mpath = document.createElementNS(SVG_NS, "mpath")
//   mpath.setAttribute("xlink:href", `#x${x}y${y}nx${nx}ny${ny}`)

//   var animate = document.createElementNS(SVG_NS, "animateMotion")
//   animate.setAttribute("dur", "3s")
//   animate.setAttribute("fill", "freeze")
//   animate.appendChild(mpath)

//   var newCircle = document.createElementNS(SVG_NS, "circle")
//   newCircle.setAttribute("id", `x${nx}y${ny}`)
//   newCircle.setAttribute("cx", x * 100 + 300)
//   newCircle.setAttribute("cy", y * 100 + 300)
//   newCircle.setAttribute("r", 40)
//   newCircle.setAttribute("fill", colors[now[y][x]])
//   newCircle.appendChild(animate)
  
//   board.appendChild(newCircle)

//   now[ny][nx] = now[y][x]
//   now[y][x] = 0

//   // catch moves
  
// }

draw(now)