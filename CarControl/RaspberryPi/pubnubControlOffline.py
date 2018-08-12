#Raspberry Pi controlled Car (via Arduino) OFFLINE
#Author: Austin Wilson

#Setup Serial communication between Arduino and Raspberry Pi
import serial

import time
import sys

ser = serial.Serial('/dev/ttyACM0', 9600)

while True:
	ser.write('3')
	time.sleep(1)
	ser.write('4')
	time.sleep(1)
