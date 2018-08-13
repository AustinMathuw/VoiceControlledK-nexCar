#Raspberry Pi controlled Car (via Arduino)
#Author: Austin Wilson

#Import packages from PubHub
from pubnub import Pubnub

#Setup Serial communication between Arduino and Raspberry Pi
import serial
import RobotPackage
import RPi.GPIO as GPIO
import time
import sys
import pubnubControlOffline

ser = serial.Serial('/dev/ttyACM0', 9600)

#Point to the PubNub Device
pubnub = Pubnub(publish_key="pub-c-0ba1d27d-852a-4884-a4f7-007874c4c3c3", subscribe_key="sub-c-cbf2cabc-4ce9-11e6-a1d5-0619f8945a4f", ssl_on=False) #UPDATE WITH YOUR INFORMATION IF YOU ARE SELF HOSTING

#Set user's channel to their sessionID
#channel = raw_input('Please Enter your session ID: ')
channel = "my_deviceAustinMath"
#Prepare Servo Control
GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.OUT)
pwm = GPIO.PWM(18, 100)
pwm.start(5)
pwm.ChangeDutyCycle(7.5)
duty = 7.5

#Prepare Drive Motor Control
LEFT_TRIM = 0
RIGHT_TRIM = 0
robot = RobotPackage.Robot(left_trim=LEFT_TRIM, right_trim=RIGHT_TRIM)

def callback(message, channel):
	global duty	
	type = message['type']
	command = message['command']
	print command
	if type == "turn":
		if command == "right":
			if duty != 10:
				duty = duty + 2.5
				pwm.ChangeDutyCycle(duty) #45 degrees right
		elif command == "left":
			if duty != 5:			
				duty = duty - 2.5
				pwm.ChangeDutyCycle(duty) #45 degrees left
		else:
			print("Not a valid turn")	
	elif type == "direction":
		if command == "forward" or command == "straight":
                        robot.forward(150)
                elif command == "backward" or command == "reverse" or command == "back":
                        robot.backward(150)
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
                        robot.stop()
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
	time.sleep(4)
	ser.write('4')
	print("Done")


def reconnect(message):
	print("RECONNECTED")


def disconnect(message):
	print("DISCONNECTED")
	robot.stop()
	pubnubControlOffline.offlineLoop(ser)


pubnub.subscribe(channels=channel, callback=callback, error=error,
                 connect=connect, reconnect=reconnect, disconnect=disconnect)
