/* Republicrat Puppets Draining the Walrus in Order to Shut Down Our 
   Meme Factories. SAD!
*/
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
var nickText = document.getElementById('nicktext');
var errorText = document.getElementById('errortext');
var midButton = document.getElementById('midbutton');
var boxElem = document.getElementById('box');
var qbox1 = document.getElementById('qbox1');
var qbox2 = document.getElementById('qbox2');
var qboxtext1 = document.getElementById('qboxtext1');
var qboxtext2 = document.getElementById('qboxtext2');
var botElem = document.getElementById('bot');

// don't have time to explain but it fixes duplicating button click listeners
// assign where you would normally use listeners
var midFunc;
	
const stats = {
	RACE: ["White", "Black"],
	MENTAL: ["Stable", "Ill"],
	WEALTH: ["Rich", "Poor"],
	GENDER: ["Female", "Male"],
}
var age = 6, race, mental, wealth, gender, death;

var scenarioAgeGroups = {
	CHILD: {},
	TEEN: {},
	ADULT: {},
	ELDERLY: {},
	ALL: {},
	EXCLUDEELDERLY: {},
	EXCLUDENONADULT: {},
	current() {
		if (7 <= age && age <= 12) {
			return scenarioAgeGroups.CHILD;
		} else if (13 <= age && age <= 17) {
			return scenarioAgeGroups.TEEN;
		} else if (18 <= age && age <= 60) {
			return scenarioAgeGroups.ADULT;			
		} else if (60 <= age && age <= 140) {
			return scenarioAgeGroups.ELDERLY;
		}		
	}
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
		this.currentScenario = scenario;
		this.currentScenario.visited = true;
		
		if (this.currentSubScenario) {
			this.previousSubScenario = this.currentSubScenario;
		}
		this.currentSubScenario = scenario.subScenarios["Intro"];
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
		if (age >= 18) {
			pool.push(scenarioAgeGroups.EXCLUDENONADULT)
		}
		if (6 <= age && age <= 12) {
			pool.push(scenarioAgeGroups.CHILD);
		} else if (13 <= age && age <= 17) {
			pool.push(scenarioAgeGroups.TEEN);
		} else if (18 <= age && age <= 60) {
				pool.push(scenarioAgeGroups.ADULT);			
		} else if (60 <= age && age <= 140) {
			pool.push(scenarioAgeGroups.ELDERLY);
		}
		var randomGroup = randomArrIndex(pool);
		var randomScenario = randomObjIndex(randomGroup);
		while (randomScenario.name == this.current.name || randomScenario.requirement() == 0 || Object.keys(randomGroup).length == 0) {
			randomGroup = randomArrIndex(pool);
			randomScenario = randomObjIndex(randomGroup);
		}
		if (randomScenario.name == this.current.name) {
			console.log("Chose same scenario...");
		}
		if (randomScenario.requirement() == 0) {
			console.log("Chose requirement that is not met....");
		}
		if (Object.keys(randomGroup).length == 0) {
			console.log("Chose empty age group...");
		}
		//console.log(randomScenario);
		return randomScenario;
	}
}

/** High score rank
   
   stats is a copy of the stats object when that person won.
   
   nick is the nickname the player gives themself.
**/
function rank() {
	this.age = 0,
	/* race, mental, wealth, gender */
	this.stats = {race: "", mental: "", wealth: "", gender: ""},
	this.nick = "---"
}

/* Collection of high scores. */
var highscores = new Array(10);
// populate the array with scores of 0.
for (var i = 0; i != 10; i++) {
	highscores[i] = new rank;
}

// funcs

function getRank() {
	var highestRank = -1;
	
	for (var i = 9; i != -1; i--) {
		if (highscores[i].age == age) {
			highestRank = i + 1;
		} else if (highscores[i].age < age) {
			highestRank = i;
		}
	}
	return highestRank;
}

function addToHighScores(nick) {
	var rankToBe = getRank();
	if (rankToBe == -1) {
		return;
	}
	if (highscores[rankToBe].age != 0) {
		for (var i = 8; i > rankToBe - 1; i--) {
			if (highscores[i].age != 0) {
				console.log("highscores[" + (i+1) +"] = highscores[" + i + "]");
				highscores[i + 1] = highscores[i];
			}
		}	
	}
	var newrank = new rank;
	newrank.age = age;
	newrank.stats = {race, mental, wealth, gender};
	newrank.nick = nick;
	
	highscores[rankToBe] = newrank;
}

function testHighScores() {
	randomizeStats();
	age = 100;
	addToHighScores("AAA");
	randomizeStats();
	age = 99;
	addToHighScores("BBB");
	randomizeStats();
	age = 44;
	addToHighScores("CCC");
	randomizeStats();
	age = 44;
	addToHighScores("DDD");
	randomizeStats();
	age = 33;
	addToHighScores("EEE");
	randomizeStats();
	age = 55;
	addToHighScores("FFF");
	randomizeStats();
	age = 22;
	addToHighScores("GGG");
	randomizeStats();
	age = 11;
	addToHighScores("HHH");
	randomizeStats();
	age = 1;
	addToHighScores("III");
	randomizeStats();
	age = 101;
	addToHighScores("WEW");	
	randomizeStats();
	age = 4;
	addToHighScores("MEM");
}

/**
	Odds to be jailed based on:
	
	White (0%)/Black (+20%)
	Mentally stable (0%)/Mentally Ill (+5%)
	Rich (-10%)/Poor (+10%)
	Female (0%)/Male (+5%)

	Max: Black, Mentally Ill, Poor,, Male = 40% Jail chance
	Min: White, Mentally stable, Rich, Female = -10% Jail chance
**/
function jailChance() {
	var totalchance = 0;
	
	if (race == stats.RACE[1]) {
		totalchance += 20;
	}
	if (mental == stats.MENTAL[1]) {
		totalchance += 5;
	}
	if (wealth == stats.WEALTH[1]) {
		totalchance += 10;
	} else {
		totalchance -= 10;
	}
	if (gender == stats.GENDER[1]) {
		totalchance += 5;
	}
	
	return totalchance;
};

/**
	Roll the dice to see whether the player should be jailed using
	an optional base number + jailChance.
**/
function rollJail(base) {
	if (typeof base === 'undefined') {
		base = 0;
	}
	var odds = base + jailChance();
	var random = Math.floor(Math.random()* 100) + 0;
	if (random < odds) {
		return true;
	}
	return false;
}

function rollTest() {
	var i = 0;
	while (rollJail() == false) {
		if (i > 10000) {
			break;
		}
		i++;
	}
	//console.log("Jail chance was " + jailChance() + "% and it took " + i + " rolls to be jailed.");
	return i;
}

function averageRoll() {
	var timesToLoop = 1000;
	var average = 0;
	for (var i = 0; i != timesToLoop; i++) {
		average += rollTest();
	}
	average = average / timesToLoop;
	//console.log("Jail chance was " + jailChance() + "% and average was " + average + " rolls to be jailed.");
	return average;
}

/** Check whether scenario name is taken. **/
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

