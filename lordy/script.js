"use strict"

var messagesEl = document.querySelector(".messages")

document.addEventListener("click", function (event) {
	if (event.target.localName === "a") {
		event.preventDefault()
		doAction(event.target.getAttribute("href"))
	}
})

function doAction(action) {
	switch (action) {
		case "aboutme": aboutMe()
			break
		default:
	}
	if (action.indexOf("goto") === 0) {
		gotoRoom(action.substring(5))
	}
	if (action.indexOf("local " === 0)) {
		gotoLocal(action.substring(6))
	}
}

function aboutMe() {
	addMessage("You have 10 hitpoints. You're holding a teapot.", false)
}

function addMessage(text, removeOldLinks = true) {
		if (removeOldLinks) removeOldAnchors()
		var el = document.createElement("div")
		//el.classList.add("orderItem")
		el.innerHTML = text
		messagesEl.appendChild(el)
}

function gotoRoom(room) {
	currentRoom = rooms[room]
	addMessage(parse(currentRoom.enter))
}

function gotoLocal(local) {
	addMessage(parse(room[local]), false)
}

function parse(string) {
	var result = string.replace(/\[/g, '<a href="');
	var result = result.replace(/\|/g, '">');
	var result = result.replace(/\]/g, '</a>');
	return result
}

var rooms = {}
rooms.bar = 
{enter:
	"You are at the Wool Inn. People from all walks of life hang around getting drunk. [goto bartender|Talk to the bartender] or [goto town|leave]."
}
rooms.bartender =
{
	enter: "Seth the bartender is mixing drinks. Ask him about [local secrets|secrets] or [local life|his life], or [goto bar|leave]",
	secrets: "Seth leans forward and lowers his voice. \"People say there's a lot of monsters in the woods. Not really a secret, actually. Everyone knows.\"",
	life: "\"I'm working on a new game, a kind of 2d platform game MMO. I hope it does well.\""
}


function removeOldAnchors() {
	var anchors = document.querySelectorAll(".messages a");
	for ( var i=0; i < anchors.length; i++ ) {
	    var span = document.createElement("span");
	    span.className = "oldLink"
	    span.innerHTML = anchors[i].innerHTML;
	    anchors[i].parentNode.replaceChild(span, anchors[i]);
	}
}\\\\

var currentRoom
gotoRoom("bar")