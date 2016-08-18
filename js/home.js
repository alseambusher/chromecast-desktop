/*jshint esversion: 6 */
const electron = require("electron");
const ipc = electron.ipcMain;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

exports.interrupt = true;

exports.init = function() {
	ipc.on("midi-load-song", (event, song) => {
		console.log(song);
		exports.song_out = song;
	});

	ipc.on("clear-keyboard", () => {
		led.strip.color("#000");
		led.strip.show();
	});
};