/** Check whether sub-scenario is in use in scenario by string. **/
function subScenarioInUse(scenarioName, name) {
	var scenario = getScenarioByName(scenarioName);
	for (let subScenario of Object.keys(scenario.subScenarios)) {
		if (scenario.subScenarios[subScenario].name == name ) {
			return true;
		}
	}
	return false;
}

/** Get a scenario object given its name. **/
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

/**
	Requirement should be a function that returns 1 if the requirement
	is met and 0 if not.
	
	Sub-scenarios should be subScenario objects.
	
	Sub-scenarios can be added with scenario.addSubScenario and listed 
	with scenario.subScenarios.
	
	loopFunc must not return anything. It is executed after every card click.
	
	Vars must be object with each var in properties
**/
function Scenario(name, requirement, scenarioAgeGroup, loopFunc, vars) {
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
	scenarioAgeGroup[name] = this;
	if (typeof loopFunc === 'function') {
		this.loopFunc = loopFunc;
	} else if (typeof loopFunc === 'undefined') { 
		this.loopFunc = function () {};
	} else {
		throw "Scenario loopFunc is not a function!"
	}
	if (typeof vars !== 'undefined') {
		if (typeof vars !== 'object') {
			throw "Vars for " + name + " not of type object!";
		}
		this.vars = vars;
	}
	this.visited = false;
}

/**
	Type should be pages.ADVANCE for 1 card or pages.QUESTION for 2.
	
	Scenario should be a scenario object.
	
	Requirement should be a function that returns 1 if the requirement
	is met and 0 if not.
	
	Options should be options objects.
**/
function SubScenario(scenario, name, promptText, type, requirement) {
	if (subScenarioInUse(scenario, name)) {
		throw "Sub-scenario name " + name + " already in use in " + scenario;
	}
	this.name = name;
	if (typeof type !== 'undefined') {
		if (type == pages.ADVANCE) {
			this.type = type;
			this.promptText = promptText;
		} else {
			throw "Sub-scenario type is not pages.ADVANCE or pages.QUESTION!"
		}
	} else {
		this.type = pages.QUESTION;
		this.promptText = promptText + " What do you do?";
	}
	if (typeof requirement === 'function') {
		this.requirement = requirement;
	} else if (typeof requirement === 'undefined') {
		this.requirement = noReq;
	} else {
		throw "Sub-scenario requirement is not a function!"
	}
	this.options = [];
	getScenarioByName(scenario).subScenarios[name] = this;	
}

/**
	cardText is what is displayed on each card.
	
	Action is a function performed when the card is clicked.
**/
function Option(scenario, subScenario, cardText, action) {
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

/** source: Mozilla Developer's Network
(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
**/
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Randomize starting stats.
   Age is affected by gender and mental health, and a bit of
   randomness. 
**/
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
	errorText.style.display = 'none';
	nickText.style.display = 'none';
	midButton.style.display = 'inline';
	boxElem.style.display = 'none';
	qbox1.style.display = 'inline';
	qbox2.style.display = 'inline';
	midText.innerHTML = '';
	switch (page) {
		case pages.MAIN:
			topElem.innerHTML = 'Justice System';
			midButton.innerHTML = 'New game';
			midFunc = function() {
				changePage(pages.START);
			};	
			botElem.innerHTML = 'Made by one person. Buggy. Reload if you softlock (you probably will). (Try to) Enjoy!';
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
								'<br>Gender: ' + gender + '<br>';
			midButton.innerHTML = 'Start game';
			midFunc = function() {
				changePage(pages.QUESTION);
			};		
			botElem.innerHTML = 'Age: ' + age;
			break;
		case pages.QUESTION:
			topElem.style["font-size"] = '275%';
			topElem.innerHTML = scenarios.currentSub.promptText;
			midButton.style.display = 'none';
			boxElem.style.display = 'flex';
			botElem.innerHTML = 'Age: ' + age;
			updateCards();
			break;
		case pages.ADVANCE:
			topElem.style["font-size"] = '275%';
			topElem.innerHTML = scenarios.currentSub.promptText;
			midButton.style.display = 'none';
			boxElem.style.display = 'flex';
			updateCards();
			qbox2.style.display = 'none';
			botElem.innerHTML = 'Age: ' + age;
			break;
		case pages.END:
			errorText.style.display = 'inline';
			topElem.innerHTML = 'Game Over';
			if (age == death) {
				midText.innerHTML = 'You managed to die of old age. Quite fortuitous!<br><br>';
			} else {
				midText.innerHTML = 'You have been jailed!<br><br>';
			}
			if (getRank() != -1) {
				nickText.style.display = 'inline';
				midText.innerHTML += 'New highscore! Enter a nickname:<br>';
			}
			midButton.innerHTML = 'To high scores';
			midFunc = function() {
				var nickValue = nickText.value.toUpperCase();
				var bannedNicks = ["DCK", "CKC", "COC", "DIC", "DIK", 
									"COK", "KOK", "NGR", "KOC", "VAG",
									"CNT", "PNS", "ASS", "FCK", "FUK",
									"FUC", "FKC", "AZZ", "FKK", "FOK",
									"FAK", "FOC", "FAC", "FAG", "TIT",
									"PIS", "PEE", "NO."];
				if (nickValue != "") {
					if (nickValue.length == 3) {
						for (var i = 0; i < bannedNicks.length; i++) {
							if (bannedNicks[i] == nickValue) {
								errorText.innerHTML = '<br><span style="color: red">Come on now. Choose a new name.</span><br>';
								return;
							}
						}
						var pattern = new RegExp('^[A-Z]+$');
						if (pattern.test(nickValue)) {
							addToHighScores(nickValue);
							changePage(pages.HIGHSCORE);
						} else {
							errorText.innerHTML = '<br><span style="color: red">Alphabetic characters only.</span><br>';
						}
					} else {
						errorText.innerHTML = '<br><span style="color: red">Please enter a name that is three characters.</span><br>';
					}
				}
			};			
			botElem.innerHTML = 'Age: ' + age;
			break;
		case pages.HIGHSCORE:
			topElem.innerHTML = 'Highest Scores';
			var table = "<table><thead><tr><th>RANK</th><th>NICK</th><th>AGE</th><th>STATS</th></tr></thead><tbody>"
			for (var i = 0; i < highscores.length; i++) {
				// race, mental, wealth, gender
				table += "<tr><td>" + (i+1) + "</td><td>" + highscores[i].nick + "</td><td>" + 
									highscores[i].age + "</td><td>" + 
									highscores[i].stats.race + " " +
									highscores[i].stats.mental + " " +
									highscores[i].stats.wealth + " " +
									highscores[i].stats.gender + "</td></tr>";
			}
			table += "</tbody></table>";
			midText.innerHTML = table;
			midButton.innerHTML = 'To menu';
			midFunc = function() {
				changePage(pages.MAIN);
				resetGame();
			};	
	}
}

/** 
	Become older. If too old, die.
**/
function incrementAge() {
	if (age == death) {
		changePage(pages.END);
	} else {
		age++;
	}
}

