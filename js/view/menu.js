var remote = require('electron').remote; 
var dialog = remote.require('dialog');
const ipcRenderer = require('electron').ipcRenderer;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var navs = ["home", "recommend"];
var selected_song = undefined;

navs.forEach(function (e){
	document.getElementById("nav-"+e).addEventListener('click', function(event){
  		event.preventDefault();
		navs.forEach(function (e_){
			document.getElementById("pane-"+e_).style.display="none";
		});
		document.getElementById("pane-"+e).style.display="block";

		if (e=="recommend"){
			xmlhttp = new XMLHttpRequest();
   			xmlhttp.open("POST","http://b-sharp.co/recommend", true);
   			xmlhttp.onreadystatechange=function(){
         			if (xmlhttp.readyState==4 && xmlhttp.status==200){
           				string=xmlhttp.responseText;
					songs = JSON.parse(string)[0].similar;
					var html="";
					for (var i=0; i<songs.length; i++){
			
						html += "<tr onclick='loadSong("+JSON.stringify(songs[i])+")'><td>";
						html += "Suggestion "+(i+1);
						html += "</td><td>"+songs[i].length+"</td></tr>";

					}
					document.getElementById("store-recommend").innerHTML=html;

         			}
   			}
   			xmlhttp.send(JSON.stringify(selected_song));
		}
	});
});

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

function getStore() {
	$.get("http://b-sharp.co/store", function(data){
		songs = JSON.parse(data);
		var html = "";
		for (var i=0; i<songs.length; i++){
			
			html += "<tr onclick='loadSong("+JSON.stringify(songs[i].song)+")'><td>";
			html += new Date(Math.round(songs[i].timestamp)).toTimeString();
			html += "</td><td>"+songs[i].song.length+"</td></tr>";

		}
		document.getElementById("store").innerHTML=html;
	});
}

getStore();

