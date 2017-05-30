"use strict"

//3:18 eating \ research
//3:28 research, making - 5pm break
//5:14 restart - 6:11

var emptyColor = "rgba(0, 0, 0, 0)"
var maxHillheight = 0.6
var gravity = 0.05
var terrainData
var tanks = []
var shots = []

var btns = []
btns.push({x:30, y:30+gameHeight, width:100, height: 100, text:"<"})
btns.push({x:30+110, y:30+gameHeight, width:100, height: 100, text:">"})
btns.push({x:30+110*2, y:30+gameHeight, width:100, height: 45, text:"^"})
btns.push({x:30+110*2, y:30+gameHeight+55, width:100, height: 45, text:"v"})
btns.push({x:30+110*3+40, y:30+gameHeight, width:100, height: 100, text:"Fire"})


function update() {
	shots.forEach(updateShot)
	shots=shots.filter(s => !s.dead)
	if (shots.length === 0 && btns[4].down) {
		fire(tanks[0])
	}
	if (btns[0].down) rotateTurret(tanks[0], -0.03)
	if (btns[1].down) rotateTurret(tanks[0], 0.03)
	if (btns[2].down) changePowerSetting(tanks[0], 0.01)
	if (btns[3].down) changePowerSetting(tanks[0], -0.01)
}

function drawButton(btn) {
	if (btn.down) {
		ctx.fillStyle = '#0094FF'
	} else {
		ctx.fillStyle = '#ccc'
	}
	ctx.fillRect(btn.x, btn.y, btn.width, btn.height)
	ctx.fillStyle = "white"
	ctx.font = "30px monospace"
	ctx.fillText(btn.text, btn.x + 10, btn.y + 40)
}


function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.putImageData(terrainData, 0, 0)
	tanks.forEach(function (t) {
		ctx.fillStyle = "orange"
		ctx.translate(t.x, t.y)
		ctx.fillRect(-15,-15,30,30)
		ctx.rotate(t.angle)
		ctx.fillRect(0,-2,30,4)
		ctx.rotate(-t.angle)
		ctx.translate(-t.x, -t.y)
	})
	//player power bar
	ctx.fillStyle = "orange"
	var barHeight = tanks[0].power * 100
	ctx.fillRect(btns[3].x + 110, 30+gameHeight+100-barHeight,30,barHeight)

	shots.forEach(function (t) {
		ctx.fillStyle = "white"
		ctx.fillRect(t.x-5,t.y-5,10,10)
	})
	btns.forEach(drawButton)
}

function colorAtPoint(x,y) {
	if (x < 0 || x >= width || y < 0 || y >= gameHeight) return "OUTSIDE"
	x = Math.floor(x)
	y = Math.floor(y)
	var index = x*4+y*width*4
  var data = terrainData.data.slice(index, index + 4);
  var rgba = 'rgba(' + data[0] + ', ' + data[1] +
  ', ' + data[2] + ', ' + (data[3] / 255) + ')';
  return rgba
}

function updateShot(shot) {
	if (!canMove(shot.x, shot.y)) {
		shot.dead = true
	}
	shot.x += shot.vel.x
	shot.y += shot.vel.y
	shot.vel.y += gravity
}

function start() {
	var generator = new TerrainGenerator();
	ctx.fillStyle = "#ccc"
	for (var x = 0; x < width; x++) {
		var y = Math.floor(generator.getNext() * gameHeight * maxHillheight);
		ctx.fillRect(x, gameHeight-y, 1, gameHeight)
	}
	terrainData = ctx.getImageData(0,0,width,gameHeight)
	tanks.push({x: Math.floor(width / 10), y: 0, angle: Math.PI*1.5, power:0.2})
	tanks.push({x: Math.floor(width / 10 * 9), y: 0, angle: Math.PI*1.5, power:0.2})
	tanks.forEach(land)
	shots.push({x:width/2,y:50,vel:{x:6,y:0}})
}

start()

/*canvas.addEventListener("click", function (e) {
	var mouse = {x:event.offsetX, y:event.offsetY}
	//scale to lofi scale
	mouse.x = Math.floor(mouse.x * width / canvas.offsetWidth)
	mouse.y = Math.floor(mouse.y * height / canvas.offsetHeight)
	console.log(mouse.x + ":" + mouse.y)
	console.log(canMove(mouse.x, mouse.y))
})*/

function fire(tank) {
	var shot = {x:tank.x, y:tank.y, vel:{x:0,y:0}}
	applyForce(shot.vel, tank.angle, 6*tank.power + 1)
	moveInDirection(shot, tank.angle, 15)
	shots.push(shot)
}

function rotateTurret(tank, speed) {
	tank.angle += speed
	if (tank.angle > Math.PI * 2) tank.angle = Math.PI * 2
	if (tank.angle < Math.PI) tank.angle = Math.PI
}

function changePowerSetting(tank, amount) {
	tank.power += amount
	if (tank.power > 1) tank.power = 1
	if (tank.power < 0) tank.power = 0	
}

// gamey utilties

function land(tank) {
	while (canMove(tank.x, tank.y+5)) tank.y++
}

function canMove(x, y) {
	return (colorAtPoint(x, y) === emptyColor)
}

// utilities

function moveInDirection(pos, angle, distance) {
	pos.x += Math.cos(angle) * distance
	pos.y += Math.sin(angle) * distance
}

function applyForce(vel, angle, thrust) {
	vel.x += Math.cos(angle) * thrust
	vel.y += Math.sin(angle) * thrust
}

function TerrainGenerator() {

	var y = Math.random()
	var dY = 0
	var rateOfChange = 0.001
	var edgeBias = 0.001

	function updateDY () {
		if (y < 0.1 && dY < 0) {
			dY += Math.random() * rateOfChange - rateOfChange / 2 + edgeBias
		} else if (y > 0.9 && dY > 0) {
			dY += Math.random() * rateOfChange - rateOfChange / 2 - edgeBias
		} else {
			dY += Math.random() * rateOfChange - rateOfChange / 2
		}
	}

	function getNext() {
		y += dY
		updateDY()
		if (y < 0) {
			y = 0
			dY = 0
		}
		if (y > 1) {
			y = 1
			dY = 0
		}
		return y;
	}

  return {
      getNext: getNext
  };
};