function updateCards(qbox1, qbox2) {
	qboxtext1.innerHTML = scenarios.currentSub.options[0].cardText;
	if (page != pages.ADVANCE) {
		qboxtext2.innerHTML = scenarios.currentSub.options[1].cardText;	
	}
}

// POPULATE SCENARIO DATA

/* SCENARIOS */
/* Scenario(name, requirement, scenarioAgeGroup, loopFunc, vars) */
/// life vars 
var highdeg = 0;
var collegedeg = 0;
var job = 0;
var dating = 0;
var married = 0;
// CHILD SCENARIOS
new Scenario("Park", noReq, scenarioAgeGroups.CHILD, incElapsed, {elapsed: 0});
new Scenario("School", noReq, scenarioAgeGroups.CHILD, incElapsed, {elapsed: -1});
// TEEN SCENARIOS
new Scenario("Highschool", noReq, scenarioAgeGroups.TEEN);
new Scenario("FriendsNight", noReq, scenarioAgeGroups.TEEN);
new Scenario("HighDeg", function () { return checkVisited(scenarioAgeGroups.TEEN, "Highschool") }, scenarioAgeGroups.TEEN);
// ADULT
new Scenario("College", highdegAndCollegeFirstVisitCheck, scenarioAgeGroups.ADULT);
new Scenario("GetJob", function() { return highdeg }, scenarioAgeGroups.ADULT);
new Scenario("Date", datingOrMarriedCheck, scenarioAgeGroups.ADULT);
new Scenario("GetMarried", datingNotMarriedCheck, scenarioAgeGroups.ADULT);
// ELDERLY
new Scenario("LaidOff", function() { return job }, scenarioAgeGroups.ELDERLY);
new Scenario("Retired", function() { return job }, scenarioAgeGroups.ELDERLY);
new Scenario("NoMoney", moneyCheck, scenarioAgeGroups.ELDERLY);
// EXCLUDE ELDERLY
new Scenario("WoopsMurder", happyCheck, scenarioAgeGroups.EXCLUDEELDERLY);
// EXCLUDE NON-ADULT
new Scenario("CopBattle", noReq, scenarioAgeGroups.EXCLUDENONADULT);
new Scenario("Airport", wealthCheck, scenarioAgeGroups.EXCLUDENONADULT);
// ALL
new Scenario("TheftWitness", noReq, scenarioAgeGroups.ALL);
// new Scenario("FalseAccuse", backgroundCheck, scenarioAgeGroups.ALL);
/* END SCENARIOS */

/* SCENARIO LOOPFUNCS */
function incElapsed() {
	var elapsed = scenarios.current.vars["elapsed"];
	if (elapsed >= 2) {
		scenarios.currentSub = scenarios.current.subScenarios["Leave"];
	}
	scenarios.current.vars["elapsed"] = elapsed + 1;
}
/* END SCENARIO LOOPFUNCS */

/* SCENARIO HELPER FUNCTIONS */
// General
function randomSubScenario() {
	scenarios.currentSub = randomObjIndex(scenarios.current.subScenarios);															
	return 1;	
}

function previousSubScenario() {
	scenarios.currentSub = scenarios.previousSub;
	return 1;
}

function noReq() {
	return 1;
}

function checkVisited(ageGroup, scenario) {
	if (ageGroup[scenario].visited) {
		return 1;
	}
	return 0;
}

function moneyCheck() {
	if (job == 0 && wealthCheck == 0) {
		return 1;
	}
	return 0;
}

function wealthCheck() {
	if (wealth == stats.WEALTH[0]) {
		return 1;
	} else {
		return 0;
	}
}

function highdegAndCollegeFirstVisitCheck() {
	if (highdeg && !checkVisited(scenarioAgeGroups.ADULT, "College")) {
		return 1;
	}
	return 0;
}

function datingOrMarriedCheck() {
	if (married || dating) {
		return 0;
	}
	return 1;
}

function datingNotMarriedCheck() {
	if (!married && dating) {
		return 1;
	}
	return 0;	
}

/** 1 denotes an underprivleged background **/
function backgroundCheck() {
	if (jailChance() >= 25) {
		return 1;
	}
	return 0;
}

// Exclude ELDERLY
function happyCheck() {
	if (job || married || collegedeg) {
		return 1;
	}
	return 0;
}
/* END SCENARIO HELPER FUNCTIONS */

