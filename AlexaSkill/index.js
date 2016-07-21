/*
Raspberry Pi Voice Control Alexa Skill
Author: Austin Wilson (16)
*/

//Import assests
var skillSetup = require('./skillSetup');
var colors = require('./colors');
var directions = require('./directions');
var turns = require('./turns');
var stops = require('./stop');

//PubHub server infromation (This is how i send the information to the Raspberry Pi)
var iotCloud = require("pubnub")({
  ssl           : true,  // <- enable TLS Tunneling over TCP 
  publish_key   : "pub-c-0ba1d27d-852a-4884-a4f7-007874c4c3c3",
  subscribe_key : "sub-c-cbf2cabc-4ce9-11e6-a1d5-0619f8945a4f"
});

var APP_ID = undefined //'amzn1.echo-sdk-ams.app.6e1ee6be-a692-407e-8373-f978b7314f18'; //Points to my Alexa Skill

var CarControl = function () {
    skillSetup.call(this, APP_ID);
};

// Extend skillSetup
CarControl.prototype = Object.create(skillSetup.prototype);
CarControl.prototype.constructor = CarControl;

CarControl.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

CarControl.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleWelcomeRequest(session, response); //Sends my skill's welcome information
};

CarControl.prototype.intentHandlers = {
	//Set car's movement
    "CarControlIntent": function (intent, session, response) {
        // Determine if this is for Turn, for Direction, for Speed, or an error.
        var directionSlot = intent.slots.Direction,
			speedSlot = intent.slots.Speed,
			turnSlot = intent.slots.Turn,
			turnValue,
			directionValue,
			speedValue,
			turn,
			direction,
			speed,
			cardTitle = "New car motion.",
			cardContent,
			speechOutput,
			repromptOutput;

		if (turnSlot && turnSlot.value) { //If turn
			turnValue = turnSlot.value.toLowerCase();
			turn = turns[turnValue];
			if (turn) {
				speechOutput = { //Checks if turn is in list
					speech: turn, //Output the turn sentence from it's list.
					type: skillSetup.speechOutputType.PLAIN_TEXT
				};
				repromptOutput = {
					speech: "What else can I help with?",
					type: skillSetup.speechOutputType.PLAIN_TEXT
				};
				cardContent =  turn;
				//Here, I store the turn information into a message and I send it to PubHub.
				var turnMessage = {
						"type":"turn",
                        "command":turnValue
                    };
                console.log(iotCloud.get_version());
                iotCloud.publish({ //Publishes the turn message to my PubHub Device.
                    channel   : "my_device",
                    message   : turnMessage,
                    callback  : function(e) { 
                        console.log( "SUCCESS!", e ); 
                        response.askWithCard(speechOutput, repromptOutput, cardTitle, cardContent);
                        },
                    error     : function(e) { 
                        response.tellWithCard("Could not connect", "Raspberry Pi Car", "Could not connect");
                        console.log( "FAILED! RETRY PUBLISH!", e ); }
                });
			} else { //Turn is not in list
				speechOutput = {
					speech: "I'm sorry, I cannot set the turn to that. For a list of valid turns, try, what are the available turns.",
					type: skillSetup.speechOutputType.PLAIN_TEXT
				};
				repromptOutput = {
					speech: "What else can I help with?",
					type: skillSetup.speechOutputType.PLAIN_TEXT
				};
				response.ask(speechOutput, repromptOutput);
			}
        } else if (directionSlot && directionSlot.value) { //If direction
			directionValue = directionSlot.value.toLowerCase();
			direction = directions[directionValue];
			if (direction) { //Check if direction is in list
				speechOutput = {
					speech: direction, //Output the direction sentence from it's list.
					type: skillSetup.speechOutputType.PLAIN_TEXT
				};
				repromptOutput = {
					speech: "What else can I help with?",
					type: skillSetup.speechOutputType.PLAIN_TEXT
				};
				cardContent =  direction;
				//Here, I store the direction information into a message and I send it to PubHub.
				var directionMessage = {
						"type":"direction",
                        "command":directionValue
                    };
                console.log(iotCloud.get_version());
                iotCloud.publish({ //Publishes the direction message to my PubHub Device.
                    channel   : "my_device",
					message   : directionMessage,
                    callback  : function(e) { 
                        console.log( "SUCCESS!", e ); 
                        response.askWithCard(speechOutput, repromptOutput, cardTitle, cardContent);
                        },
                    error     : function(e) { 
                        response.tellWithCard("Could not connect", "Raspberry Pi Car", "Could not connect");
                        console.log( "FAILED! RETRY PUBLISH!", e ); }
                });
			} else { //Direction is not in list
				speechOutput = {
					speech: "I'm sorry, I cannot set the direction to that. For a list of valid directions, try, what are the available directions.",
					type: skillSetup.speechOutputType.PLAIN_TEXT
				};
				repromptOutput = {
					speech: "What else can I help with?",
					type: skillSetup.speechOutputType.PLAIN_TEXT
				};
				response.ask(speechOutput, repromptOutput);
			}
        } else { //If error
            handleNoSlotRequest(response);
        }
    },
	//Set car's lights color
    "CarLightColorIntent": function (intent, session, response) {
        // Determine if this is for Color or an error.
		var colorSlot = intent.slots.Color,
			colorValue,
			color,
			cardTitle = "New color for car's lights.",
			speechOutput,
			repromptOutput;
		
        if (colorSlot && colorSlot.value) { //If color
            colorValue = colorSlot.value.toLowerCase();
			color = colors[colorValue];
			if (color) { //Check if color is in the list
				speechOutput = {
					speech: color, //Output the color sentence from it's list.
					type: skillSetup.speechOutputType.PLAIN_TEXT
				};
				repromptOutput = {
					speech: "What else can I help with?",
					type: skillSetup.speechOutputType.PLAIN_TEXT
				};
				cardContent =  color;
				//Here, I store the color information into a message and I send it to PubHub.
				var colorMessage = {
						"type":"color",
                        "command":colorValue
                    };
                console.log(iotCloud.get_version());
                iotCloud.publish({ //Publishes the color message to my PubHub Device.
                    channel   : "my_device",
					message   : colorMessage,
                    callback  : function(e) { 
                        console.log( "SUCCESS!", e ); 
                        response.askWithCard(speechOutput, repromptOutput, cardTitle, cardContent);
                        },
                    error     : function(e) { 
                        response.tellWithCard("Could not connect", "Raspberry Pi Car", "Could not connect");
                        console.log( "FAILED! RETRY PUBLISH!", e ); }
                });
			} else  { //Color is not in list
				speechOutput = {
					speech: "I'm sorry, I cannot set the car's lights to that. For a list of valid colors, try, what are the available colors.",
					type: skillSetup.speechOutputType.PLAIN_TEXT
				};
				repromptOutput = {
					speech: "What else can I help with?",
					type: skillSetup.speechOutputType.PLAIN_TEXT
				};
				response.ask(speechOutput, repromptOutput);
			}
		} else { //If error
            handleNoSlotRequest(response);
        }
    },
	
	"StopCarIntent": function (intent, session, response){
		handleStopCarRequest(intent, session, response); //Stop Car
	},
	
	"SupportedDirectionsIntent": function (intent, session, response){
		handleAvailableDirectionsRequest(response); //Available Directions
	},
	
	"SupportedTurnsIntent": function (intent, session, response){
		handleAvailableTurnsRequest(response); //Available Turns
	},
	
	"SupportedColorsIntent": function (intent, session, response){
		handleAvailableColorsRequest(response); //Available Colors
	},
	
	"GetSessionIDIntent": function (intent, session, response){
		handleGetSessionIDRequest(session, response); //Get session id spoken
	},

    "AMAZON.HelpIntent": function (intent, session, response) {
        handleHelpRequest(response); //Run Help
    },

    "AMAZON.StopIntent": function (intent, session, response) { //End Program
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
		handleStopCarOnEndRequest(intent, session, response); //Stop Car
    },

    "AMAZON.CancelIntent": function (intent, session, response) { //End Program
        var speechOutput = "Goodbye";
		response.tell(speechOutput);
		handleStopCarOnEndRequest(intent, session, response); //Stop Car
    }
};

