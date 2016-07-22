#Raspberry Pi controlled Car (via Arduino)
#Author: Austin Wilson

#Import packages from PubHub
from pubnub import Pubnub

#Setup Serial communication between Arduino and Rspberry Pi
import serial

import RPi.GPIO as GPIO
import time
import sys
ser = serial.Serial('/dev/ttyACM0', 9600)

#Point to the PubHub Device
pubnub = Pubnub(publish_key="pub-c-0ba1d27d-852a-4884-a4f7-007874c4c3c3", subscribe_key="sub-c-cbf2cabc-4ce9-11e6-a1d5-0619f8945a4f", ssl_on=False) #UPDATE WITH YOUR INFORMATION IF YOU ARE SELF HOSTING

#Set user's channel to their sessionID
channel = raw_input('Please Enter your session ID: ')
#channel = "my_device" UNCOMMENT IF YOU ARE HOSTING YOURSELF

#Prepare Servo Control
GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.OUT)
pwm = GPIO.PWM(18, 100)
pwm.start(5)
pwm.ChangeDutyCycle(7.5)


def callback(message, channel):
	type = message['type']
	command = message['command']
	if type == "turn":
		if command == "right":
			pwm.ChangeDutyCycle(10) #45 degrees right
		elif command == "left":
			pwm.ChangeDutyCycle(5) #45 degrees left
		else:
			print("Not a valid turn")	
	elif type == "direction":
		if command == "forward" or command == "straight":
                        ser.write('0')
                elif command == "backward" or command == "reverse" or command == "back":
                        ser.write('1')
                else:          
                        print("Not a valid direction")
	elif type == "color":
                if command == "green":
                        ser.write('2')
                elif command == "red":
                        ser.write('3')
		elif command == "blue":
                        ser.write('4')
		elif command == "orange":
                        ser.write('5')
		elif command == "yellow":
                        ser.write('6')
                else:
                        print("Not a valid color") 
	elif type == "stop":
                if command == "stop":
                        ser.write('7')
                else:
                        print("Not a valid stop")
	elif type == "end":
		ser.write('7')
		GPIO.cleanup()
		print("Goodbye")  
		sys.exit()

def error(message):
	print("ERROR : " + str(message))


def connect(message):
	print("CONNECTED")


def reconnect(message):
	print("RECONNECTED")


def disconnect(message):
	print("DISCONNECTED")


pubnub.subscribe(channels=channel, callback=callback, error=error,
                 connect=connect, reconnect=reconnect, disconnect=disconnect)