/* SUBSCENARIOS */
/* SubScenario(scenario, name, promptText, type, requirement) */
/* new SubScenario("", "", ""); */
// CHILD SUBSCENARIOS
// CHILD - Park
new SubScenario("Park", "Intro", "You walk into a park. There are families enjoying themselves across the park.");
new SubScenario("Park", "Playground", "In front of you is a playstructure. Children climb and slide down the structure.");
new SubScenario("Park", "Frisbee", "You play a match of frisbee. Feeling tired, you lie down to rest.", pages.ADVANCE);
new SubScenario("Park", "Grass", "You wade into the large pool of grass that the park encloses. Some people lie on blankets and some are playing games.");
new SubScenario("Park", "Bench", "You lie on the park bench and watch a game of frisbee. After awhile, you decide to go somewhere else.");
new SubScenario("Park", "Walk", "You walk around the perimeter of the grass.");
new SubScenario("Park", "Leave", "It's getting late, so you decide to head home.", pages.ADVANCE);
// CHILD - School
new SubScenario("School", "Intro", "You go to school. While in class, you sit as still as you can.", pages.ADVANCE);
new SubScenario("School", "Recess", "You go out to play. One of your classmates invites you to play tag.");
new SubScenario("School", "RecessTagGood", "You play a rousing game of tag and head back inside.", pages.ADVANCE);
new SubScenario("School", "RecessTagBad", "In the midst of a game of tag, you injure your classmate. You receive a lecture from a teacher about knowing your own strength and not to roughhouse.", pages.ADVANCE);
new SubScenario("School", "RecessSwing", "You play on the swing. Upon your teacher's beckoning, you head back inside.", pages.ADVANCE);
new SubScenario("School", "Leave", "You sit through your afternoon class and hurriedly head home.", pages.ADVANCE);
// TEEN SUBSCENARIOS
// TEEN - Highschool
new SubScenario("Highschool", "Intro", "You decide to go to school... or, well, you could do that. Or you could hang out with friends.");
new SubScenario("Highschool", "Leave", "You stay through school, and head home.", pages.ADVANCE);
// TEEN - FriendsNight
new SubScenario("FriendsNight", "Intro", "You decide to spend the night with your friends. You can go to a couple places.");
new SubScenario("FriendsNight", "Bar", "You all attempt to enter a bar but are quickly turned away by the bouncer.", pages.ADVANCE);
new SubScenario("FriendsNight", "Movie", "You all go to see the latest in the line of superhero movies where the main conflict is the same as the other various movies that came before it: nobody dies and nobody wins. It's the best yet!", pages.ADVANCE);
new SubScenario("FriendsNight", "Leave", "Man, it's been a long day. You head home to get some rest.", pages.ADVANCE);
// TEEN - HighDeg
new SubScenario("HighDeg", "Intro", "You've gone to highschool for at least a couple years now. You have the opportunity to get high school diploma if you continue.");
new SubScenario("HighDeg", "No", "A decision you will later regret.", pages.ADVANCE);
new SubScenario("HighDeg", "Yes", "A wise decision.", pages.ADVANCE);
new SubScenario("HighDeg", "Leave", "Degree or no degree, your whole life is ahead of you.", pages.ADVANCE);
// ADULT SUBSCENARIOS
// Adult - College
new SubScenario("College", "Intro", "Your parents tell you that they have money saved to send you to college.")
new SubScenario("College", "No", "Poor decision making skills, player", pages.ADVANCE);
new SubScenario("College", "Yes", "[Odds determine whether this card says you got a degree]", pages.ADVANCE);
// Adult - GetJob
new SubScenario("GetJob", "Intro", "With your skills, you can get a job.");
new SubScenario("GetJob", "No", "That will not aid your longevity...", pages.ADVANCE);
new SubScenario("GetJob", "Yes", "You can put out an ad for yourself or look for an offering.");
new SubScenario("GetJob", "PersonlAd", "[Your ad was succ/fail]", pages.ADVANCE);
new SubScenario("GetJob", "Interview", "You find a suitable job and go in for an interview.");
new SubScenario("GetJob", "JobSucc", "You got the job! Nice.", pages.ADVANCE);
new SubScenario("GetJob", "JobFail", "Looks like you didn't get the job. Hopefully they'll be other opportunities.", pages.ADVANCE);
// Adult - Date
new SubScenario("Date", "Intro", "You're feeling frisky. Is it time to get yourself a date?");
new SubScenario("Date", "No", "Of course. You are have your hands full at the moment. No time for romance.", pages.ADVANCE);
new SubScenario("Date", "Yes", "You quickly find a match using online dating and decide to meet for pasta. Your date arrives before you.");
new SubScenario("Date", "PastaGood", "Your date laughs at your introduction. You spend the night chatting and eating. It grows late, and you two need to get going.");
new SubScenario("Date", "PastaBad", "Your date frowns, clearly not impressed.");
new SubScenario("Date", "PastaReallyBad", "Your date announces they are leaving."); // jail check here!!!
new SubScenario("Date", "PastaOK", "Your date's frown lightens a bit.");
new SubScenario("Date", "PastaJail", "You chase after your date, following them outside, despite them telling you to leave them be. Eventually, they call the police on you. You are quickly caught, and jailed. You maniac.", pages.ADVANCE);
new SubScenario("Date", "PastaLeave", "After a date you will never forghetti, you head home.", pages.ADVANCE);
// Adult - GetMarried
new SubScenario("GetMarried", "Intro", "You've spent a lot of time together with your date. You could try asking them to spend their life with you.");
new SubScenario("GetMarried", "Yes", "[Check for succ]", pages.ADVANCE);
new SubScenario("GetMarried", "No", "You hold off on making such a big decision.", pages.ADVANCE);
// ELDERLY SUBSCENARIOS
// Elderly - LaidOff
new SubScenario("LaidOff", "Intro", "You have lost your job!", pages.ADVANCE);
// Elderly - Retired
new SubScenario("Retired", "Intro", "With so many years behind you, you decide to retire.", pages.ADVANCE);
// Elderly - NoMoney
new SubScenario("NoMoney", "Intro", "Your funds are running out and you're getting desperate...");
new SubScenario("NoMoney", "Steal", "[Result of stealing]", pages.ADVANCE);
new SubScenario("NoMoney", "Wait", "[Result of waitng, such as being jailed for debt.]", pages.ADVANCE);
// EXCLUDE ELDERLY SUBSCENARIOS
// Exclude Elderly - WoopsMurder
new SubScenario("WoopsMurder", "Intro", "One late night while walking around, a man in a trench coat approaches you.");
new SubScenario("WoopsMurder", "Run", "[Result of running, whether he gets hit or not] but you flee", pages.ADVANCE);
new SubScenario("WoopsMurder", "RunNextDay", "The police come to arrest you the next day because of witness accounts of you running away from a man who moments later was hit by a car.", pages.ADVANCE);
new SubScenario("WoopsMurder", "Talk", "You ask the man what he wants. He reveals he sells drugs.");
new SubScenario("WoopsMurder", "Buy", "You give him your cash in exchange for some drugs. The man pockets your cash, and starts to run away.");
new SubScenario("WoopsMurder", "Chase", "You give chase. The man cuts through the street. At the same instant, a speeding car collides with him.", pages.ADVANCE);
new SubScenario("WoopsMurder", "LetGo", "You let the man go and go home, sad(?) that you couldn't get your fix.", pages.ADVANCE);
// EXCLUDE NON-ADULT
// Exclude Non-Adult - CopBattle
new SubScenario("CopBattle", "Intro", "You are getting out of your car, when a cop calls out to you.");
new SubScenario("CopBattle", "SpeedAway", "[Result of speeding away]", pages.ADVANCE);
new SubScenario("CopBattle", "Talk", "You ask the cop what he wants. He asks to search your car.");
new SubScenario("CopBattle", "SearchYes", "You allow the cop to search your car. [Result of findings]", pages.ADVANCE);
new SubScenario("CopBattle", "SearchNo", "You tell the cop no. [Upset = jail check, Else mistake]", pages.ADVANCE);
// ALL SUBSCENARIOS
// All - TheftWitness
new SubScenario("TheftWitness", "Intro", "On your way home, you see a man holding up a convienence store with a gun.");
new SubScenario("TheftWitness", "Hero", "You are quickly seen and shot by the robber. Not a good choice.", pages.ADVANCE);
new SubScenario("TheftWitness", "SawNothing", "[Whether robber notices you]", pages.ADVANCE);
new SubScenario("TheftWitness", "GivesGun", "The robber gives you his gun and runs off.", pages.ADVANCE);
new SubScenario("TheftWitness", "DumbFounded", "You hold the gun in your hand, dumbfounded. The police arrive and see you.");
new SubScenario("TheftWitness", "SetDown", "[Result of setting gun down]", pages.ADVANCE);
new SubScenario("TheftWitness", "HoldOut", "[Result of setting holding the gun out]", pages.ADVANCE);
// All - FalseAccuse
// new SubScenario("FalseAccuse", "Intro", "You hear a knock on your door. You answer it, to see a cop standing on your doorstep. He claims there is a warrant out for your arrest.");
// new SubScenario("FalseAccuse", "SlamDoor", "You slam the door and hide in your room. You hear kicks and the breaking of wood, and the cop comes to you.");
// new SubScenario("FalseAccuse", "Run", "You get up to run away from him. The cop frantically removes his pistol from its holster and takes a shot. You are dead.", pages.ADVANCE);
// new SubScenario("FalseAccuse", "HandsUp", "You put your hands. You are brought to the station and [jailed/released]", pages.ADVANCE);
// new SubScenario("FalseAccuse", "GoWillingly", "You go with the cop willingly. You are brought to the station and [jailed/released]", pages.ADVANCE);
/* END SUBSCENARIOS */

