/*\
title: $:/plugins/arlen22/WebSocketServer/attachServer.js
type: application/javascript
module-type: startup

Listens to the `th-websocket-send` hook and sends the message to the server

Invokes the `th-websocket-message` hook when a message is recieved from the server

\*/

(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";
	const prefix = "$:/plugins/arlen22/WebSocketServer";
	// Export name and synchronous status
	exports.name = "init-websocket-client";
	exports.platforms = ["node"];
	exports.before = ["commands"];
	exports.synchronous = true;

	exports.startup = function () {
		//tiddlyserver never calls this hook because the server command execute function is never called
		var client = new WebSocket('ws://' + location.host + location.pathname);
		$tw.hooks.addHook('th-websocket-send', function (message) {
			//add support for binary data
			if (typeof message === 'object') message = JSON.stringify(message);
			else if (typeof message !== "string") message = message.toString();
			//send the message to the server
			client.send(message);
		})
		client.addEventListener('message', function (event) {
			$tw.hooks.invokeHook('th-websocket-message', event);
		})
		client.addEventListener('open', console.log.bind(console, 'open'));
		client.addEventListener('error', console.log.bind(console, 'error'));
		client.addEventListener('close', console.log.bind(console, 'close'));
	}
})();
