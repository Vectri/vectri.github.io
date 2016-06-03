$(document).ready(function () {
	'use strict';
 	var wordURL = "http://api.wordnik.com:80/v4/words.json/wordOfTheDay?api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5&callback=?";
	$.getJSON(wordURL)
	.done(function (data) {
		var word = data.word;
		$("#word").text(word);
		$("#partofspeech").text(data.definitions[0].partOfSpeech);
		$("#definition").text(data.definitions[0].text);
		function charToNumber (s, i) {
			return parseInt(s.charAt(i), 36) - 9;
		}
		var bghex = charToNumber(word, 0) + "" + charToNumber(word, 1)
		+ "" + charToNumber(word, 2) + "" + charToNumber(word, 3);
		while (bghex.length !== 6) {
			if (bghex.length > 6) {
				bghex = bghex.slice(0, -1);
			} else {
				bghex += "0";
			}
		}
		bghex = Color_mixer.mix($.Color("#" + bghex), $.Color("#ffffff"));
		$("body").css("background-color", bghex);
	})
	.fail(function (textStatus) {
		console.log("Error: " + textStatus);
	});
	$(".author").click(function () {
		window.location = "http://vectri.github.io/";
	});
	if (location.protocol === 'https:') {
		$("#word").text("HTTPS");	
		$("#definition").text("If you want to view this page you must disable HTTPS.");
		bghex = Color_mixer.mix($.Color("#FF0000"), $.Color("#ffffff"));
		$("body").css("background-color", bghex);
	}
});