/* OPTIONS */
/* Option(scenario, subScenario, cardText, action) */
// new Option("", "", "", function () { return });
// CHILD
// CHILD - Park
//new SubScenario("Park", "Intro", "You walk into a park. There are families enjoying themselves across the park.");
new Option("Park", "Intro", "Go to the playground", function() { return goToSub("Playground") });
new Option("Park", "Intro", "Go to the grass field", function() { return goToSub("Grass") });
//new SubScenario("Park", "Playground", "In front of you is a playstructure. Children climb and slide down the structure.");
new Option("Park", "Playground", "Go the bench near the playground", function () { return goToSub("Bench") });
new Option("Park", "Playground", "Take a walk around the grass", function () { return goToSub("Walk") });
// new SubScenario("Park", "Grass", "You wade into the large pool of grass that the park encloses. Some people lie on blankets and some are playing games.");
new Option("Park", "Grass", "Take a walk around the grass", function () { return goToSub("Walk") });
new Option("Park", "Grass", "Play frisbee with some people on the grass", function () { return goToSub("Frisbee") });
// new SubScenario("Park", "Frisbee", "You play a match of frisbee. Feeling tired, you lie down to rest.", pages.ADVANCE);
new Option("Park", "Frisbee", "Sit down at the bench", function () { return goToSub("Bench") });
// new SubScenario("Park", "Bench", "You lie on the park bench and watch a game of frisbee. After awhile, you decide to go somewhere else.");
new Option("Park", "Bench", "Go to the playground", function() { return goToSub("Playground") });
new Option("Park", "Bench", "Play frisbee with some people on the grass", function() { return goToSub("Frisbee") });
// new SubScenario("Park", "Walk", "You walk around the perimeter of the grass.");
new Option("Park", "Walk", "Play frisbee with some people on the grass", function() { return goToSub("Frisbee") });
new Option("Park", "Walk", "Go for another walk...?", function() { return goToSub("Walk") });
// new SubScenario("Park", "Leave", "It's getting late, so you decide to head home.", pages.ADVANCE);
new Option("Park", "Leave", "Head home", goToRandom);
// CHILD - School
// new SubScenario("School", "Intro", "You go to school. While in class, you sit as still as you can.", pages.ADVANCE);
new Option("School", "Intro", "Time for recess", function () { return goToSub("Recess") });
// new SubScenario("School", "Recess", "You go out to play. One of your classmates invites you to play tag.");
new Option("School", "Recess", "Play tag", randomTag);
new Option("School", "Recess", "Swing on the swings", function () { return goToSub("RecessSwing") });
// new SubScenario("School", "RecessTagGood", "You play a rousing game of tag and head back inside.", pages.ADVANCE);
new Option("School", "RecessTagGood", "Return inside", function () { return goToSub("Leave") });
// new SubScenario("School", "RecessTagBad", "In the midst of a game of tag, you injure your classmate. You receive a lecture from a teacher about knowing your own strength and not to roughhouse.", pages.ADVANCE);
new Option("School", "RecessTagBad", "Return inside", function () { return goToSub("Leave") });
// new SubScenario("School", "RecessSwing", "You play on the swing. Upon your teacher's beckoning, you head back inside.", pages.ADVANCE);
new Option("School", "RecessSwing", "My head is spinning...", function () { return goToSub("Leave") });
// new SubScenario("School", "Leave", "You sit through your afternoon class and hurriedly head home.", pages.ADVANCE);
new Option("School", "Leave", "Onward to tomorrow!", goToRandom);
// TEEN
// TEEN - Highschool
// new SubScenario("Highschool", "Intro", "You decide to go to school... or, well, you could do that. Or you could hang out with friends.");
new Option("Highschool", "Intro", "Truancy is the way to go!", function () { return goTo("FriendsNight"); });
new Option("Highschool", "Intro", "No, I'm a good child and will go to school", function () { return goToSub("Leave") });
// new SubScenario("Highschool", "Leave", "You stay through school, and head home.", pages.ADVANCE);
new Option("Highschool", "Leave", "Home sweet home", goToRandom);
// TEEN - FriendsNight
// new SubScenario("FriendsNight", "Intro", "You decide to spend the night with your friends. You can go to a couple places.");
new Option("FriendsNight", "Intro", "I'm thirsty. Let's go to the bar", function () { return goToSub("Bar") });
new Option("FriendsNight", "Intro", "I like dark caves. Let's head to the movies", function () { return goToSub("Movie") });
// new SubScenario("FriendsNight", "Bar", "You all attempt to enter a bar but are quickly turned away by the bouncer.", page.ADVANCE);
new Option("FriendsNight", "Bar", "What a killjoy. Let's just go home", function () { return goToSub("Leave") });
// new SubScenario("FriendsNight", "Movie", "You all go to see the latest in the line of superhero movies where the main conflict is the same as the other various movies that came before it: nobody dies and nobody wins. It's the best yet!", page.ADVANCE);
new Option("FriendsNight", "Movie", "Epic", function () { return goToSub("Leave") });
// new SubScenario("FriendsNight", "Leave", "Man, it's been a long day. You head home to get some rest.", pages.ADVANCE);
new Option("FriendsNight", "Leave", "Yup.", goToRandom);
// TEEN - HighDeg
// new SubScenario("HighDeg", "Intro", "You've gone to highschool for at least a couple years now. You have the opportunity to get high school diploma if you continue.");
new Option("HighDeg", "Intro", "Heck yes!", function () { return goToSub("Yes") });
new Option("HighDeg", "Intro", "Heck no!", function () { return goToSub("No") });
// new SubScenario("HighDeg", "No", "A decision you will later regret.", pages.ADVANCE);
new Option("HighDeg", "No", "Uh-huh. Sure", function () { return goToSub("Leave") });
// new SubScenario("HighDeg", "Yes", "A wise decision.", pages.ADVANCE);
new Option("HighDeg", "Yes", "Thanks :)", function () { return goToSub("Leave") });
// new SubScenario("HighDeg", "Leave", "Degree or no degree, your whole life is ahead of you.", pages.ADVANCE);
new Option("HighDeg", "Leave", "Mhm", goToRandom);
// ADULT
// Adult - College
// new SubScenario("College", "Intro", "Your parents tell you that they have money saved to send you to college.")
new Option("College", "Intro", "Drug money!", function () { return goToSub("No") });
new Option("College", "Intro", "Use the money for college", collegeCard);
// new SubScenario("College", "No", "Poor decision making skills, player", pages.ADVANCE);
new Option("College", "No", "That's what you think", goToRandom);
// new SubScenario("College", "Yes", "[Odds determine whether this card says you got a degree]", pages.ADVANCE);
new Option("College", "Yes", "", goToRandom);
// Adult - GetJob
// new SubScenario("GetJob", "Intro", "With your skills, you can get a job.");
new Option("GetJob", "Intro", "Let's do it!", function () { return goToSub("Yes")});
new Option("GetJob", "Intro", "To work is to lose!", function () { return goToSub("No")});
// new SubScenario("GetJob", "No", "That will not aid your longevity...", pages.ADVANCE);
new Option("GetJob", "No", "My job will be guarding the home!", goToRandom);
// new SubScenario("GetJob", "Yes", "You can put out an ad for yourself or look for an offering.");
new Option("GetJob", "Yes", "Ad", adCard);
new Option("GetJob", "Yes", "Offering", interviewCard);
// new SubScenario("GetJob", "PersonlAd", "[Your ad was succ/fail]", pages.ADVANCE);
new Option("GetJob", "PersonlAd", "", goToRandom);
// new SubScenario("GetJob", "Interview", "You find a suitable job and go in for an interview.");
new Option("GetJob", "Interview", "Take an authoratative tone and scare the interviewer into hiring you", interviewCard);
new Option("GetJob", "Interview", "Be polite and highlight your skillsets", interviewCard);
// new SubScenario("GetJob", "JobSucc", "You got the job! Nice.", pages.ADVANCE);
new Option("GetJob", "JobSucc", "I'm the greatest", goToRandom);
// new SubScenario("GetJob", "JobFail", "Looks like you didn't get the job. Hopefully they'll be other opportunities.", pages.ADVANCE);
new Option("GetJob", "JobFail", "Darn", goToRandom);
// Adult - Date
// new SubScenario("Date", "Intro", "You're feeling frisky. Is it time to get yourself a date?");
new Option("Date", "Intro", "What's there to lose", function () { return goToSub("Yes") });
new Option("Date", "Intro", "Not happening", function () { return goToSub("No") });
// new SubScenario("Date", "No", "Of course. You are have your hands full at the moment. No time for romance.", pages.ADVANCE);
new Option("Date", "No", "That's right", goToRandom);
// new SubScenario("Date", "Yes", "You quickly find a match using online dating and decide to meet for pasta. Your date arrives before you.");
new Option("Date", "Yes", "Hello, I'm...", dateRandom);
new Option("Date", "Yes", "Wow! Didn't expect you to look like that!", dateRandom);
// new SubScenario("Date", "PastaGood", "Your date laughs at your introduction. You spend the night chatting and eating. It grows late, and you two need to get going.");
new Option("Date", "PastaGood", "Let's go to my place", rollForDating);
new Option("Date", "PastaGood", "Kbye", rollForDating);
// new SubScenario("Date", "PastaBad", "Your date frowns, clearly not impressed.");
new Option("Date", "PastaBad", "You apologize", dateBadRandom);
new Option("Date", "PastaBad", "Great joke, right?", dateBadRandom);
// new SubScenario("Date", "PastaReallyBad", "Your date tells you they are leaving."); // jail check here!!!
new Option("Date", "PastaReallyBad", "Chase!", function () { return goToSub("PastaJail") });
new Option("Date", "PastaReallyBad", "Let her go", function () { return goToSub("PastaLeave") });
// new SubScenario("Date", "PastaOK", "Your date's frown lightens a bit.");
// this subs is dead ^^^
// new SubScenario("Date", "PastaJail", "You chase after your date, following them outside, despite them telling you to leave them be. Eventually, they call the police on you. You are quickly caught, and jailed. You maniac.", pages.ADVANCE);
new Option("Date", "PastaJail", "I don't know what I expected", toJail);
// new SubScenario("Date", "PastaLeave", "After a date you will never forghetti, you head home.", pages.ADVANCE);
new Option("Date", "PastaLeave", "Cheesy joke", goToRandom);
// Adult - GetMarried
// new SubScenario("GetMarried", "Intro", "You've spent a lot of time together with your date. You could try asking them to spend their life with you.");
new Option("GetMarried", "Intro", "Yup", marriedCard);
new Option("GetMarried", "Intro", "No", function () { return goToSub("No") });
// new SubScenario("GetMarried", "Yes", "[Check for succ]", pages.ADVANCE);
new Option("GetMarried", "Yes", "", goToRandom);
// new SubScenario("GetMarried", "No", "You hold off on making such a big decision.", pages.ADVANCE);
new Option("GetMarried", "No", "It just wasn't meant to be", goToRandom);
// ELDERLY SUBSCENARIOS
// Elderly - LaidOff
// new SubScenario("LaidOff", "Intro", "You have lost your job!", pages.ADVANCE);
new Option("LaidOff", "Intro", "Son of a gon!", goToRandom);
// Elderly - Retired
// new SubScenario("Retired", "Intro", "With so many years behind you, you decide to retire.", pages.ADVANCE);
new Option("Retired", "Intro", "A corporate slave no longer", goToRandom);
// Elderly - NoMoney
// new SubScenario("NoMoney", "Intro", "Your funds are running out and you're getting desperate...");
new Option("NoMoney", "Intro", "No helping it. I must go steal something", stealCard);
new Option("NoMoney", "Intro", "I'll just ignore my debts", waitCard);
// new SubScenario("NoMoney", "Steal", "[Result of stealing]", pages.ADVANCE);
new Option("NoMoney", "Steal", "", goToRandom);
// new SubScenario("NoMoney", "Wait", "[Result of waitng, such as being jailed for debt.]", pages.ADVANCE);
new Option("NoMoney", "Wait", "", goToRandom);
// EXCLUDE ELDERLY SUBSCENARIOS
// Exclude Elderly - WoopsMurder
// new SubScenario("WoopsMurder", "Intro", "One late night while walking around, a man in a trench coat approaches you.");
new Option("WoopsMurder", "Intro", "Run away", runCard);
new Option("WoopsMurder", "Intro", "Talk", function () { return goToSub("Talk") });
// new SubScenario("WoopsMurder", "Run", "[Result of running, whether he gets hit or not] but you flee", pages.ADVANCE);
new Option("WoopsMurder", "Run", "", goToRandom);
// new SubScenario("WoopsMurder", "RunNextDay", "The police come to arrest you the next day because of witness accounts of you running away from a man who moments later was hit by a car", pages.ADVANCE);
new Option("WoopsMurder", "RunNextDay", "GAHHH", toJail);
// new SubScenario("WoopsMurder", "Talk", "You ask the man what he wants. He reveals he sells drugs.");
new Option("WoopsMurder", "Talk", "Buy some for yourself", function () { return });
new Option("WoopsMurder", "Talk", "Nah I'm good", goToRandom);
// new SubScenario("WoopsMurder", "Buy", "You give him your cash in exchange for some drugs. The man pockets your cash, and starts to run away.");
new Option("WoopsMurder", "Buy", "Hey! Get back here!", function () { return goToSub("Chase")});
new Option("WoopsMurder", "Buy", "I have learned my lesson and will not buy drugs from strange men.", function () { return goToSub("LetGo")});
// new SubScenario("WoopsMurder", "Chase", "You give chase. The man cuts through the street. At the same instant, a speeding car collides with him.", pages.ADVANCE);
new Option("WoopsMurder", "Chase", "Oh...", function () { return goToSub("RunNextDay") });
// new SubScenario("WoopsMurder", "LetGo", "You let the man go and go home, sad(?) that you couldn't get your fix.", pages.ADVANCE);
new Option("WoopsMurder", "LetGo", "SAD!", goToRandom);
// EXCLUDE NON-ADULT
// Exclude Non-Adult - CopBattle
// new SubScenario("CopBattle", "Intro", "You are getting out of your car, when a cop calls out to you.");
new Option("CopBattle", "Intro", "Haha, bye!", speedAwayCard);
new Option("CopBattle", "Intro", "Talk with the cop", function () { return goToSub("Talk")});
// new SubScenario("CopBattle", "SpeedAway", "[Result of speeding away]", pages.ADVANCE);
new Option("CopBattle", "SpeedAway", "", function () { return });
// new SubScenario("CopBattle", "Talk", "You ask the cop what he wants. He asks to search your car.");
new Option("CopBattle", "Talk", "Okay...", searchYesCard);
new Option("CopBattle", "Talk", "Nah", searchYesCard);
// new SubScenario("CopBattle", "SearchYes", "You allow the cop to search your car. [Result of findings]", pages.ADVANCE);
new Option("CopBattle", "SearchYes", "", function () { return 1; });
// new SubScenario("CopBattle", "SearchNo", "You tell the cop no. [Upset = jail check, Else mistake]", pages.ADVANCE);
// ^^ tossed
// ALL SUBSCENARIOS
// All - TheftWitness
// new SubScenario("TheftWitness", "Intro", "On your way home, you see a man holding up a convienence store with a gun.");
new Option("TheftWitness", "Intro", "Time to be a hero", function () { return goToSub("Hero")});
new Option("TheftWitness", "Intro", "I didn't see anything", sawNothingCard);
// new SubScenario("TheftWitness", "Hero", "[Result of Heroics]", pages.ADVANCE);
new Option("TheftWitness", "Hero", "Ouch.", goToRandom);
// new SubScenario("TheftWitness", "SawNothing", "[Whether robber notices you]", pages.ADVANCE);
new Option("TheftWitness", "SawNothing", "", function () { return });
// new SubScenario("TheftWitness", "GivesGun", "The robber gives you his gun and runs off.", pages.ADVANCE);
new Option("TheftWitness", "GivesGun", "No, wait!", function () { return goToSub("DumbFounded")});
// new SubScenario("TheftWitness", "DumbFounded", "You hold the gun in your hand, dumbfounded. The police arrive and see you.");
new Option("TheftWitness", "DumbFounded", "Set the gun down", setDownCard);
new Option("TheftWitness", "DumbFounded", "Hold the gun out", holdOutCard);
// new SubScenario("TheftWitness", "SetDown", "[Result of setting gun down]", pages.ADVANCE);
new Option("TheftWitness", "SetDown", "", function () { return 1; });
// new SubScenario("TheftWitness", "HoldOut", "[Result of setting holding the gun out]", pages.ADVANCE);
new Option("TheftWitness", "HoldOut", "", function () { return 1; });
// All - FalseAccuse
// new SubScenario("FalseAccuse", "Intro", "You hear a knock on your door. You answer it, to see a cop standing on your doorstep. He claims there is a warrant out for your arrest.");
// new Option("FalseAccuse", "Intro", "", function () { return });
// new Option("FalseAccuse", "Intro", "", function () { return });
// new SubScenario("FalseAccuse", "SlamDoor", "You slam the door and hide in your room. You hear kicks and the breaking of wood, and the cop comes to you.");
// new Option("FalseAccuse", "SlamDoor", "", function () { return });
// new Option("FalseAccuse", "SlamDoor", "", function () { return });
// new SubScenario("FalseAccuse", "Run", "You get up to run away from him. The cop frantically removes his pistol from its holster and takes a shot. You are dead.", pages.ADVANCE);
// new Option("FalseAccuse", "Run", "", function () { return });
// new SubScenario("FalseAccuse", "HandsUp", "You put your hands. You are brought to the station and [jailed/released]", pages.ADVANCE);
// new Option("FalseAccuse", "HandsUp", "", function () { return });
// new SubScenario("FalseAccuse", "GoWillingly", "You go with the cop willingly. You are brought to the station and [jailed/released]", pages.ADVANCE);
// new Option("FalseAccuse", "GoWillingly", "", function () { return });

