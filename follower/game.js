"use strict"

//4:37 pm - 4:57 pm
//5:20 pm 5:33 pm
//11pm

// to do:
// [x] add walls
// [x] you lose if you're not touching a wall
// [x] multiple levels with different walls
// [x] score goes up on different levels
// [nah] maybe speed increases?

var dirUp = {x:0,y:-1}
var dirDown = {x:0,y:1}
var dirRight = {x:1,y:0}
var dirLeft = {x:-1,y:0}
var dirs = [dirUp, dirDown, dirRight, dirLeft]

var btns = []
btns.push({x:40,y:gameHeight+110, width:80, height:80, text:"⬅", action:dirLeft})
btns.push({x:40+120,y:gameHeight+110, width:80, height:80, text:"➔", action:dirRight})
btns.push({x:40+60,y:gameHeight+20, width:80, height:80, text:"⬆", action:dirUp})
btns.push({x:40+60,y:gameHeight+200, width:80, height:80, text:"⬇", action:dirDown})

var playerSize = 32
var playerSpeed = 5

//game state
var score
var player
var level
var walls
var playerDir
var lost

function draw() {
	//ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#FFD25A"
	ctx.fillRect(0, 0, width, gameHeight)

	drawLevel()

	//player
	ctx.fillStyle = "#fff"
	ctx.fillRect(player.x - playerSize/2, player.y - playerSize/2, playerSize, playerSize)
	ctx.lineWidth = 2
	ctx.strokeStyle = "#000"
	ctx.strokeRect(player.x - playerSize/2, player.y - playerSize/2, playerSize, playerSize)

	//hud
	ctx.fillStyle = "#57B196"
	ctx.fillRect(0, gameHeight, width, height-gameHeight)

	ctx.fillStyle = "black"
	ctx.font = "30px monospace"
	var textY = gameHeight + 10
	ctx.textAlign = "left"
	ctx.textBaseline = "top"
	ctx.fillText("Score: " + score + " use arrow keys", width/2-100, textY)
	btns.forEach(drawButton)
}

function drawButton(btn) {
	if (btn.down) {
		ctx.fillStyle = '#0094FF'
	} else {
		ctx.fillStyle = '#ccc'
	}
	ctx.fillRect(btn.x, btn.y, btn.width, btn.height)
	ctx.fillStyle = "black"
	ctx.font = "64px monospace"
	ctx.textAlign = "center"
	ctx.textBaseline = "top"
	ctx.fillText(btn.text, btn.x+btn.width/2, btn.y)
}

function drawLevel() {
	ctx.fillStyle = '#FF837B'
	ctx.lineWidth = 16
	walls.forEach(function (w) {
		ctx.fillRect(w.x, w.y, w.width, w.height)
	})
}

function start() {
	score = 0
	level = 0
	lost = false

	player = {x:0, y:Math.floor(gameHeight/2)}
	playerDir = dirRight

	loadNextLevel()
}

function update() {
	if (!lost) {
		player.x += playerDir.x * playerSpeed
		player.y += playerDir.y * playerSpeed

		if (hasFallenOff()) {
			lost = true
		} else if (player.x > width) {
			player.x -= width
			score++
			loadNextLevel()
		}
	}
}

function loadNextLevel() {
	level++
	walls = []
	var spans = Math.min(level, 13)
	//we cap it at 13 spans - the spanWidth must be > playerSize + playerSpeed + wallWidth
	var doubleFirst = false
	if (spans > 5) doubleFirst = true
	if (level === 1) {
		walls.push({x:0,y:gameHeight/2,width:width,height:10})
	}
	else {
		var y = player.y
		var spanWidth = width / spans
		console.log(spanWidth)
		var margin = 40
		for (var i = 0; i < spans; i++) {
			var newWall = {x:spanWidth*i,y:y,width:spanWidth+10,height:10}
			walls.push(newWall)
			if (i === 0 && doubleFirst) {
				newWall.width = newWall.width + spanWidth
				i++
			}
			var nextY = null
			while (nextY === null) {
				nextY = Math.floor(Math.random()*(gameHeight-margin*2))+margin
				if (Math.abs(nextY - y) < 50) nextY = null
			}
			var minY = Math.min(y, nextY)
			var maxY = Math.max(y, nextY)
			var wallHeight = maxY - minY
			walls.push({x:spanWidth*(i+1),y:minY,width:10,height:wallHeight})
			y = nextY
		}
	}

}

function hasFallenOff() {
	return !walls.some(t => collides(t, player))
}

function collides(wall, p) {
	return (p.x + playerSize/2 > wall.x && p.x - playerSize/2 < wall.x + wall.width
		&& p.y + playerSize/2 > wall.y && p.y - playerSize/2 < wall.y + wall.height)
}

window.addEventListener("keydown", function (e) {
	var dir = null
	switch (e.keyCode) {
		case 37: dir = dirLeft
		  break
		case 38: dir = dirUp
		  break
		case 39: dir = dirRight
		  break
		case 40: dir = dirDown
		  break
		}
	if (dir) playerDir = dir
})

function buttonPressed(action) {
	playerDir = action
}

function gameClicked () {}


start()
window.requestAnimationFrame(tick)