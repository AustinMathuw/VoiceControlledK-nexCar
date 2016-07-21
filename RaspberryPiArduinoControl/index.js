/* 'use strict';

 var iotCloud = require("pubnub")({
  ssl           : true,  // <- enable TLS Tunneling over TCP 
  publish_key   : "pub-c-0ba1d27d-852a-4884-a4f7-007874c4c3c3",
  subscribe_key : "sub-c-cbf2cabc-4ce9-11e6-a1d5-0619f8945a4f"
});

// NEW CODE BELOW HERE

iotCloud.subscribe({
	channel  : "my_channel",
	callback : function(message) {
		console.log( " > ", message );
		console.log(message.command);
		
		switch(message.command) {
		case "initiate":
			//code block
		console.log("initiate");
		rollingSpider.flatTrim();
			rollingSpider.startPing();
			rollingSpider.flatTrim();
			break;
		case "takeOff":
			//code block
			console.log("take Off");
		rollingSpider.takeOff();
		rollingSpider.flatTrim();
			
		break;
		case "land":
			//code block
			rollingSpider.land();
			break;
		default:
			//default code block
		}
	}
}); */


var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("/dev/ttyACM0", {
	baudrate: 9600
});

serialPort.on("open", function () {
	console.log('open');
  
	serialPort.on('data', function(data) {
		console.log('data received: ' + data);
	});
  
	serialPort.write(new Buffer('4','ascii'), function(err, results) {
		console.log('err ' + err);
		console.log('results ' + results);
	});
});

