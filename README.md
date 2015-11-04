# FORMation

FORMation is scripting platform for prototyping with the shape displays of the Tangible Media Group, MIT Media Lab. 
It was conceived by [Xiao Xiao](https://github.com/xiaosquared) and [Donald Derek](https://github.com/DonaldDerek) as a tool to quickly make shapes and movements with the shape display. FORMation was developed in collaboration with [Zack Uhlenhuth](https://github.com/ZackUhlenhuth) and makes use of the following JavaScript libraries:
* [3js](http://threejs.org/)
* [Ace editor](https://ace.c9.io/)
* [Dat.gui](https://code.google.com/p/dat-gui/)

## How to Run
1. In a terminal:
``` 
git clone https://github.com/xiaosquared/FORMation.git && cd FORMation
python -m SimpleHTTPServer 8000
```
2. In a browser, go to localhost:8000/cooperform.html or localhost:8000/cooperform.html

3. Keyboard controls:
* Ctrm-m: opens and closes the browser
* Enter: run the current script
* Space: pause
* d: clear

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
The /examples folder has some sample scripts. To run, paste the code into the FORMation editor.


