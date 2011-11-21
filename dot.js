$(document).ready(function() {
	// Canvas & Border
  	
	const paperWidth = 100;
	const paperHeight = 100;
	const maxRadius = 10;
	
	randRange = function(M, N) {
		return Math.floor(M + (1+N-M)*Math.random());
	};
	

	var paper = Raphael(10, 40, paperWidth, paperHeight);
	var border = paper.rect(0, 0, paperWidth, paperHeight).attr({'stroke-width': 1});
	
	// Template for the dots
	var dot = paper.circle(100,100,0).attr({fill: "#000"});
	
	// Making the button work
	$(":button").click(function(){
	var dotClone = dot.clone();
	
	 
	
	var randomNumberR = randRange(0, maxRadius);  
	// Ensures that all circles draw within the borders of the paper.
	var randomNumberX = randRange(maxRadius + border.attr('stroke-width'), paperWidth - maxRadius - border.attr('stroke-width')); 
	var randomNumberY = randRange(maxRadius + border.attr('stroke-width'), paperHeight - maxRadius- border.attr('stroke-width'));
	
	dotClone.animate({cx:randomNumberX, cy: randomNumberY, r:randomNumberR}, 1);	
	})
});