/*jshint esversion: 6 */
const electron = require("electron");
const ipc = electron.ipcMain;
var reader = require("./midi-reader.js");
var led = require("./led.js");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var crypto = require("crypto");

exports.mode = 0; // 0 - simple, 1 - learner, 2 - expert

exports.song = [];
exports.song_out =[];

exports.interrupt = true;

colors = ["red", "green", "blue", "yellow", "cyan"];
bcolors = ['cyan', 'yellow', 'blue', 'green', 'red'];

exports.init = function() {
	document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

document.body.ondrop = (ev) => {
  console.log(ev.dataTransfer.files[0].path)
  ev.preventDefault()
}
	reader.start(function(deltaTime, message) {
		//console.log(message, deltaTime);
		m = message.toString().split(",");
		exports.song.push([parseInt(m[0]),parseInt(m[1]),parseInt(m[2]), parseFloat(deltaTime)]);
		});

	ipc.on("midi-start-record-record", () => {
		exports.interrupt = false;
		exports.song = [];
 		midi_start_record();
	});

	ipc.on("midi-start-record-simple", () => {
		exports.interrupt = false;
		exports.song = [];
 		midi_start_record_simple();
	});

	ipc.on("midi-start-record-expert", (event, speed) => {
		exports.interrupt = false;
 		midi_start_record_expert(speed);
	});

	ipc.on("midi-start-record-learner", () => {
		exports.interrupt = false;
		exports.song = [];
		midi_start_record_learner(undefined);
	});

	ipc.on("midi-stop-record", () => {
		//reader.stop();
		exports.interrupt = true;
	});

	ipc.on("midi-load-song", (event, song) => {
		console.log(song);
		exports.song_out = song;
	});

	ipc.on("clear-keyboard", () => {
	    	led.strip.color("#000");
		led.strip.show();
	});

};

function midi_start_record(){
	if (exports.interrupt) {
		exports.song_out = exports.song.slice(0);
		if (exports.song_out.length > 0){
			var iv = new Buffer('asdfasdfasdfasdf');
			var key = new Buffer('asdfasdfasdfasdfasdfasdfasdfasdf');
   			xmlhttp = new XMLHttpRequest();
   			xmlhttp.open("POST","http://b-sharp.co/store", true);
   			xmlhttp.onreadystatechange=function(){
         			if (xmlhttp.readyState==4 && xmlhttp.status==200){
           				string=xmlhttp.responseText;
         			}
   			};
			//cipher.update(new Buffer("test"));
			var chunks = JSON.stringify(exports.song_out).match(/.{1,5}/g);
			var chunks_enc = [];
			for (var i=0; i<chunks.length; i++){
				var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
				cipher.update(new Buffer(chunks[i]));
				var enc = cipher.final('base64');
				chunks_enc.push(enc);
			}
			console.log(chunks_enc);
   			xmlhttp.send(JSON.stringify(exports.song_out));
		}
	} else
		setTimeout(midi_start_record, 10);
}

function midi_start_record_simple(){
	if (!exports.interrupt){
		if (exports.song.length > 0){
			node = exports.song.shift();
			key = node[1] - 28;
			if (node[0] == 128)
				led.strip.pixel(key).color("black");
			else{
				if (white[key]){
					led.strip.pixel(key).color(colors[white[key]]);
				}
				else if(black[key]){
					led.strip.pixel(key).color(bcolors[black[key]]);
				}
				else{
					led.strip.pixel(key).color("white");
				}
			}
			led.strip.show();
		}
		setTimeout(midi_start_record_simple, 10);
	}
}

function midi_start_record_learner(wait){
	if (!exports.interrupt){
		if (wait == undefined){
			if (exports.song_out.length > 0){
				node = exports.song_out.shift();
				key = node[1] - 28;
				if (node[0] != 128){
					led.strip.pixel(key).color("green");
					wait = key;
				}
				led.strip.show();
			}
		} else {
			if (exports.song.length > 0){
				node = exports.song.shift();
				key = node[1] - 28;
				if (node[0] != 128){
					if (wait != key)
						led.strip.pixel(key).color("red");
					else{
						led.strip.pixel(key).color("#000");
						wait = undefined;
					}
				}
				led.strip.show();
			}
		}
		setTimeout( function() { midi_start_record_learner(wait)}, 10);
	}
}

function midi_start_record_expert(speed){
	if (!exports.interrupt){
		if (exports.song_out.length > 0){
			node = exports.song_out.shift();
			key = node[1] - 28;
			if (node[0] == 128){
				led.strip.pixel(key).color("black");
			}
			else{
				if (white[key]){
					led.strip.pixel(key).color(colors[white[key]]);
				}
				else if(black[key]){
					led.strip.pixel(key).color(bcolors[black[key]]);
				}
				else{
					led.strip.pixel(key).color("white");
				}
			}
			led.strip.show();
			if (exports.song_out.length > 0)
				setTimeout( function() {
					midi_start_record_expert(speed)
					}, (exports.song_out[0][3]*1000)/speed);
		}
	}
}
