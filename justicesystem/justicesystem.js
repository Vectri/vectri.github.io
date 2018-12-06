// data
'use strict';
const pages = {
	MAIN: 'main',
	START: 'start',
	QUESTION: 'question',
	ADVANCE: 'advance',
	END: 'end',
	HIGHSCORE: 'highscore',
};
var page;

// page elems
var topElem = document.getElementById('top');
var midText = document.getElementById('midtext');	
var midButton = document.getElementById('midbutton');
var boxElem = document.getElementById('box');
var qbox1 = document.getElementById('qbox1');
var qbox2 = document.getElementById('qbox2');
var qboxtext1 = document.getElementById('qboxtext1');
var qboxtext2 = document.getElementById('qboxtext2');
var botElem = document.getElementById('bot');
	
const stats = {
	RACE: ["White", "Black"],
	MENTAL: ["Stable", "Ill"],
	WEALTH: ["Rich", "Poor"],
	GENDER: ["Female", "Male"]
}
var age = 5, race, mental, wealth, gender, death;

var scenarioAgeGroups = {
	CHILD: {},
	TEEN: {},
	ADULT: {},
	ELDERLY: {},
	ALL: {},
	EXCLUDEELDERLY: {}
}

var scenarios = {
	currentScenario: null,
	currentSubScenario: null,
	previousScenario: null,
	previousSubScenario: null,
	
	get current() {
		return this.currentScenario;
	},
	set current(scenario) {
		if (getAgeGroupByScenario(scenario. name) == null) {
			throw "Scenario " + scenario.name + " does not exist.";
		}
		if (!scenario.requirement()) {
			return;
		}
		if (this.currentScenario) {
			this.previousScenario = this.currentScenario;
		}
		age++;
		this.currentScenario = scenario;
	},
	get currentSub() {
		return this.currentSubScenario;
	},
	set currentSub(subScenario) {
		if (!subScenarioInUse(this.currentScenario.name, subScenario.name)) {
			throw "Sub-scenario " + subScenario.name + " does not exist in " + this.currentScenario.name;
		}
		if (!subScenario.requirement()) {
			return;
		}
		if (this.currentSubScenario) {
			this.previousSubScenario = this.currentSubScenario;
		}
		age++;
		this.currentSubScenario = subScenario;
	},
	
	get previous() {
		return this.previousScenario;
	},
	get previousSub() {
		return this.previousSubScenario;
	},
	
	/* Chooses a random scenario based on age criteria */
	getRandomScenario() {
		var pool = [];
		
		pool.push(scenarioAgeGroups.ALL);
		if (age <= 60) {
			pool.push(scenarioAgeGroups.EXCLUDEELDERLY);
		}
		if (7 <= age && age <= 12) {
			pool.push(scenarioAgeGroups.CHILD);
		} else if (13 <= age && age <= 17) {
			pool.push(scenarioAgeGroups.TEEN);
		} else if (18 <= age && age <= 60) {
				pool.push(scenarioAgeGroups.ADULT);			
		} else if (60 <= age && age <= 140) {
			pool.push(scenarioAgeGroups.ELDERLY);
		}
		var randomGroup = randomArrIndex(pool);
		while (Object.keys(randomGroup).length == 0) {
			randomGroup = randomArrIndex(pool);
		}
		return randomObjIndex(randomGroup);
	}
}

// funcs

/* Check whether scenario name is taken. */
function getAgeGroupByScenario(name) {
	for (let ageGroup of Object.keys(scenarioAgeGroups)) {
		for (let scenario of Object.keys(scenarioAgeGroups[ageGroup])) {
			if (scenarioAgeGroups[ageGroup][scenario].name == name) {
				return scenarioAgeGroups[ageGroup];
			}
		}
	}
	return null;
}

/* Check whether sub-scenario is in use in scenario by string. */
function subScenarioInUse(scenarioName, name) {
	var scenario = getScenarioByName(scenarioName);
	for (let subScenario of Object.keys(scenario.subScenarios)) {
		if (scenario.subScenarios[subScenario].name == name ) {
			return true;
		}
	}
	return false;
}

/* Get a scenario object given its name. */
function getScenarioByName(name) {
	for (let ageGroup of Object.keys(scenarioAgeGroups)) {
		for (let scenario of Object.keys(scenarioAgeGroups[ageGroup])) {
			if (scenarioAgeGroups[ageGroup][scenario].name == name) {
				return scenarioAgeGroups[ageGroup][scenario];
			}
		}
	}
	return null;
}

/*
	Requirement should be a function that returns 1 if the requirement
	is met and 0 if not.
	
	Sub-scenarios should be subScenario objects.
	
	Sub-scenarios can be added with scenario.addSubScenario and listed 
	with scenario.subScenarios.
	
	Vars must be object with each var in properties
*/
function Scenario(name, requirement, scenarioAgeGroup, vars) {
	if (getAgeGroupByScenario(name) != null) {
		throw "Scenario name " + name + "already in use!";
	}
	this.name = name;
	if (typeof requirement === 'function') {
		this.requirement = requirement;
	} else {
		throw "Scenario requirement is not a function!"
	}
	this.subScenarios = {};
	if (scenarioAgeGroup == undefined) {
		throw "Attempted to create new scenario with non age group";
	}
	// wew lad this may not work
	scenarioAgeGroup[name] = this;
	if (typeof vars !== 'object') {
		throw "Vars for " + name + " not of type object!";
	}	
	this.vars = vars;
}

