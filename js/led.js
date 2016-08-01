var five = require("johnny-five");
var pixel = require("node-pixel");

var opts = {};
opts.port = process.argv[2] || "";
opts.repl = false;

var board = new five.Board(opts);
exports.strip = null;

var KeyTimeStampArray = [
        { Time: 0, Key: 1, State: 1 },
        { Time: .4, Key: 3, State: 1 },
        { Time: .3, Key: 2, State: 1 },
        { Time: 1, Key: 2, State: 0 }

];


function getData( TimeKeyState, i ){
	var Key = TimeKeyState[i].Key;
	var State = TimeKeyState[i].State;
	if(State == 0)
    		exports.strip.pixel(Key).color("black");// 0 - 75
	else if (State == 1)
    		exports.strip.pixel(Key).color("red");
	exports.strip.show();

	if(i>TimeKeyState.length - 2)
	return;

	var Time = TimeKeyState[i+1].Time;

	setTimeout(function(){
    		getData( TimeKeyState, i+1)
	}, Time*1000);

};

board.on("ready", function() {
    exports.strip = new pixel.Strip({
        data: 6,
        length: 76, // number of pixels in the exports.strip.
        color_order: pixel.COLOR_ORDER.GRB,
        board: this,
        controller: "FIRMATA"
    });

    exports.strip.on("ready", function() {
        //getData(KeyTimeStampArray,0);
	var colors = ["red", "green", "blue", "yellow", "cyan", "magenta", "white"];
        var current_colors = [0,1,2,3,4];
        var current_pos = [0,1,2,3,4];

	var counter = 0;
	var blinker = setInterval(function() {
	    exports.strip.color("#000");

            for (var i=0; i< current_pos.length; i++) {
                if (++current_pos[i] >= exports.strip.stripLength()) {
			exports.strip.color("#000");
			if (counter > 30){
				clearInterval(blinker);
				break;
			}
                    	if (++current_colors[i] >= colors.length) current_colors[i] = 0;
                    	current_pos[i] = 0;
                }
                exports.strip.pixel(current_pos[i]).color(colors[current_colors[i]]);
            }
	 counter +=1;
         exports.strip.show();
	 }, 1000/50);
    });
});
