/*jshint esversion: 6 */
var remote = require('electron').remote;
var dialog = remote.require('dialog');
const ipcRenderer = require('electron').ipcRenderer;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var navs = ["home", "recommend"];
var selected_song;

navs.forEach(function (e){
	document.getElementById("nav-"+e).addEventListener('click', function(event){
		event.preventDefault();
		navs.forEach(function (e_){
			document.getElementById("pane-"+e_).style.display="none";
		});
		document.getElementById("pane-"+e).style.display="block";
		
		if (e=="recommend"){
			xmlhttp.send(JSON.stringify(selected_song));
		}
	});
});

document.ondragover = document.ondrop = (ev) => {
	ev.preventDefault();
};

document.body.ondrop = (ev) => {
	console.log(ev.dataTransfer.files[0].path);
	ev.preventDefault();
};

document.getElementById("button-midi-start").addEventListener('click', function(event){
	mode = document.getElementById("record-mode").value;
	speed = parseFloat(document.getElementById("record-mode-speed").value);
	ipcRenderer.send('midi-start-record-'+mode, speed);
});

document.getElementById("button-midi-stop").addEventListener('click', function(event){
	mode = document.getElementById("record-mode").value;
	ipcRenderer.send('midi-stop-record');
});

document.getElementById("button-midi-clear").addEventListener('click', function(event){
	ipcRenderer.send('clear-keyboard');
});

document.getElementById("button-midi-refresh").addEventListener('click', function(event){
	getStore();
});

function loadSong(song){
	selected_song = song;
	ipcRenderer.send('midi-load-song', song);
}
