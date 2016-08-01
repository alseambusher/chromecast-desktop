'use strict';
const electron = require('electron');
const app = electron.app;
var home = require("./js/home.js");
//var reader = require('midi-reader');

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

app.on('window-all-closed', app.quit);

app.on('ready', () => {
	const mainWindow = new electron.BrowserWindow({
		width: 800,
		height: 500
	});

	mainWindow.loadURL(`file://${__dirname}/index.html`);
	mainWindow.on('closed', onClosed);
	//mainWindow.openDevTools();
	home.init();
});
