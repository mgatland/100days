"use strict"
var canvas = document.querySelector(".gameCanvas")
var ctx = canvas.getContext('2d')
var eventEl = document.querySelector(".event")
var eventTextEl = document.querySelector(".eventText")
var eventButtonEl = document.querySelector(".eventButton")
var inventoryEl = document.querySelector(".inventory")
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

var loaded = false

var spriteImage = new Image()
spriteImage.src = 'sprites.png'
spriteImage.addEventListener('load', function() {
  loaded = true
}, false)

function tick() {
  if (loaded) {
  	tickGame()
  }
	window.requestAnimationFrame(tick)
}
window.requestAnimationFrame(tick)

//art stuff
var scale = 3
var shipSprite = {x:0, y:0, width:17, height: 8}
var planetSprites = [
{x:0,y:8,width:9,height:9}
]

var planetNames = ["Earth", "Medusa", "Argon", "Ewaste", 
"Trailer", "Music", "Game", "Mercurious", "Venux", 
"Eart", "Mart", "Juperella", "Saturdine", "Ureally", 
"Neptellia", "Pollon"
]

//game stuff
var worldWidth = 500
var worldHeight = 600
var margin = 60
var ship = {
	pos: {x:100, y:100, angle:1.2},
	sprite:shipSprite,
	isInWarp: false,
	landed:false,
	speed: 0,
	maxSpeed: 3,
	acceleration: 0.1,
	warpTime: 0,
	items: []
}


var allItems = []
allItems.push({name: "Warp Coil", value: 1})
allItems.push({name: "Space Medicine", value: 1})
allItems.push({name: "Alien Goop", value: 1})
allItems.push({name: "Illegal Weapons", value: 1})
allItems.push({name: "Broken Time Machine", value: 1})
allItems.push({name: "Long-range Torpedoes", value: 1})
allItems.push({name: "Memento from the Original Series", value: 1})
allItems.push({name: "Rare Meats", value: 1})
allItems.push({name: "Exotic Meats", value: 1})
allItems.push({name: "Cassette Tape", value: 1})
allItems.push({name: "LiPo Batteries (volatile)", value: 1})

var timeLeft = 5 * 365 - 1;
var planets = []
for (var i = 0; i < 10; i++) {addPlanet()}

var selectedPlanet = null

function tickGame() {
	//gameplay
	if (ship.isInWarp)
	{
		ship.warpTime++
		timeLeft -= 1
		ship.speed = Math.min(ship.speed + ship.acceleration, ship.maxSpeed)
		var turnSpeed = 0.05 + Math.max(0, ship.warpTime-60*1.5) * 0.001
		var angle = angleTo(ship.pos, ship.target.pos)
		ship.pos.angle = turnTowards(ship.pos.angle, angle, turnSpeed);
		moveAtAngle(ship.pos, ship.speed, ship.pos.angle)
		var dist = distance(ship.pos, ship.target.pos)
		if (dist < 4) {
			ship.isInWarp = false
			ship.landed = true
			showPlanetInfo()
		}
	}

	//rendering
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.font = "20px sans-serif"
	ctx.fillColor = "black";
	ctx.fillText(timeLeftInDays() + " days remaining", worldWidth - 200, 30)
	planets.forEach(drawPlanet)
	drawSprite(ship.pos, ship.sprite)
}

function warpTo(planet) {
	ship.isInWarp = true
	ship.target = planet
	ship.warpTime = 0
	hidePlanetInfo()
}

function addPlanet() {
	var planet = {
		pos:{x: randomX(), y:randomY(), angle:0},
		sprite: pickRandom(planetSprites)
	}
	planet.name = pickRandomAndRemove(planetNames)
	planet.description = generatePlanetDescription()
	planets.push(planet)
	var random = Math.random();
	if (random < 0.33) {
		planet.type = "trade"
		planet.items = []
		planet.items.push(pickRandomAndRemove(allItems))
		planet.items.push(pickRandomAndRemove(allItems))
		planet.items.push(pickRandomAndRemove(allItems))
	} else {
		planet.type = "item"
		planet.item = pickRandomAndRemove(allItems)
	}
}

//drawing

function drawPlanet(planet) {
	drawSprite(planet.pos, planet.sprite)
	if (planet === selectedPlanet) {
		ctx.font = "14px sans-serif"
		ctx.fillColor = "black"
		ctx.textAlign = "center"
		ctx.fillText(planet.name, planet.pos.x, planet.pos.y-25)
		if (planet !== ship.target) {
			ctx.fillText("Click again", planet.pos.x, planet.pos.y+25+16)
			ctx.fillText("to visit", planet.pos.x, planet.pos.y+25+16+17)
		}
	}
}