/* OPTION HELPER FUNCTIONS */
function goTo(scenario) {
	scenarios.current = getScenarioByName(scenario);
	return 1;
}

function goToSub(subScenario) {
	scenarios.currentSub = scenarios.current.subScenarios[subScenario];
	return 1;
}

function goToRandom() {
	scenarios.current = scenarios.getRandomScenario();
	return 1;
}
// Specific
function randomTag() {
	var random = Math.floor(Math.random()* 2) + 1;
	if (random == 2) {
		goToSub("RecessTagGood");
	} else {
		goToSub("RecessTagBad");		
	}
	return 1;
}

function collegeCard() {
	var jailed = rollJail();
	goToSub("Yes");
	if (!jailed) {
		collegedeg = 1;
		scenarios.current.subScenarios["Yes"].promptText = "You manage to get your hands on a degree. Nice job!";
	} else {
		scenarios.current.subScenarios["Yes"].promptText = "You drop out of college a month in after joining greek life and partying nonstop.";
	}
	if (!jailed) {
		scenarios.currentSub.options[0].cardText = "Wew!";
	} else {
		scenarios.currentSub.options[0].cardText = "I wonder how that happened";
	}
	return 1;	
}

function speedAwayCard() {
	var jailed = rollJail();
	goToSub("SpeedAway");
	if (jailed == false) {
		scenarios.current.subScenarios["SpeedAway"].promptText = "You get away, luckily.";
	} else {
		scenarios.current.subScenarios["SpeedAway"].promptText = "The cop pulls chases you down and arrests you.";
	}
	if (jailed == false) {
		scenarios.currentSub.options[0].cardText = "I did it!";
		scenarios.currentSub.options[0].action = goToRandom;
	} else {
		scenarios.currentSub.options[0].cardText = "Hey! Wait!";
		scenarios.currentSub.options[0].action = toJail;
	}
	return 1;		
}

