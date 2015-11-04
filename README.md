# FORMation

FORMation is scripting platform for prototyping with the shape displays of the Tangible Media Group, MIT Media Lab. 
It was conceived by [Xiao Xiao](https://github.com/xiaosquared) and [Donald Derek](https://github.com/DonaldDerek) as a tool to quickly make shapes and movements with the shape display. FORMation was developed in collaboration with [Zack Uhlenhuth](https://github.com/ZackUhlenhuth) and makes use of the following JavaScript libraries:
* [3js](http://threejs.org/)
* [Ace editor](https://ace.c9.io/)
* [Dat.gui](https://code.google.com/p/dat-gui/)

## How to Run
In a terminal:
``` 
git clone https://github.com/xiaosquared/FORMation.git && cd FORMation
python -m SimpleHTTPServer 8000
```
In a browser, go to localhost:8000/cooperform.html or localhost:8000/cooperform.html

Keyboard controls:
* _Ctrm-m_: opens and closes the browser
* _Enter_: run the current script
* _Space_: pause
* _d_: clear

__For MAS.834 students__: FORMation has functionality to interface with the physical shape displays when its corresponding program is running on the shape display computers. Speak to Xiao Xiao if you would like to do that.

## Scripting the Shape Display

xForm is the name of the virtual shape display. Each pin is addessed by its x, y position where 0, 0 is the top left corner. Heights are decimal values from 0 to 1.

### Basic Functions
Set pin at position x, y to ht
```
xForm.setPinHeight(x, y, h);
```

Set all pins to a height:
```
xForm.clearDisplay(h)
```

### Examples
The /examples folder has some sample scripts. To run, paste the code into the FORMation editor. Current examples:
* __pong.js:__ 
  * A physical pong game where the shape display moves around a real ball, with paddles controlled via the keyboard. 
  * Example of how to use Box feature to render boxes and detect collision between them


