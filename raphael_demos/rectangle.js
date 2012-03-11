$(document).ready(function() {

	var paper = Raphael(50, 50, 600, 500);
	var rect = paper.rect(0, 50, 50, 200, 5).attr("fill", "#000");

	var start = function () {
	// storing original coordinates
		height = rect.attr("height");
		rect.oy = rect.attr("y");
		rect.attr({opacity: .5});
	},

	move = function (dx, dy) {
	// move will be called with dx and dy
		rect.attr({height: height - dy, y: rect.oy + dy});
		$(":text").val(height - dy);
	},

	up = function () {
	// restoring state
		rect.attr({opacity: 1});
	};

	rect.drag(move, start, up);

	var input = $("#height");

	input.change(function() {
		var height = rect.attr("height");
		var newHeight = parseInt(input.val(), 10);
		var currentY = rect.attr("y");
		var newY = currentY + height - newHeight;
		if (newHeight) {
			rect.animate({y: newY, height: newHeight}, 1000, 'bounce');
		} else {
	  		alert("You must enter a number");
		}
	});

});