function adCard() {
	var jailed = rollJail();
	goToSub("PersonalAd");
	if (!jailed) {
		job = 1;
		scenarios.current.subScenarios["PersonalAd"].promptText = "Someone decides to hire you. Nice!";
	} else {
		scenarios.current.subScenarios["PersonlAd"].promptText = "Nothing seems to be biting...";
	}
	if (!jailed) {
		scenarios.currentSub.options[0].cardText = "Got'em";
	} else {
		scenarios.currentSub.options[0].cardText = "Better change my bait";
	}
	return 1;
}

function interviewCard() {
	var jailed = rollJail();
	if (!jailed) {
		job = 1;
		goToSub("JobSucc");
	} else {
		goToSub("JobFail")
	}
	return 1;
}

function dateRandom() {
	var jailed = rollJail();
	if (!jailed) {
		goToSub("PastaGood");
	} else {
		goToSub("PastaBad")
	}
	return 1;
}

function dateBadRandom() {
	var jailed = rollJail();
	if (!jailed) {
		goToSub("PastaLeave");
	} else {
		goToSub("PastaReallyBad")
	}
	return 1;	
}

function rollForDating() {
	var jailed = rollJail();
	if (!jailed) {
		dating = 1;
		goToRandom();
	} else {
		goToSub("PastaReallyBad");
	}
	return 1;	
}