/*
	Type should be pages.ADVANCE for 1 card or pages.QUESTION for 2.
	
	Scenario should be a scenario object.
	
	Requirement should be a function that returns 1 if the requirement
	is met and 0 if not.
	
	Options should be options objects.
*/
function SubScenario(name, scenario, promptText, type, requirement) {
	if (subScenarioInUse(scenario, name)) {
		throw "Sub-scenario name " + name + "already in use in !" + scenario;
	}
	this.name = name;
	if (type == pages.ADVANCE || type == pages.QUESTION) {
		this.type = type;
	} else {
		throw "Sub-scenario type is not pages.ADVANCE or pages.QUESTION!"
	}
	this.prompText = promptText;
	if (typeof requirement === 'function') {
			this.requirement = requirement;
	} else {
		throw "Sub-scenario requirement is not a function!"
	}
	this.options = [];
	// wew lad this may not work
	getScenarioByName(scenario).subScenarios[name] = this;	
}

/*
	cardText is what is displayed on each card.
	
	Action is a function performed when the card is clicked.
*/
function Option(cardText, action, scenario, subScenario) {
	this.cardText = cardText;
	if (typeof action === 'function') {
		this.action = action;
	} else {
		throw "Option action is not a function!"
	}
	if (getScenarioByName(scenario) == null) {
		throw "Error: call to nonexistant scenario: " + scenario;
	}
	if (!subScenarioInUse(scenario, subScenario)) {
		throw "Error: call to nonexistant sub-scenario: " + subScenario;
	}	
	getScenarioByName(scenario).subScenarios[subScenario].options.push(this);		
}

