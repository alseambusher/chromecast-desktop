/*jshint esversion: 6 */
var remote = require('electron').remote;
var dialog = remote.require('dialog');
const ipcRenderer = require('electron').ipcRenderer;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var navs = ["home", "playlists"];
var current_nav = navs[0];

var now_playing = new Songs();

navs.forEach(function (e){
	document.getElementById("nav-"+e).addEventListener('click', function(event){
		event.preventDefault();
		navs.forEach(function (e_){
			document.getElementById("pane-"+e_).style.display="none";
		});
		document.getElementById("pane-"+e).style.display="block";
		current_nav = e;
	});
});

document.ondragover = document.ondrop = (ev) => {
	ev.preventDefault();
};

document.body.ondrop = (ev) => {
	now_playing.add_file(ev.dataTransfer.files[0].path);
	refresh();
	ev.preventDefault();
};

function refresh(){
		var items = document.getElementById("home-table-items");
		items.innerHTML = "";
		now_playing.songs.forEach((song) => {
			let tr = document.createElement("tr");
			let name = document.createElement("td");
			name.innerHTML = song.filename;
			tr.appendChild(name);
			let duration = document.createElement("td");
			duration.innerHTML = song.duration;
			tr.appendChild(duration);
			let path = document.createElement("td");
			path.innerHTML = song.path;
			tr.appendChild(path);
			items.appendChild(tr);
		});
}
//
// document.getElementById("button-midi-start").addEventListener('click', function(event){
// 	mode = document.getElementById("record-mode").value;
// 	speed = parseFloat(document.getElementById("record-mode-speed").value);
// 	ipcRenderer.send('midi-start-record-'+mode, speed);
// });
//
// document.getElementById("button-midi-stop").addEventListener('click', function(event){
// 	mode = document.getElementById("record-mode").value;
// 	ipcRenderer.send('midi-stop-record');
// });
//
// document.getElementById("button-midi-clear").addEventListener('click', function(event){
// 	ipcRenderer.send('clear-keyboard');
// });
//
// document.getElementById("button-midi-refresh").addEventListener('click', function(event){
// 	getStore();
// });
