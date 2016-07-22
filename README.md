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
You will need the following materials for both of the installation methods:
* A set up Raspberry Pi Model B (2 or 3) with Raspbian Jessie installed.
* Internet connection
* Arduino Uno
* SeeedStudio Motor Shield for Arduino
* 1 4AA Battery Pack
* 1 8AA Battery Pack
* Hookup Wire
* DC Motor (I used an old K'nex motor)
* Servo
* Portable Smartphone Charger (This is optional and is only used to power the Raspberry Pi)
* A way to talk to Alexa (Seperate Raspberry Pi, Echo. ect.)
* A way to access the Alexa Mobile App

## Installation
### Raspberry Pi
1: Download this bash file and put into your Raspberry Pi's home directory: 
```
/home/pi
```
2: Make it executable:
```
sudo chmod 777 raspberryCarInstall.sh
```
3: Run the script:
```
sudo ./raspberryCarInstall.sh
```
That's it! After your Raspberry Pi reboots, it will prompt you for your usage key and remind you to plug in both your Arduino and your Servo.

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

