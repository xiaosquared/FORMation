/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.FirstPersonControls = function ( object, socket, camera ) {

	var latitude = 0,
		longitude = 0,
		phi = 0,
		theta = 0,
		mouseX = 0,
		mouseY = 0,
		movingForward = false,
		movingBackward = false,
		movingLeft = false,
		movingRight = false,
		movingUp = false,
		movingDown = false,
		viewHalfWidth = 0,
		viewHalfHeight = 0;

	var yAxis = new THREE.Vector3( 0, 1, 0 );

	this.object = object;
	this.target = new THREE.Vector3( 0, 0, 0 );

	this.domElement = document;

	this.movementSpeed = 25.0;
	this.lookAroundSpeed = 0.25;

	this.lookVertical = true;
	this.autoForward = false;

	this.mouseEnabled = true;

	this.active = true;

	if ( this.domElement !== document ) {

		this.domElement.setAttribute( 'tabindex', -1 );

	}

	//

	this.handleResize = function () {

		if ( this.domElement === document ) {

			viewHalfWidth = window.innerWidth / 2;
			viewHalfHeight = window.innerHeight / 2;

		} else {

			viewHalfWidth = this.domElement.offsetWidth / 2;
			viewHalfHeight = this.domElement.offsetHeight / 2;

		}

	};

	this.onMouseDown = function ( event ) {

		if ( this.domElement !== document ) {

			this.domElement.focus();

		}

		event.preventDefault();
		event.stopPropagation();

		if ( this.mouseEnabled ) {

			switch ( event.button ) {

				case 0: movingForward = true; break;
				case 2: movingBackward = true; break;

			}

		}

	};

	this.onMouseUp = function ( event ) {

		event.preventDefault();
		event.stopPropagation();

		if ( this.mouseEnabled ) {

			switch ( event.button ) {

				case 0: movingForward = false; break;
				case 2: movingBackward = false; break;

			}

		}

	};

	this.onMouseMove = function ( event ) {

		if ( this.domElement === document ) {

			mouseX = event.pageX - viewHalfWidth;
			mouseY = event.pageY - viewHalfHeight;

		} else {

			mouseX = event.pageX - this.domElement.offsetLeft - viewHalfWidth;
			mouseY = event.pageY - this.domElement.offsetTop - viewHalfHeight;

		}

	};

	this.onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ movingForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ movingLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ movingBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ movingRight = true; break;

			case 82: /*R*/ movingUp = true; break;
			case 70: /*F*/ movingDown = true; break;

			case 81: /*Q*/ this.active = !this.active; break;

		}

	};

	this.onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ movingForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ movingLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ movingBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ movingRight = false; break;

			case 82: /*R*/ movingUp = false; break;
			case 70: /*F*/ movingDown = false; break;

		}

	};
	var eul;
	socket.on('rotatePlayer', function(data){
		var quat = new THREE.Quaternion(data._x, data._y, data._z, data._w)
		eul = new THREE.Euler().setFromQuaternion(quat, 'XYZ');

	})
	this.update = function( delta ) {

		if( !this.active) {
			return;
		}

		if(eul){
			camera.rotation.x = eul._x;
			camera.rotation.y = eul._y;
			camera.rotation.z = eul._z;
			this.object.rotateY(eul.y, yAxis);
		}

		var actualMoveSpeed = delta * this.movementSpeed,
			actualLookSpeed = this.mouseEnabled ? delta * this.lookAroundSpeed : 0,
			targetPosition = this.target,
			cameraPosition = this.object.position;

		if( movingForward || ( this.autoForward && !movingBackward) ) {
			if(socket)
				socket.emit('move', {u:actualMoveSpeed});
			this.object.translateZ( -actualMoveSpeed );

		} else if( movingBackward ) {
			if(socket)
				socket.emit('move', {b:actualMoveSpeed});
			this.object.translateZ( actualMoveSpeed );
		}

		if( movingLeft ) {
			if(socket)
				socket.emit('move', {l:actualMoveSpeed});
			this.object.translateX( -actualMoveSpeed );
		} else if( movingRight ) {
			if(socket)
				socket.emit('move', {r:actualMoveSpeed});
			this.object.translateX( actualMoveSpeed );
		}

		if ( movingUp ) {
			this.object.translateY( actualMoveSpeed );
		} else if( movingDown ) {
			this.object.translateY( -actualMoveSpeed );
		}

		longitude += mouseX * actualLookSpeed;
		if( this.lookVertical ) {
			latitude += mouseY * actualLookSpeed;
		}

		latitude = Math.max( - 85, Math.min( 85, latitude ) );
		phi = ( 90 - latitude ) * Math.PI / 180;
		theta = longitude * Math.PI / 180;

		targetPosition.x = cameraPosition.x + 100 * Math.sin( phi ) * Math.cos( theta );
		targetPosition.y = cameraPosition.y + 100 * Math.cos( phi );
		targetPosition.z = cameraPosition.z + 100 * Math.sin( phi ) * Math.sin( theta );

		this.object.lookAt( targetPosition );

	}

	this.getState = function() {
		return {
			longitude: longitude,
			latitude: latitude,
			phi: phi,
			theta: theta,
			//target: this.target,
			camera: this.object
		};
	}


	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
	//this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
	//this.domElement.addEventListener( 'mouseup', bind( this, this.onMouseUp ), false );
	this.domElement.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
	this.domElement.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	this.handleResize();

};
