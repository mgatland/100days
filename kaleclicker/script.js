var total = 0;
var pickTimer = 100;
var pickTimerElement = document.querySelector(".pickTimer");

var displayElement = document.querySelector(".total");
var messagesElement = document.querySelector(".messages");

var hint1 = false;
var hint2 = false;
var hint3 = false;

document.querySelector(".gardenPick").addEventListener("click", function () {
	if (pickTimer >= 100) {
		total++;
		pickTimer = 0;
		updateDisplay();
	}
})

var assets = [];

assets.push({
	unlocked: false,
	cost:20,
	buttonText: "Hire a seasonal worker",
	buyMessageText
: "You hired a seasonal worker.",
	pluralText: " seasonal workers",
	activityText: "Picking a leaf",
	count: 0,//mutable
	progress: 0,//mutable
	payoff: 1,
	percentEach: 0.2,
	codeName:"seasonalWorker"
});

assets.push({
	codeName:"smoothie",
	cost:60,
	buttonText: "Buy a Smoothie Machine",
	buyMessageText: "You bought a Smoothie Machine",
	pluralText: " Smoothie Machines",
	activityText: "Mixing smoothies",
	payoff: 20,
	percentEach: 0.1,
	//mutables:
	unlocked: false,
	count: 0,//mutable
	progress: 0//mutable
})

assets.push({
	codeName:"shirt",
	cost:150,
	buttonText: "Hire a trendy shirtsmith",
	buyMessageText: "You hired a trendy shirtsmith",
	pluralText: " Shirtsmiths",
	activityText: "Selling a kale shirt",
	payoff: 150,
	percentEach: 0.05,
	//mutables:
	unlocked: false,
	count: 0,//mutable
	progress: 0//mutable
})

assets.push({
	codeName:"builder",
	cost:300,
	buttonText: "Hire an avocado architect",
	buyMessageText: "You hired a avocado architect",
	pluralText: " architects",
	activityText: "Designing an avocado house",
	payoff: 1000,
	percentEach: 0.01,
	//mutables:
	unlocked: false,
	count: 0,//mutable
	progress: 0//mutable
})

assets.forEach(setupAsset);

function setupAsset(asset) {
	asset.countElement = document.querySelector("." + asset.codeName + "Display");
	asset.progressElement = document.querySelector("." + asset.codeName + "ProgressDisplay");
	asset.blockElement = document.querySelector("." + asset.codeName + "Block");
	asset.buttonElement = document.querySelector("." + asset.codeName + "Buy");
	asset.buttonElement.addEventListener("click", function () {
		buyAsset(asset)
	})
	setButtonText(asset);
}

function setButtonText(asset) {
	asset.buttonElement.innerHTML = asset.buttonText
 + " (" + asset.cost + " kale)";
}

function buyAsset(asset) {
	if (total >= asset.cost) {
		total -= asset.cost;
		addMessage(asset.buyMessageText);
		asset.cost = Math.floor(asset.cost * 1.1);
		setButtonText(asset);
		asset.count++;
	}
	updateDisplay();
}

//tick
setInterval(function () {
	assets.forEach(tickAsset);
	if (pickTimer < 100) {
		pickTimer += 6;
		pickTimerElement.innerHTML = Array(Math.max(1,Math.floor((100 - pickTimer) / 3))).join("|");
	} else {
		pickTimerElement.innerHTML = "";
	}
	updateDisplay();
}, 16)

function tickAsset(asset) {
	if (asset.count > 0) {
		asset.progress += asset.count * asset.percentEach;
		while (asset.progress > 100) {
			asset.progress -= 100
			total += asset.payoff;
		}
	}
}

function updateDisplay() {
	displayElement.innerHTML = total;
	assets.forEach(displayAsset);
	updateReactions();
}

function displayAsset(asset) {
	if (!asset.unlocked && total >= asset.cost) {
		asset.unlocked = true;
		asset.blockElement.classList.remove("hidden");
	}
	if (asset.count > 0) {
		asset.countElement.innerHTML = "You have " + asset.count + asset.pluralText;
		var percent = Math.floor(asset.progress);
		if (asset.count * asset.percentEach >= 50) {
			percent = 100;
		}
		asset.progressElement.innerHTML = asset.activityText + " (" + asset.payoff + " kale): " + percent + "%";
	}
}

function updateReactions() {
	if (!assets[0].unlocked) {
		if (total === Math.round(assets[0].cost * .25) && !hint1) {
			addMessage("Keep clicking!");
			hint1 = true;
		} else if (total === Math.round(assets[0].cost * .5) && !hint2) {
			addMessage("Come on!!");
			hint2 = true;
		} else if (total === Math.round(assets[0].cost * .75) && !hint3) {
			addMessage("Nearly there!!!");
			hint3 = true;
		}
	}
}

function addMessage(text) {
	var msgDiv = document.createElement('div');
	msgDiv.className = "message";
	msgDiv.innerHTML = text;
	messagesElement.appendChild(msgDiv);
	setTimeout(function () {
		msgDiv.style.opacity = '0'
		msgDiv.style.height = '0'
	}, 1000)
	setTimeout(function () {
		messagesElement.removeChild(msgDiv);
	}, 2000)
}