function handleWelcomeRequest(session, response) {
	var repromptSpeech = "For more instructions, please say help me.";
    var speechOutput = "Welcome to the Raspberry Pi voice controlled car. "
		+ "Before we begin, please either refer to your alexa app for your session ID, or ask me for it. "
		+ "You will need it to start the Raspberry Pi application. "
		+ repromptSpeech + " What would you like me to do?";
		cardTitle = "Welcome to the Raspberry Pi Voice Controled Car!";
		cardContent = "Session ID = " + session.sessionId;
    response.askWithCard(speechOutput, repromptSpeech, cardTitle, cardContent);
}

function handleHelpRequest(response) { //Help Function
    var repromptSpeech = "What would you like me to do?";
    var speechOutput = "I can control a Raspberry Pi powered car. "
        + "To change the car's lights, say something like, change lights to blue. "
		+ "For a list of valid colors, try, what are the available colors. "
        + "To change the car's direction, say something like, go straight. "
		+ "For a list of valid directions, try, what are the available directions. "
        + "To change the car's speed, say something like, change speed to fast. "
		+ "For a list of valid speeds, try, what are the available speeds. "
		+ "To turn the car, say something like, turn the car right. "
		+ "For a list of valid turns, try, what are the available turns. "
		+ "If you want the car to stop, say something like, stop car. "
        + "If you want to exit, say exit. "
        + repromptSpeech;
	var cardContent = speechOutput;
    response.askWithCard(speechOutput, repromptOutput, "Instuctions for Raspberry Pi Car:", cardContent);
}

