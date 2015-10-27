function InputManager() {
    this.touchThresh = 0;
    this.prevTouchHandler;
    this.HOLDING_TIMEOUT = 300;
    this.HEIGHT_CHANGE_TIMEOUT = 700;
    this.INITIAL_TIMEOUT = 7000;
    this.lastSendHeightsTime = performance.now();

    this.initTouchHandler = function(pins, width, height) {
        //console.log("TOUCH!!");

        // ignore the broken pins that are always down
        if (pins.length > this.touchThresh) {
            touchHandler = new TouchHandler(width, height);
            for (var i = 0; i < pins.length; i++) {
                pins[i] = pins[i].split(",");
                var x = pins[i][0] - 0;
                var y = pins[i][1] - 0;

                console.log("Touch x, y ", x, y);

                // get rid of pins that are broken
                if (!(y == 3 && x < 6)
                && !(x == 0 && y == 14)
                && !(x == 14 && y == 14)
                && !(x == 9 && y == 15)
                && !(x == 11 && y == 15)
                && !(x == 18 && y == 15)
                && !(x == 20 && y == 15)
                && !(x == 21 && y == 15)
                && !(x == 22 && y == 15)
                && !(x == 6 && y==17)
                && !(x == 7 && y == 17)
                && !(x == 21 && y == 17)
                && !(x == 20 && y == 18)
                && !(x == 11 && y == 20)
                && !(x == 15 && y == 20)
                && !(x == 6 && y == 23)
                && !(x == 9 && y == 23)
                && !(x == 12 && y == 23)
                && !(x == 23 && y == 23))
                {
                    touchHandler.addPin(x, y);
                }
            }
            return touchHandler;
        }
    }

    // wraps dealing with touches from physical shape display!
    this.reactToTouchInput = function(newTouchHandler) {
        // first figure out what type of touch
        var touchType = this.getTouchType(newTouchHandler);

        // Printout for debugging
        if (touchType != TOUCH_TYPES.NONE)
            console.log("Type: " + touchType.name);

        // moving the camera
        if (touchType == TOUCH_TYPES.CAMERA_TO &&
            (performance.now() - this.lastSendHeightsTime > this.HEIGHT_CHANGE_TIMEOUT)) {
            console.log("GO TO AVATAR");
            xForm.container.visible = true;
            player.goToBkgAvatarView();
            var mx = touchHandler.getNewPinsX();
            var my = touchHandler.getNewPinsY();
            player.moveToSquare(mx, my, xForm)
            socket.send("M"+mx+","+my);
        }

        // Shifting the level
        else if (touchType.value < 4) {
            //If we are in avatar view, first get out of it
            if (player.inAvatarView()) {
                if (!device) {
                    socket.send("VM");
                    player.goToBkgView();
                }
                return;
            }

            if (touchType == TOUCH_TYPES.LEFT) {
                e14.origin.x ++;
            }
            else if (touchType == TOUCH_TYPES.RIGHT) {
                e14.origin.x --;
            }
            else if (touchType == TOUCH_TYPES.TOP) {
                e14.origin.y ++;
            }
            else if (touchType == TOUCH_TYPES.BOTTOM) {
                e14.origin.y --;
            }

            e14.loadCurrentLevelForAllDisplays(true, true);

            // if it's the background screen
            if (!device) {
                socket.send("VM");
                this.lastSendHeightsTime = performance.now();
                socket.send("O"+ e14.origin.x +","+e14.origin.y);
                socket.send("P"+xFormMini.getHeightsMsgForPhysical());
            }
        }
    }

    // figures out types of touch
    this.getTouchType = function(newTouchHandler) {
        var touchType = newTouchHandler.getTouchType();

        // if there isn't an existing touch handler
        // just return the touchType of the new handler
        if (!this.prevTouchHandler) {
            this.prevTouchHandler = newTouchHandler;
            return touchType;
        }

        // if previous is for moving around, and current one is camera
        // make sure we are past the timeout
        if (this.prevTouchHandler.getTouchType().value < 4 && touchType.value == 4
            && newTouchHandler.touchTime - this.prevTouchHandler.touchTime < this.HEIGHT_CHANGE_TIMEOUT)
             return TOUCH_TYPES.NONE;

        // Otherwise, if current is different from previous,
        if (touchType != this.prevTouchHandler.getTouchType()) {
            this.prevTouchHandler = newTouchHandler;
            return touchType;
        }
        // If it's the same type as previous
        else {
            // and it's one of the navigational controls (left, right, top, bottom)
            // check how much time has passed in between
            if (touchType.value < 4) {
                if (newTouchHandler.touchTime - this.prevTouchHandler.touchTime > this.HOLDING_TIMEOUT) {
                    this.prevTouchHandler = newTouchHandler;
                    return touchType;
                }
            }
            // and it's for moving the camera
            else if (touchType.value == 4) {
                newTouchHandler.getNewPins(this.prevTouchHandler);
                if (newTouchHandler.newPins.length != 0) {
                    this.prevTouchHandler = newTouchHandler;
                    return TOUCH_TYPES.CAMERA_TO;
                }
            }
            return TOUCH_TYPES.NONE;
        }
    }
}

