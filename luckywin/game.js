//2:50 pm - 4:46 pm

document.querySelector("button").addEventListener('click', spinAction)
var spinnerEls = Array.prototype.slice.call(document.querySelectorAll(".spinner")) //convert to standard array
var moneyEl = document.querySelector('.balance')
var resultEl = document.querySelector('.result')
var secretBalanceEl = document.querySelector('.secret')
var spinning = false
var icons = ['💰', '🍇', '🐈', '💥']
var values = [0, 0, 0]
var spinSpeed = [0, 0, 0]
var money = 20
var cost = 2
var spinSpeed = 60
var showSecretTotals = false
var countedThisGame = false

function spinAction() {
	if (spinning) return
	if (money < cost) return
	money -= cost
	showMoney()
	spinning = true
	resultEl.innerHTML = "..."
	setTimeout(spin, 30, 0, 400+Math.random()*100)
	setTimeout(spin, 30, 1, 800+Math.random()*100)
	setTimeout(spin, 30, 2, 1200+Math.random()*100)

	var oldTotalSpend = getTotalSpend()
	var newTotalSpend = oldTotalSpend + cost
	localStorage.setItem('totalSpend', newTotalSpend)
	console.log(newTotalSpend)

	var totalWinnings = getTotalWinnings()
	var restarts = parseInt(localStorage.getItem('restarts'))
	if (newTotalSpend > 20 && restarts > 2) {
		showSecretTotals = true
	}
	if (!countedThisGame) {
		localStorage.setItem('restarts', restarts + 1)
	}
	if (showSecretTotals) {
		var total = totalWinnings - newTotalSpend
		if (total >= 0) {
			secretBalanceEl.innerHTML = "All time profit: $" + total
		} else {
			secretBalanceEl.innerHTML = "All time loss: $" + -total
		}
	}
}

function spin(i, energy) {
	values[i]++
	if (values[i] >= icons.length) values[i] -= icons.length
	spinnerEls[i].innerHTML = icons[values[i]]
	var energy = energy - 20
	if (energy <= 0 || (values[i] === icons.indexOf('🐈') && energy < 20 * icons.length - 1 && Math.random() < 0.2)) {
		if (i === 2) setTimeout(showResult, 1000-1000)
	} else {
		var speed = 10000 / Math.min(energy, 100)
		setTimeout(spin, speed-speed+1, i, energy)
	}
}

function showResult() {
	var totals = {}
	icons.forEach(function (val) {
		totals[val] = spinnerEls.filter(x => x.innerHTML === val).length
	})
	console.log(totals)
	var prize = 0
	if (totals['💰'] === 3) {
		prize = 100
	} else if (totals['🍇'] === 3) {
		prize = 20
	} else if (totals['🐈'] === 3) {
		prize = 9
	} else {
		//no prize
		//prize += totals['💰'] * 5
		//prize += totals['🍇'] * 1
	}
	if (prize > 0) {
		resultEl.innerHTML = "You won $" + prize + "!"
	} else {
		resultEl.innerHTML = "No prize."
	}
	money += prize
	var oldTotalWinnings = getTotalWinnings()
	localStorage.setItem('totalWinnings', oldTotalWinnings + prize)
	showMoney()
	spinning = false
}

function getTotalWinnings() {
	return parseInt(localStorage.getItem('totalWinnings'))
}

function getTotalSpend() {
	return parseInt(localStorage.getItem('totalSpend'))
}

function showMoney() {
	moneyEl.innerHTML = "You have $" + money
}

if(!localStorage.getItem('totalSpend')) {
  localStorage.setItem('totalWinnings', 0)
  localStorage.setItem('totalSpend', 0)
  localStorage.setItem('restarts', 0)
}

showMoney()