function marriedCard() {
	var jailed = rollJail();
	goToSub("Yes");
	if (!jailed) {
		married = 1;
		scenarios.current.subScenarios["Yes"].promptText = "They agree, and you get hitched. Congrats.";
	} else {
		scenarios.current.subScenarios["Yes"].promptText = "They need more time to think... maybe next time.";
	}
	if (!jailed) {
		scenarios.currentSub.options[0].cardText = "Woohoo!";
	} else {
		scenarios.currentSub.options[0].cardText = "Aw...";
	}
	return 1;
}

function stealCard() {
	var jailed = rollJail();
	goToSub("Steal");
	if (!jailed) {
		scenarios.current.subScenarios["Steal"].promptText = "Well, you got away with it.";
	} else {
		scenarios.current.subScenarios["Steal"].promptText = "You are caught trying to steal your neighbors garden gnomes to sell to gnome collectors and thrown in jail.";
	}
	if (!jailed) {
		scenarios.currentSub.options[0].cardText = "Yippie!";
	} else {
		scenarios.currentSub.options[0].cardText = "This was a bad decision";
		scenarios.currentSub.options[0].action = toJail;
	}
	return 1;
}

function waitCard() {
	var jailed = rollJail();
	goToSub("Wait");
	if (!jailed) {
		scenarios.current.subScenarios["Wait"].promptText = "Waiting seems to have worked, somehow...";
	} else {
		scenarios.current.subScenarios["Wait"].promptText = "Debtors come to your house with the police and you are thrown in jail.";
	}
	if (!jailed) {
		scenarios.currentSub.options[0].cardText = "Of course it did.";
		scenarios.currentSub.options[0].action = goToRandom;
	} else {
		scenarios.currentSub.options[0].cardText = "Darn it";
		scenarios.currentSub.options[0].action = toJail;
	}
	return 1;
}

function runCard() {
	var jailed = rollJail();
	goToSub("Run");
	if (!jailed) {
		scenarios.current.subScenarios["Run"].promptText = "You run all the way back to your house, and are safe.";
	} else {
		scenarios.current.subScenarios["Run"].promptText = "You get away safely and...";
	}
	if (!jailed) {
		scenarios.currentSub.options[0].cardText = "Thank goodness.";
		scenarios.currentSub.options[0].action = goToRandom;
	} else {
		scenarios.currentSub.options[0].cardText = "...and?";
		scenarios.currentSub.options[0].action = function() { return goToSub("RunNextDay") };
	}
	return 1;
}

function searchYesCard() {
	var jailed = rollJail();
	goToSub("SearchYes");
	if (jailed == false) {
		scenarios.current.subScenarios["SearchYes"].promptText = "The cop finds nothing but tells you to watch yourself.";
	} else {
		scenarios.current.subScenarios["SearchYes"].promptText = "The cop finds nothing but arrests you anyways.";
	}
	if (jailed == false) {
		scenarios.currentSub.options[0].cardText = "Sigh....";
		scenarios.currentSub.options[0].action = goToRandom;
	} else {
		scenarios.currentSub.options[0].cardText = "Hey! Wait!";
		scenarios.currentSub.options[0].action = toJail;
	}
	return 1;	
}

function sawNothingCard() {
	var jailed = rollJail();
	goToSub("SawNothing");
	if (jailed == false) {
		scenarios.current.subScenarios["SawNothing"].promptText = "You walk away safely.";
	} else {
		scenarios.current.subScenarios["SawNothing"].promptText = "You try to get away but you see the robber come up to you.";
	}
	if (jailed == false) {
		scenarios.currentSub.options[0].cardText = "That was tense";
		scenarios.currentSub.options[0].action = goToRandom;
	} else {
		scenarios.currentSub.options[0].cardText = "Uh...";
		scenarios.currentSub.options[0].action = function() { return goToSub("GivesGun") };
	}
	return 1;	
}

function setDownCard() {
	var jailed = rollJail();
	goToSub("SetDown");
	if (jailed == false) {
		scenarios.current.subScenarios["SetDown"].promptText = "The police see you put the gun down and let you explain yourself. They tell you you are free to go.";
	} else {
		scenarios.current.subScenarios["SetDown"].promptText = "The police arrest you without allowing you to explain yourself.";
	}
	if (jailed == false) {
		scenarios.currentSub.options[0].cardText = "Great!";
		scenarios.currentSub.options[0].action = goToRandom;
	} else {
		scenarios.currentSub.options[0].cardText = "Wot";
		scenarios.currentSub.options[0].action = toJail;
	}
	return 1;	
}

function holdOutCard() {
	var jailed = rollJail();
	goToSub("HoldOut");
	if (jailed == false) {
		scenarios.current.subScenarios["HoldOut"].promptText = "The police pick the gun off of you and allow you to leave.";
	} else {
		scenarios.current.subScenarios["HoldOut"].promptText = "The police arrest you without allowing you to explain yourself.";
	}
	if (jailed == false) {
		scenarios.currentSub.options[0].cardText = "Great!";
		scenarios.currentSub.options[0].action = goToRandom;
	} else {
		scenarios.currentSub.options[0].cardText = "Wot";
		scenarios.currentSub.options[0].action = toJail;
	}
	return 1;	
}
/* END OPTION HELPER FUNCTIONS */
/* END OPTIONS */

// END POPULATE SCENARIO DATA

function toJail() {
	changePage(pages.END);
	return 0;
}

function resetGame() {
	randomizeStats();
	age = 6;
	highdeg = 0;
	collegedeg = 0;
	job = 0;
	dating = 0;
	married = 0;
	scenarioAgeGroups.CHILD["Park"].vars["elapsed"] = 0;
	scenarioAgeGroups.CHILD["School"].vars["elapsed"] = -1;
	scenarios.current = scenarioAgeGroups.CHILD["Park"];
}

// main
// Add event handlers to game buttons.
function main() {
	scenarios.current.loopFunc();
	changePage(scenarios.currentSub.type);
	incrementAge(); // increase age (hopefully) every new scenario
}
qbox1.addEventListener("click", function() {
	if (scenarios.currentSub.options[0].action() == 1) {
		main();
	}
}, false);
qbox2.addEventListener("click", function() {
	if (scenarios.currentSub.options[1].action() == 1) {
		main();
	}
}, false);
midButton.addEventListener("click", function() {
	midFunc();
}, false);	
// start out with scenario set to random child element and it's
// intro scenario.
//scenarios.current = randomObjIndex(scenarioAgeGroups.CHILD);
//scenarios.current = scenarioAgeGroups.CHILD["Park"];
scenarios.current = scenarioAgeGroups.CHILD["Park"];
randomizeStats();
changePage(pages.MAIN);