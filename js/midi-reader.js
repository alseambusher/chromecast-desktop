var midi = require('midi');
exports.input = new midi.input();

exports.start = function(callback){
	exports.input.getPortCount();
	exports.input.getPortName(0);
	exports.input.on('message', callback);
	exports.input.openPort(0);
	exports.input.ignoreTypes(false, false, false);
}

exports.stop = function() {
	exports.input.closePort();
}

