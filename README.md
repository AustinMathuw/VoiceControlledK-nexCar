# Voice Controlled K'nex Car

## Introduction
My project is an example on how K'nex can be used in the internet of things.
When I was younger, I loved to build K'nex roller coasters and when I found the Raspberry Pi and Arduino,
I immediately wanted to make K'nex robots and automate my roller coasters.
I'm 16 now and finally have built up enough coding power to produce a voice enabled application with the Raspberry Pi,
Arduino, and Amazon's Alexa AI. The application takes the user's speech input through a microphone attached to
the Raspberry Pi, sends it to Alexa and Alexa then puts the user's input through my Alexa Skill.
When the Skill has processed the information, Alexa sends it's response back to the Raspberry Pi
After that, the Raspberry Pi sends the commands to the Arduino via Serial Communication.

## Materials Needed
You will need the following materials for installation:
* A Raspberry Pi Model B (2 or 3)
* A 16 GB micro SD card
* Keyboard
* Mouse
* Monitor
* HDMI cord
* Internet connection
* Arduino Uno
* SeeedStudio Motor Shield for Arduino
* 1 4AA Battery Pack
* 1 8AA Battery Pack
* Hookup Wire
* DC Motor (I used an old K'nex motor)
* Servo
* Portable Smartphone Charger (This is optional and is only used to power the Raspberry Pi)
* A way to talk to Alexa (Seperate Raspberry Pi, Echo, ect.)
* A way to access the Alexa Mobile App
* If using a Raspberry Pi 2, you will need a wifi chip

## Installation
### Raspberry Pi
#### Simple (Preferred)
1: Flash SD card with the image at this location:

2: Insert SD card, HDMI cord, mouse, and keyboard into your Pi and boot the Pi up

3: Now, you should be prompted to connect to wifi

4: Press Ctrl+C

5: Open the Desktop:
```
startx
```

6: Connect to wifi

7: Reboot Pi

8: When the Pi boots up, you should be prompted to enter your session ID. (This will appear in your Alexa app when you open the skill)

9: After you press enter, you should see the following:

10: Now you can unplug your HDMI cord, mouse, and keyboard

Your Raspberry Pi is all set now!

#### Advanced
You will need to flash Jessie to the SD card before setup.
1: Disable boot to Desktop. You will find this option in "sudo raspi-config"
2: Reboot your Raspberry Pi
3: Run updates:
```
sudo apt-get update
sudo apt-get upgrade
```
4: Reboot your Raspberry Pi
5: Install PubNub:
```
sudo pip install pubnub
```
6: Download ArduinoControl.py and run it:
```
sudo python ArduinoControl.py
```
7: Enter in your Session ID that was assinged to you by Alexa.
* If you would like to self-host the code, you need to PubNub's website, create an account, and create a device. Put the keys into index.js in the Alexa Skill and in ArduinoControl.py in the Raspberry Pi.


That's it! After your Raspberry Pi reboots, it will prompt you for your session ID. (This will appear in your Alexa app when you open the skill)

### Arduino
1. Attach you SeeedStudio Motor Shield to your Arduino UNO
2. Load up the Arduino application on any computer and upload this code to you Arduino UNO.
  * NOTE: I used a COMMON ANODE LED STRIP which had build-in resistors. Please look up how to connect your LED STRIP to your Arduino, before you attempt doing what the schematic says. If you will be using COMMON CATHODE LEDs, you will need to open the Arduino code and comment out the line that contains:
```C++
#define COMMON_ANODE
```

### Wiring
Please refer to the following schematic to wire everything up:
![](RaspberryPiArduinoControl/Wiring%20Schematics_bb.png)

NOTE: I used a COMMON ANODE LED STRIP which had build-in resistors. Please look up how to connect your LED STRIP to your Arduino, before you attempt doing what the schematic says. If you will be using COMMON CATHODE LEDs, you will need to open the Arduino code and comment out the line that contains:
```C++
#define COMMON_ANODE
```

### Vehicle
You may use any design you like, just as long as you are sure that you can properly mount all of the hardware.

##Running the app
After the setup is completed, open the Alexa Skill and type in your session ID. Once all is good, you can try asking alexa to "change lights to green". After Alexa process your request, she should send you a reply and the lights should be green.