function drawSprite(pos, sprite) {
	ctx.translate(pos.x, pos.y)
	ctx.rotate(pos.angle)
	ctx.drawImage(spriteImage, 
		sprite.x, sprite.y, 
		sprite.width, sprite.height,
	  -sprite.width/2*scale, -sprite.height/2*scale,
	  sprite.width*scale, sprite.height*scale)
	ctx.rotate(-pos.angle)
	ctx.translate(-pos.x, -pos.y)
}

//utilities

function randomX() {
	return Math.floor(Math.random() * (worldWidth - margin * 2)) + margin
}

function randomY() {
	return Math.floor(Math.random() * (worldHeight - margin * 2)) + margin
}

function pickRandom(list) {
	var i = Math.floor(Math.random() * list.length)
	return list[i]
}

function pickRandomAndRemove(list) {
	var i = Math.floor(Math.random() * list.length)
	var pick = list[i]
	//list.splice(i, 1) fixme we don't remove
	return pick
}

function timeLeftInDays() {
	return Math.round((timeLeft * 10)) / 10;
}

function distance(one, two) {
	var a = one.x - two.x;
	var b = one.y - two.y;
	return Math.sqrt(a * a + b * b);
}

function angleTo(p1, p2) {
	return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

function moveAtAngle(pos, speed, angle)
{
	pos.x += speed * Math.cos(angle);
	pos.y += speed * Math.sin(angle);
}

var twoPi = Math.PI * 2
function turnTowards(startAngle, endAngle, rate) {
	var angle = startAngle
	var turnDir = (startAngle-endAngle+twoPi)%twoPi>Math.PI ? 1: -1
	var turnAmount = Math.abs(Math.atan2(Math.sin(startAngle-endAngle), Math.cos(startAngle-endAngle)))
	angle += turnDir * Math.min(rate, turnAmount);
	angle = (angle + twoPi) % twoPi;
	return angle
}

function generatePlanetDescription()
{
	var prefix = ["A lush","A dangerous", "A friendly", "A dramatic", "An icy", "A firey", 
	"A desolate", "A squishy", "A colourful", "A spikey", "A wind-swept"]
	var prefix2 = ["forest", "water", "city", "desert", "totalitarian", "libertarian", "pre-industrial", "high-tech", "barbaric", "unattractive"]
	var noun = ["world", "planet", "environment", "place"]
	return pickRandom(prefix) + " " + pickRandom(prefix2) + " " + pickRandom(noun) + ".";
}

//GUI

function showPlanetInfo() {
	document.querySelector(".planetInfo").classList.remove("hidden")
	document.querySelector(".travelInfo").classList.add("hidden")
	document.querySelector(".locationName").innerHTML = ship.target.name
	document.querySelector(".locationDescription").innerHTML = ship.target.description
	if (ship.target.type === "item") {
		eventEl.classList.add("good")
		eventTextEl.innerHTML = "Captain, we found something!"
		eventButtonEl.innerHTML = "Take the " + ship.target.item.name
		eventButtonEl.classList.remove("hidden")
	} else if (ship.target.type === "searched") {
		eventEl.classList.add("good")
		eventTextEl.innerHTML = "We've searched this planet."
		eventButtonEl.classList.add("hidden")
	} else {
		eventEl.classList.remove("good")
		eventTextEl.innerHTML = "There's nothing much here."
		eventButtonEl.classList.add("hidden")
	}
	
}

function hidePlanetInfo() {
	document.querySelector(".planetInfo").classList.add("hidden")
	document.querySelector(".travelInfo").classList.remove("hidden")
}

function showInventory() {
	inventoryEl.innerHTML = ""
	ship.items.forEach(function (item) {
		var itemEl = document.createElement("div")
		itemEl.innerHTML = item.name
		inventoryEl.appendChild(itemEl)
	})
}

eventButtonEl.addEventListener("click", function (event) {
	if (ship.target.type === "item") {
		ship.items.push(ship.target.item)
		ship.target.item = undefined
		ship.target.type = "searched"
		showPlanetInfo()
		showInventory()
	}
})

canvas.addEventListener("click", function (event) {
	var oldSelection = selectedPlanet;
	var mousePos = {x:event.offsetX, y:event.offsetY}

	//find closest planet
	function closestCallback (best, next) {
		var newDist = distance(next.pos, mousePos)
		var oldDist = (best != null) ? distance(best.pos, mousePos) : 9999
		if (newDist < oldDist && newDist < 64) return next
		if (oldDist <= newDist && oldDist < 64) return best
		return null
	}
	selectedPlanet = planets.reduce(closestCallback)
	event.preventDefault()

	if (selectedPlanet === oldSelection && oldSelection != null) {
		warpTo(selectedPlanet);
	}
})

//startup
ship.items.push(pickRandomAndRemove(allItems))
ship.items.push(pickRandomAndRemove(allItems))
showInventory()
hidePlanetInfo()