function randomArrIndex(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function randomObjIndex(obj) {
    var keys = Object.keys(obj)
    return obj[keys[ keys.length * Math.random() << 0]];
}

/* source: Mozilla Developer's Network
(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)*/
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Randomize starting stats.
   Age is affected by gender and mental health, and a bit of
   randomness. */
function randomizeStats() {
	race = randomArrIndex(stats.RACE);
	mental = randomArrIndex(stats.MENTAL);
	wealth = randomArrIndex(stats.WEALTH);
	gender = randomArrIndex(stats.GENDER);
	var agebias = getRandomInt(0, 100);
	if (50 <= agebias && agebias <= 60) {
		if (gender == stats.GENDER[1]) {
			death = getRandomInt(30, 116);
		} else {
			death = getRandomInt(50, 122);
		}
	} else if (agebias <= 40) {
		if (gender == stats.GENDER[1]) {
			death = getRandomInt(30, 71);
		} else {
			death = getRandomInt(50, 80);
		}		
	} else {
		death = getRandomInt(12, 80);
	}
	if (mental == stats.MENTAL[1] && death > 32) {
		death = death - getRandomInt(10, 25);
	}
}

function changePage(pageToChangeTo) {
	page = pageToChangeTo;
	updatePageDisplay();
}

function updatePageDisplay() {
	midButton.style.display = 'inline';
	boxElem.style.display = 'none';
	qbox1.style.display = 'inline';
	qbox2.style.display = 'inline';
	midText.innerHTML = '';
	switch (page) {
		case pages.MAIN:
			topElem.innerHTML = 'Justice System';
			midButton.innerHTML = 'New game';
			midButton.addEventListener("click", function() {
				changePage(pages.START);
			}, false);	
			botElem.innerHTML = 'High score: --';
			break;
		case pages.START:
			topElem.innerHTML = 'Justice System';
			midText.innerHTML = 'Your stats affect how likely you ' +
								'are to be jailed and the events ' +
								'you experience. Try to grow as ' +
								'old as possible without being ' +
								'jailed.<br><br>These are your stats:' +
								'<br><br>Race: ' + race +
								'<br>Mental Health: ' + mental +
								'<br>Wealth: ' + wealth +
								'<br>Gender: ' + gender + 
								'<br>(Debug) Age of death: ' + death + '<br>';
			midButton.innerHTML = 'Start game';
			midButton.addEventListener("click", function() {
				changePage(pages.QUESTION);
				// TODO, roll for child scenarios.
			}, false);		
			botElem.innerHTML = 'Age: ' + age;
			break;
		case pages.QUESTION:
			topElem.style["font-size"] = '275%';
			topElem.innerHTML = scenarios.currentSub.prompText;
			midButton.style.display = 'none';
			boxElem.style.display = 'flex';
			botElem.innerHTML = 'Age: ' + age;
			updateCards();
			break;
		case pages.ADVANCE:
			topElem.style["font-size"] = '275%';
			topElem.innerHTML = scenarios.currentSub.prompText;
			midButton.style.display = 'none';
			boxElem.style.display = 'flex';
			updateCards();
			qbox2.style.display = 'none';
			botElem.innerHTML = 'Age: ' + age;
			break;
		case pages.END:
			topElem.innerHTML = 'Game Over';
			midButton.innerHTML = 'To title screen';
			midButton.addEventListener("click", function() {
				changePage(pages.MAIN);
			}, false);			
			botElem.innerHTML = 'Age: ' + age;
			break;
	}
}

function updateCards(qbox1, qbox2) {
	qboxtext1.innerHTML = scenarios.currentSub.options[0].cardText;
	if (page != pages.ADVANCE) {
		qboxtext2.innerHTML = scenarios.currentSub.options[1].cardText;	
	}
}

// POPULATE SCENARIO DATA

/* Scenario(name, requirement, scenarioAgeGroup, vars) */
/* SubScenario(name, scenario, promptText, type, requirement) */
/* Option(cardText, action, scenario, subScenario) */

/* TEST SCENARIO */
new Scenario("Test",
				function() { return 1; },
				scenarioAgeGroups.CHILD,
				{hasWealthBeenChecked: false});
				
/* TEST - INTRO */
new SubScenario("Intro", "Test",
				"Test question. What do you do?",
				pages.QUESTION,
				function() { return 1; });
				
new Option("Test 1. This ALWAYS leads to the subscenario entitled Test",
			function() {
				scenarios.currentSub = scenarios.current.subScenarios["Test"];
				return 1;
			},
			"Test",
			"Intro");
			
new Option("Test 2. This leads to a random subscenario.",
			randomSubScenario,
			"Test",
			"Intro");
			
/* TEST - TEST */
new SubScenario("Test",
				"Test",
				"Another test question. This tests unpremeditated occurences and sequentialism. No I don't know what those mean.",
				pages.QUESTION,
				function() { return 1; });
				
new Option("Another test just to make sure the text changed from card to card and also length.",
			previousSubScenario,
			"Test",
			"Test");
			
new Option("This card only works if your age is greater than 20",
			function() {
				scenarios.currentSub = scenarios.current.subScenarios["Over20"];
				return 1;
			},
			"Test",
			"Test");

/* TEST - Over20 */
new SubScenario("Over20",
				"Test",
				"You can only advance to this card when you are over 20! It can't even be happed upon through the random card.",
				pages.ADVANCE,
				overTwenty);
new Option("Impressive, but what else?",
			branchBasedOnWealth,
			"Test",
			"Over20");
new Option("Secret option that only appears once the hasWealthBeenChecked variable is set for the Test scenario",
			function() { return 1; },
			"Test",
			"Over20");

/* TEST - Wealth */
new SubScenario("Wealthy",
				"Test",
				"This card can only be advanced to if you are rich.",
				pages.ADVANCE,
				richCheck);
				
new Option("... cool",
			previousSubScenario,
			"Test",
			"Wealthy");
			
/* TEST - POOR */
new SubScenario("Poor",
				"Test",
				"This card can only be advanced to if you are poor.",
				pages.ADVANCE,
				poorCheck);
				
new Option("ok",
			previousSubScenario,
			"Test",
			"Poor");
/* Scenario helper functions */
function randomSubScenario() {
	scenarios.currentSub = randomObjIndex(scenarios.current.subScenarios);															
	return 1;	
}

function previousSubScenario() {
	scenarios.currentSub = scenarios.previousSub;
	return 1;
}

function overTwenty() {
	if (scenarios.current.vars["hasWealthBeenChecked"]) {
		var tempOption = scenarios.current.subScenarios["Over20"].options[0];
		scenarios.current.subScenarios["Over20"].options[0] = scenarios.current.subScenarios["Over20"].options[1];
		scenarios.current.subScenarios["Over20"].options[1] = tempOption;
		scenarios.current.vars["hasWealthBeenChecked"] = false;
	}
	if (age > 20) {
		return 1;
	}
	return 0;
}

function branchBasedOnWealth() {
	scenarios.current.vars["hasWealthBeenChecked"] = true;
	if (wealth == stats.WEALTH[0]) {
		scenarios.currentSub = scenarios.current.subScenarios["Wealthy"];
	} else {
		scenarios.currentSub = scenarios.current.subScenarios["Poor"];
	}
	return 1;
}

function richCheck() {
	if (wealth == stats.WEALTH[0]) {
		return 1;
	}
	return 0;
}

function poorCheck() {
	if (wealth == stats.WEALTH[1]) {
		return 1;
	}
	return 0;
}

// END POPULATE SCENARIO DATA

// main
// Add event handlers to game buttons.
qbox1.addEventListener("click", function() {
	if (scenarios.currentSub.options[0].action() == 1) {
		changePage(scenarios.currentSub.type);
	}
}, false);
qbox2.addEventListener("click", function() {
	if (scenarios.currentSub.options[1].action() == 1) {
		changePage(scenarios.currentSub.type);
	}
}, false);
// start out with scenario set to random child element and it's
// intro scenario.
scenarios.current = randomObjIndex(scenarioAgeGroups.CHILD);
scenarios.currentSub = scenarios.current.subScenarios["Intro"];
randomizeStats();
changePage(pages.MAIN);