//  Arduino Control for Raspberry Pi Voice Controlled Car
//  Author: Austin Wilson

#include "MotorDriver.h"

MotorDriver motor;

char ser;
int greenPin = 3;
int redPin = 5;
int bluePin = 6;

#define COMMON_ANODE

void setup(){
  pinMode(greenPin, OUTPUT);
  pinMode(redPin, OUTPUT);
  pinMode(bluePin, OUTPUT);  
  motor.begin();
  Serial.begin(9600);
  setColor(0, 0, 0);
}

void loop(){
  if (Serial.available()) {
    ser = Serial.read();
    Serial.print(ser);
    if(ser == '0' || ser == '1') {
      motorDirection(ser);
    } else if(ser == '2' || ser == '3' || ser == '4' || ser == '5' || ser == '6') {
      carColor(ser);
    } else if(ser == '7') {
      motorStop();
    } else {
    }
    
  }
  delay(500);
}

void motorDirection(char dir)
{ 
  if(dir == '0') {
    motor.speed(0, 100);            // set motor0 forward
    motor.speed(1, 100);           // set motor1 forward
  } else if(dir == '1') {
    motor.speed(0, -100);            // set motor0 backward
    motor.speed(1, -100);           // set motor1 backward
  } else {
    Serial.print("Error Reading direction");
  }
}

void carColor(char col) {
  if(col == '2') {
    setColor(0, 255, 0);            // set lights to green
  } else if(col == '3') {
    setColor(255, 0, 0);            // set lights to red
  } else if(col == '4') {
    setColor(0, 0, 255);            // set lights to blue
  } else if(col == '5') {
    setColor(255, 153, 0);            // set lights to orange
  } else if(col == '6') {
    setColor(255, 255, 0);            // set lights to yellow
  } else {
    Serial.print("Error Reading color");
  }
}

void setColor(int red, int green, int blue)
{
  #ifdef COMMON_ANODE
    red = 255 - red;
    green = 255 - green;
    blue = 255 - blue;
  #endif
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);  
}

void motorStop()
{ 
  motor.brake(0);
  motor.brake(1);
}