function handleNoSlotRequest(response) { //Runs when invalid motion or color is given
	var speechOutput = {
		speech: "I'm sorry, I do not understand your request. Please try again.",
		type: skillSetup.speechOutputType.PLAIN_TEXT
	};
	var repromptSpeech = {
		speech: "What else can I help with?",
		type: skillSetup.speechOutputType.PLAIN_TEXT
	};
	response.ask(speechOutput, repromptSpeech);
	
}

function handleStopCarRequest(intent, session, response){ //Stop car function
	var stopSlot = intent.slots.stop,
		stopValue,
		stop,
		repromptSpeech,
		speechOutput,
		cardTitle = "Car Stopped",
		cardContent;

	if (stopSlot && stopSlot.value) { //If turn
		stopValue = stopSlot.value.toLowerCase();
		stop = stops[stopValue];
		if (stop) {
			speechOutput = { //Checks if turn is in list
				speech: stop, //Output the turn sentence from it's list.
				type: skillSetup.speechOutputType.PLAIN_TEXT
			};
			repromptOutput = {
				speech: "What else can I help with?",
				type: skillSetup.speechOutputType.PLAIN_TEXT
			};
			cardContent =  stop;
			//Here, I store the stop information into a message and I send it to PubHub.
			var stopMessage = {
					"type":"stop",
					"command":stopValue
				};
			console.log(iotCloud.get_version());
			iotCloud.publish({ //Publishes the stop message to my PubHub Device.
				channel   : "my_device",
				message   : stopMessage,
				callback  : function(e) { 
					console.log( "SUCCESS!", e ); 
					response.askWithCard(speechOutput, repromptSpeech, cardTitle, cardContent);
					},
				error     : function(e) { 
					response.tellWithCard("Could not connect", "Raspberry Pi Car", "Could not connect");
					console.log( "FAILED! RETRY PUBLISH!", e ); }
			});
		} else { //Turn is not in list
			handleNoSlotRequest(response);
		}
	}
}

function handleStopCarRequest(intent, session, response){ //Stop car function ONEND
	
	//Here, I store the stop information into a message and I send it to PubHub.
	var stopMessage = {
			"type":"end",
			"command":"stop"
	};
	console.log(iotCloud.get_version());
	iotCloud.publish({ //Publishes the stop message to my PubHub Device.
		channel   : "my_device",
		message   : stopMessage,
		callback  : function(e) { 
			console.log( "SUCCESS!", e ); 
			},
		error     : function(e) { 
			response.tellWithCard("Could not connect", "Raspberry Pi Car", "Could not connect");
			console.log( "FAILED! RETRY PUBLISH!", e ); }
	});
}

function handleAvailableDirectionsRequest(response) { //Available Directions Function
	var repromptSpeech,
        speechOutput;
		
	speechOutput = "You can pick from any of these directions: " + getAllDirectionsText();
	repromptSpeech = "You can pick a direction now or do something else.";
	response.ask(speechOutput, repromptSpeech);
}

function handleAvailableColorsRequest(response) { //Available Colors Function
	var repromptSpeech,
        speechOutput;
		
	speechOutput = "You can pick from any of these colors: " + getAllColorsText();
	repromptSpeech = "You can pick a color now or do something else.";
	response.ask(speechOutput, repromptSpeech);
}

function handleAvailableTurnsRequest(response) { //Available Turns Function
	var repromptSpeech,
        speechOutput;
		
	speechOutput = "You can pick from any of these turns: " + getAllTurnsText();
	repromptSpeech = "You can pick a turn now or do something else.";
	response.ask(speechOutput, repromptSpeech);
}

function handleGetSessionIDRequest(session, response) {
	var repromptSpeech,
        speechOutput = {
			type: skillSetup.speechOutputType.SSML,
			speech: "<speak><say-as interpret-as='spell-out'>"+ session.sessionId+"</say-as></speak>"
		};
	repromptSpeech = "When you are connected, you can ask me commands to control the car";
	response.ask(speechOutput, repromptSpeech);
}

function getAllColorsText() { //Get colors from list
    var colorList = '';
    for (var color in colors) {
        colorList += color + ", ";
    }

    return colorList;
}

function getAllTurnsText() { //Get turns from list
    var turnList = '';
    for (var turn in turns) {
        turnList += turn + ", ";
    }

    return turnList;
}

function getAllSpeedsText() { //Get speeds from list
    var speedList = '';
    for (var speed in speeds) {
        speedList += speed + ", ";
    }

    return speedList;
}

function getAllDirectionsText() { //Get directions from list
    var directionList = '';
    for (var direction in directions) {
        directionList += direction + ", ";
    }

    return directionList;
}


exports.handler = function (event, context) {
    var carControl = new CarControl();
    carControl.execute(event, context);
};
