/*
Raspberry Pi Voice Control Alexa Skill
Author: Austin Wilson (16)
*/

//Import assests
var skillSetup = require('./skillSetup');
var speeds = require('./speeds');
var colors = require('./colors');
var directions = require('./directions');
var turns = require('./turns');

var APP_ID = undefined; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var CarControl = function () {
    skillSetup.call(this, APP_ID);
};

// Extend skillSetup
CarControl.prototype = Object.create(skillSetup.prototype);
CarControl.prototype.constructor = CarControl;

CarControl.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

CarControl.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleWelcomeRequest(response);
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
				response.askWithCard(speechOutput, repromptOutput, cardTitle, cardContent);
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
        } else if (speedSlot && speedSlot.value) { //If speed
			speedValue = speedSlot.value.toLowerCase();
			speed = speeds[speedValue];
			if (speed) { //If speed is in list
				speechOutput = {
					speech: speed, //Output the speed sentence from it's list.
					type: skillSetup.speechOutputType.PLAIN_TEXT
				};
				repromptOutput = {
					speech: "What else can I help with?",
					type: skillSetup.speechOutputType.PLAIN_TEXT
				};
				cardContent =  speed;
				response.askWithCard(speechOutput, repromptOutput, cardTitle, cardContent);
			} else { //Speed is not in list
				speechOutput = {
					speech: "I'm sorry, I cannot set the speed to that. For a list of valid speeds, try, what are the available speeds.",
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
				response.askWithCard(speechOutput, repromptOutput, cardTitle, cardContent);
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
				response.askWithCard(speechOutput, repromptOutput, cardTitle, cardContent);
			} else  { //Color is not in list
				speechOutput = {
					speech: "I'm sorry, I cannot set the car's lights  to that color. For a list of valid colors, try, what are the available colors.",
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
		handleStopCarRequest(response); //Stop Car
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
	
	"SupportedSpeedsIntent": function (intent, session, response){
		handleAvailableSpeedsRequest(response); //Available Speeds
	},

    "AMAZON.HelpIntent": function (intent, session, response) {
        handleHelpRequest(response); //Run Help
    },

    "AMAZON.StopIntent": function (intent, session, response) { //End Program
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) { //End Program
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

function handleWelcomeRequest(response) {
	var repromptSpeech = "For instructions on what you can say, please say help me.";
    var speechOutput = "Welcome to the Raspberry Pi voice controlled car. What would you like me to do? " + repromptSpeech;
    response.ask(speechOutput, repromptSpeech);
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

    response.ask(speechOutput, repromptSpeech);
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

function handleStopCarRequest(response){ //Stop car function
	var repromptSpeech,
		speechOutput;
	
	repromptSpeech = "What else can I help with?";	
	speechOutput = "The car is now stoping. " + repromptSpeech;
	response.ask(speechOutput, repromptSpeech);
}

function handleAvailableDirectionsRequest(response) { //Available Directions Function
	var repromptSpeech,
        speechOutput;
		
	speechOutput = "You can pick from any of these directions: " + getAllDirectionsText();
	repromptSpeech = "You can pick a direction now or do something else.";
	response.ask(speechOutput, repromptSpeech);
}

function handleAvailableSpeedsRequest(response) { //Available Speeds Function
	var repromptSpeech,
        speechOutput;
		
	speechOutput = "You can pick from any of these speeds: " + getAllSpeedsText();
	repromptSpeech = "You can pick a speed now or do something else.";
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