var TOUCH_TYPES = {
    LEFT : {value: 0, name: "Left"},
    RIGHT : {value: 1, name: "Right"},
    TOP : {value: 2, name: "Top"},
    BOTTOM : {value: 3, name: "Bottom"},
    CAMERA_TO : {value: 4, name: "Camera To"},
    NONE: {value: 5, name: "No Touch"},
    OTHER: {value: 6, name: "Other"}
}

function TouchHandler(displayWidth, displayHeight) {
    this.displayWidth = displayWidth;
    this.displayHeight = displayHeight;
    this.touchedX = [];
    this.touchedY = [];
    this.touchTime = performance.now();;
    this.touchType;
    this.newPins = [];
    this.addPin = function(x, y) {
        // We don't care about the broken pins that are always down
        if (!(y == 3 && x < 6)) {
            this.touchedX.push(x);
            this.touchedY.push(y);
        }
    }
    this.getTouchType = function() {
        // if we already figured out what type of touch it is, return that
        if (this.touchType != null)
            return this.touchType;

            console.log("how many pins touched " + this.touchedX.length);

        // else, figure it out and save it
        if (this.touchedX.length == 0)
            this.touchType = TOUCH_TYPES.NONE;
        else {
            xSum = this.touchedX.reduce(function(a, b) {
                return a + b;
            });
            ySum = this.touchedY.reduce(function(a, b) {
                return a + b;
            });

            if (xSum == 0)
                this.touchType = TOUCH_TYPES.LEFT;
            else if (xSum/this.touchedX.length == this.displayWidth-1)
                this.touchType = TOUCH_TYPES.RIGHT;
            else if (ySum == 0)
                this.touchType = TOUCH_TYPES.TOP;
            else if (ySum/this.touchedY.length == this.displayHeight-1)
                this.touchType = TOUCH_TYPES.BOTTOM;
            else
                this.touchType = TOUCH_TYPES.CAMERA_TO;
        }
        return this.touchType;
    }

    // Returns the indices of pins in this that aren't in prevHandler
    this.getNewPins = function(prevHandler) {
        for (var i = 0; i < this.touchedX.length; i ++) {
            if (prevHandler.touchedX.indexOf(touchHandler.touchedX[i]) < 0 ||
                prevHandler.touchedY.indexOf(touchHandler.touchedY[i]) < 0 ) {
                this.newPins.push(i);
            }
        }
        return this.newPins;
    }

    this.getNewPinsX = function() {
        var newPins = this.newPins;
        if (this.newPins.length == 0)
            return this.touchedX;
        return this.touchedX.filter(function(elt, i) {
            //console.log("huh " + this.newPins);
            return newPins.indexOf(i) >= 0;
        });
    }

    this.getNewPinsY = function() {
        var newPins = this.newPins;
        if (this.newPins.length == 0)
            return this.touchedY;
        return this.touchedY.filter(function(elt, i) {
            return newPins.indexOf(i) >= 0;
        });
    }

}
