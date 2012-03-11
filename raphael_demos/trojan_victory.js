$(document).ready(function() {
	// Canvas & Border

	var paper = Raphael(10, 40, 100, 100);
	var border = paper.rect(0, 0, 100, 100).attr({'stroke-width': 1});
	
	paper.text(30, 50, "Trojan").attr({fill: 'green'});
	country = paper.text(70, 50, "Country").attr({fill: 'blue'});

	// Making the button work
	var onClicker = 0;
	
	$(":button").click(function() {
	
	if (onClicker === 0) {
		onClicker = 1;
		country.attr({text:"Victory", fill: 'red'});
	}
	else {
		onClicker = 0;
		country.attr({text:"Country", fill: 'blue'});
	}
	
	// if (country.attr(text) =="Country")
	// 			country.attr({text:"Victory"});
	// 		else
	// 			country.attr({text:"Country"});
	});
});