"use strict"

//4:37 pm - 4:57 pm

// to do:
// add walls
// you lose if you're not touching a wall
// multiple levels with different walls
// score goes up on different levels
// maybe speed increases?

var dirUp = {x:0,y:-1}
var dirDown = {x:0,y:1}
var dirRight = {x:1,y:0}
var dirLeft = {x:-1,y:0}
var dirs = [dirUp, dirDown, dirRight, dirLeft]

var btns = []
btns.push({x:40,y:gameHeight+110, width:80, height:80, text:"<", action:dirLeft})
btns.push({x:40+120,y:gameHeight+110, width:80, height:80, text:">", action:dirRight})
btns.push({x:40+60,y:gameHeight+20, width:80, height:80, text:"^", action:dirUp})
btns.push({x:40+60,y:gameHeight+200, width:80, height:80, text:"v", action:dirDown})

var playerSize = 32
var playerSpeed = 4

//game state
var score
var player
var level
var walls
var playerDir

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#333"
	ctx.fillRect(0, 0, width, gameHeight)

	drawLevel()

	//player
	ctx.fillStyle = "red"
	ctx.fillRect(player.x - playerSize/2, player.y - playerSize/2, playerSize, playerSize)

	//hud
	ctx.fillStyle = "#2c77cc"
	ctx.fillRect(0, gameHeight, width, height-gameHeight)

	ctx.fillStyle = "black"
	ctx.font = "30px monospace"
	var textY = gameHeight + 10
	ctx.textAlign = "left"
	ctx.textBaseline = "top"
	ctx.fillText("Score: " + score + " use arrow keys", width/2-80, textY)
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
	ctx.strokeStyle = 'lightgreen'
	ctx.lineWidth = 2
	ctx.beginPath();
	for (var w = 0; w < walls.length; w++) {
		ctx.moveTo(w.start.x, w.start.y)
		ctx.lineTo(w.end.x, w.end.y)
	}
	ctx.stroke()
}

function start() {
	score = 0
	level = 0
	walls = []
	player = {x:Math.floor(width/2), y:Math.floor(gameHeight/2)}
	playerDir = dirUp
}

function update() {
	player.x += playerDir.x * playerSpeed
	player.y += playerDir.y * playerSpeed
}

function collidesAny(gridPos, list) {
	return list.some(t => t.x === gridPos.x && t.y === gridPos.y)
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