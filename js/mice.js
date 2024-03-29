function Mouse(mouseColor) {
	/********** Properties **********/
	this.turnRight = true;
	this.resetPositionVector = new THREE.Vector3(0, 0, 0);
	this.resetFacingAngle = 0;
	this.mouseID = 0;

	this.numberOfCheese = 0;
	this.indexOfCheese = [];
	
	this.lastHitByOtherMice = -1;
	this.lastHitTime = 0;
	this.isDead = false;

	this.isComputer = false;
	this.forwardCount = 0;

	this.getNormalCheeseSound = new Audio('sounds/getNormalCheese.mp3');
	this.getToxicCheeseSound = new Audio('sounds/getToxicCheese.mp3');
	this.getToxicCheeseSound.volume = 0.3;
	this.getRockCheeseSound = new Audio('sounds/getRockCheese.mp3');
	this.hitMouseSound = new Audio('sounds/hitMouse.mp3');
	this.hitMouseSound.volume = 0.3;
	this.fallSound = new Audio('sounds/fall.mp3');
	this.fallSound.volume = 0.3;
	this.getNormalCheeseSound.load();
	this.getToxicCheeseSound.load();
	this.getRockCheeseSound.load();
	this.hitMouseSound.load();
	this.fallSound.load();
	/********** Properties **********/

	/********** Graphics **********/
	this.body = new Physijs.BoxMesh(
		new THREE.BoxGeometry(1, 1, 1),
		new THREE.MeshLambertMaterial({
			color: mouseColor
		}),
		80
	);
	this.body.position.y = 20;
	this.body.mainPart = this;
	var body = new Physijs.CylinderMesh(
		new THREE.CylinderGeometry(2.5, 2, 5, 100),
		new THREE.MeshLambertMaterial({
			color: mouseColor
		}),
		50
	);
	body.rotation.x = Math.PI / 2;
	this.body.add(body);

	var text3d = new THREE.TextGeometry(
		this.numberOfCheese, {
			size: 3,
			height: 1,
			font: "helvetiker"
		}
	);
	text3d.computeBoundingBox();
	var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );
	var textMaterial = new THREE.MeshLambertMaterial({ 
		color: 0xFFFFFF
	});
	this.text = new THREE.Mesh(
		text3d, 
		textMaterial
	);
	this.text.position.x = centerOffset - 2;
	this.group = new THREE.Group();
	this.group.add(this.text);
	this.group.position.set(2, 10, 0);
	this.body.add(this.group);

	var mousePat = new Physijs.SphereMesh(
		new THREE.SphereGeometry(2.05, 32, 32),
		new THREE.MeshLambertMaterial({
			color: mouseColor
		}),
		50
	);
	mousePat.position.set(0, -2, 0);
	body.add(mousePat);

	var mouseHead = new Physijs.CylinderMesh(
		new THREE.CylinderGeometry(0, 2.5, 4.5, 100),
		new THREE.MeshLambertMaterial({
			color: mouseColor
		}),
		50
	);
	mouseHead.position.set(0, 5.5, 0);
	body.add(mouseHead);

	var mouseLeftEye = new THREE.Mesh(
		new THREE.SphereGeometry(0.5, 32, 32),
		new THREE.MeshLambertMaterial({
			color: 0x000000
		})
	);
	mouseLeftEye.position.set(1, 0.2, -1.5);
	mouseHead.add(mouseLeftEye);

	var mouseRightEye = new THREE.Mesh(
		new THREE.SphereGeometry(0.5, 32, 32),
		new THREE.MeshLambertMaterial({
			color: 0x000000
		})
	);
	mouseRightEye.position.set(-1, 0.2, -1.5);
	mouseHead.add(mouseRightEye);

	var mouseNose = new THREE.Mesh(
		new THREE.SphereGeometry(0.5, 32, 32),
		new THREE.MeshLambertMaterial({
			color: 0x000000
		})
	);
	mouseNose.position.set(0, 2, 0);
	mouseHead.add(mouseNose);

	var material = new THREE.LineBasicMaterial({
		color: 0x000000,
		linewidth: 4
	});

	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3(-3, 1.5, 0),
		new THREE.Vector3(0, 2, 0)
	);

	var line = new THREE.Line(
		geometry,
		material
	);
	mouseHead.add(line);

	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3(3, 1.5, 0),
		new THREE.Vector3(0, 2, 0)
	);

	var line = new THREE.Line(
		geometry,
		material
	);
	mouseHead.add(line);

	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3(2.5, 1, -1.5),
		new THREE.Vector3(0, 2, 0)
	);

	var line = new THREE.Line(
		geometry,
		material
	);
	mouseHead.add(line);

	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3(-2.5, 1, -1.5),
		new THREE.Vector3(0, 2, 0)
	);

	var line = new THREE.Line(
		geometry,
		material
	);
	mouseHead.add(line);

	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3(2.5, 1, 1.5),
		new THREE.Vector3(0, 2, 0)
	);

	var line = new THREE.Line(
		geometry,
		material
	);
	mouseHead.add(line);

	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3(-2.5, 1, 1.5),
		new THREE.Vector3(0, 2, 0)
	);

	var line = new THREE.Line(
		geometry,
		material
	);
	mouseHead.add(line);

	var mouseRightEar = new THREE.Mesh(
		new THREE.CylinderGeometry(0, 0.7, 1.8, 3),
		new THREE.MeshLambertMaterial({
			color: 0xa9a9a9
		})
	);
	
	mouseRightEar.rotation.x = -Math.PI/2;
	mouseRightEar.rotation.z = Math.PI/4;
	mouseRightEar.position.x = -2;
	mouseRightEar.position.y = -1.5;
	mouseRightEar.position.z = -2;
	mouseHead.add(mouseRightEar);

	var mouseLeftEar = new THREE.Mesh(
		new THREE.CylinderGeometry(0, 0.7, 1.8, 3),
		new THREE.MeshLambertMaterial({
			color: 0xa9a9a9
		})
	);
	
	mouseLeftEar.rotation.x = -Math.PI/2;
	mouseLeftEar.rotation.z = -Math.PI/4;
	mouseLeftEar.position.x = 2;
	mouseLeftEar.position.y = -1.5;
	mouseLeftEar.position.z = -2;
	mouseHead.add(mouseLeftEar);

	var mouseLeftLeg = new Physijs.BoxMesh(
		new THREE.BoxGeometry(1, 5, 2),
		new THREE.MeshLambertMaterial({
			color: 0xa9a9a9
		}),
		50
	);
	mouseLeftLeg.position.set(3, 0, 2.5);
	body.add(mouseLeftLeg);

	var mouseLeftLegFront = new Physijs.CylinderMesh(
		new THREE.CylinderGeometry(1, 1, 1, 100),
		new THREE.MeshLambertMaterial({
			color: 0xa9a9a9
		})
	);
	mouseLeftLegFront.position.y = 2.5;
	mouseLeftLegFront.rotation.z = Math.PI / 2;
	mouseLeftLeg.add(mouseLeftLegFront);

	var mouseLeftLegBack = new Physijs.CylinderMesh(
		new THREE.CylinderGeometry(1, 1, 1, 100),
		new THREE.MeshLambertMaterial({
			color: 0xa9a9a9
		})
	);
	mouseLeftLegBack.position.y = -2.5;
	mouseLeftLegBack.rotation.z = Math.PI / 2;
	mouseLeftLeg.add(mouseLeftLegBack);

	var mouseRightLeg = new Physijs.BoxMesh(
		new THREE.BoxGeometry(1, 5, 2),
		new THREE.MeshLambertMaterial({
			color: 0xa9a9a9
		}),
		50
	);
	mouseRightLeg.position.set(-3, 0, 2.5);
	body.add(mouseRightLeg);

	var mouseRightLegFront = new Physijs.CylinderMesh(
		new THREE.CylinderGeometry(1, 1, 1, 100),
		new THREE.MeshLambertMaterial({
			color: 0xa9a9a9
		})
	);
	mouseRightLegFront.position.y = 2.5;
	mouseRightLegFront.rotation.z = Math.PI / 2;
	mouseRightLeg.add(mouseRightLegFront);

	var mouseRightLegBack = new Physijs.CylinderMesh(
		new THREE.CylinderGeometry(1, 1, 1, 100),
		new THREE.MeshLambertMaterial({
			color: 0xa9a9a9
		})
	);
	mouseRightLegBack.position.y = -2.5;
	mouseRightLegBack.rotation.z = Math.PI / 2;
	mouseRightLeg.add(mouseRightLegBack);
	/********** Graphics **********/

	/********** Methods **********/
	this.update = function() {
	    if(this.lastHitTime !== 0) {
	        var countTime = (game.clock.getElapsedTime() / 1000) - this.lastHitTime;
	        if(countTime == 5) {
	        	this.lastHitByOtherMice = -1;
	        	this.lastHitTime = 0;
	        } 
	    }
		if(this.body.position.y < -20) {
			this.isDead = true;
			this.fallSound.play();
			if(game.currentLevel.levelID != 2) {
				this.reset();
			} else {
				this.fallSound.pause();
			}
		}
	};
    
	this.applyForce = function(force) {
		this.body.setAngularVelocity(new THREE.Vector3());

		var localTransform = new THREE.Matrix4();
		localTransform.extractRotation(this.body.matrix);
		var forwardVec = new THREE.Vector3(0, 0, force);
		forwardVec.applyMatrix4(localTransform);
		this.body.applyCentralImpulse(forwardVec);
	};

	this.changeText = function(text) {
		this.group.remove(this.text);
		this.text = null;
		var text3d = new THREE.TextGeometry(
			text, {
				size: 3,
				height: 1,
				font: "helvetiker"
			}
		);
		text3d.computeBoundingBox();
		var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );
		var textMaterial = new THREE.MeshLambertMaterial({ 
			color: 0xFFFFFF
		});
		this.text = new THREE.Mesh(
			text3d, 
			textMaterial
		);
		this.text.position.x = centerOffset - 2;
		this.group.remove(this.text);
		this.group.add(this.text);
	};

	this.reverse = function() {
		this.turnRight = !this.turnRight;
	}

	this.removeText = function() {
		this.group.remove(this.text);
	}

	this.rotate = function() {
		if(this.body.position.y <= 8.7 && this.body.position.y >= 7) {
			if(this.turnRight) {
				this.body.setAngularVelocity(new THREE.Vector3(0, -3, 0));
			}
			else {
				this.body.setAngularVelocity(new THREE.Vector3(0, 3, 0));
			}
			
		}
	};

	this.stealCheese = function(otherMouseID) {
		game.mouses[otherMouseID].numberOfCheese += this.numberOfCheese;
		game.mouses[otherMouseID].changeText(game.mouses[otherMouseID].numberOfCheese);
		game.mouses[otherMouseID].lastHitByOtherMice = -1;
		game.mouses[otherMouseID].lastHitTime = 0;
	}

	this.reset = function() {
	    if(this.lastHitByOtherMice != -1) {
	        this.stealCheese(this.lastHitByOtherMice);
	    }
		this.body.__dirtyPosition = true;
		this.body.setLinearVelocity(new THREE.Vector3(0, 0, 0));
		this.body.position.copy(this.resetPositionVector);

		this.body.__dirtyRotation = true;
		this.body.setAngularVelocity(new THREE.Vector3(0, 0, 0));
		this.body.rotation.set(0, this.resetFacingAngle, 0);

		// for(var i = this.numberOfCheese; i > 0; i--) {
		// 	game.cheeses.splice(this.indexOfCheese[i - 1], 1);
		// }
		this.isDead = false;
		this.numberOfCheese = 0;
		this.changeText(0);
	};

	// AI
	this.aiFindClosestCheese = function() {
		for(var i = 0; i < game.normalCheeses.length; i++) {
			if(game.normalCheeses[i].isExist) {
				myMousePos = new THREE.Vector3(Math.round(this.body.position.x), 6.5, Math.round(this.body.position.z));
				cheesePos = new THREE.Vector3(Math.round(game.normalCheeses[i].position.x), 6.5, Math.round(game.normalCheeses[i].position.z));

				if((myMousePos.distanceTo(cheesePos) < 70) && (game.normalCheeses[i].position.y > 5)) {
					this.body.setAngularVelocity(new THREE.Vector3());

					var minCheesePos = new THREE.Vector3(game.normalCheeses[i].position.x, 6.5, game.normalCheeses[i].position.z);
					var localTransform = new THREE.Matrix4();
					localTransform.extractRotation(this.body.matrix);
					var forwardVec = new THREE.Vector3(0, 0, 1);
					forwardVec.applyMatrix4(localTransform);

					var angle = forwardVec.angleTo(minCheesePos);
					if((angle > 0) && (this.forwardCount < 10) && ((angle < (Math.PI * 0.1)) || (angle > (Math.PI * 1.9)))) {
						this.applyForce(20);
						this.turnRight = !this.turnRight;
						this.forwardCount += 1;
					} else {
						this.forwardCount = 0;
					}
				}
			}
		}
	}

	this.aiFindClosestPlayer = function() {
		for(var i = 0; i < 4; i++) {
			if((game.mouses[i].mouseID != this.mouseID) && (!game.mouses[i].isDead)) {
				myMousePos = new THREE.Vector3(Math.round(this.body.position.x), 6.5, Math.round(this.body.position.z));
				otherMousePos = new THREE.Vector3(Math.round(game.mouses[i].body.position.x), 6.5, Math.round(game.mouses[i].body.position.z));

				if((myMousePos.distanceTo(otherMousePos) < 100) && (game.mouses[i].body.position.y > 5)) {
					this.body.setAngularVelocity(new THREE.Vector3());
					var localTransform = new THREE.Matrix4();
					localTransform.extractRotation(this.body.matrix);
					var forwardVec = new THREE.Vector3(0, 0, 1);
					forwardVec.applyMatrix4(localTransform);

					var angle = forwardVec.angleTo(otherMousePos);

					if((angle > 0) && ((angle < (Math.PI * 0.1)) || (angle > (Math.PI * 1.9)))) {
						console.log(this.mouseID + "chases" + i);
						this.applyForce(20);
						this.turnRight = !this.turnRight;
					}
				}
			}
		}
	}

	this.aiFindHouse = function() {
		this.body.setAngularVelocity(new THREE.Vector3());
		var myhousePos;
		switch (this.mouseID) {
			case 0:
				myhousePos = new THREE.Vector3(0, 6.5, -57.5);
				break;
			case 1:
				myhousePos = new THREE.Vector3(-57.5, 6.5, 0);
				break;
			case 2:
				myhousePos = new THREE.Vector3(0, 6.5, 57.5);
				break;
			case 3:
				myhousePos = new THREE.Vector3(57.5, 6.5, 0);
				break;
			default:
				;
		}
		var localTransform = new THREE.Matrix4();
		localTransform.extractRotation(this.body.matrix);
		var forwardVec = new THREE.Vector3(0, 0, 1);
		forwardVec.applyMatrix4(localTransform);

		var angle = forwardVec.angleTo(myhousePos);
		
		if((angle > 0) && ((angle < (Math.PI * 0.05)) || (angle > (Math.PI * 1.95)))) {
			this.applyForce(120);
			this.turnRight = !this.turnRight;
		} else {
			this.rotate();
		}
	}

	// Collision Event
	this.getNormalCheese = function(normalCheese) {
		this.getNormalCheeseSound.play();
		this.numberOfCheese += 1;
	    this.changeText(this.numberOfCheese);
	    normalCheese.isExist = false;
		game.scene.remove(normalCheese);
	}

	this.getToxicCheese = function(toxicCheese) {
		this.getToxicCheeseSound.play();
		this.applyForce(-3000);
		if(this.numberOfCheese <= 3) {
			this.numberOfCheese = 0;
		} else {
		    this.numberOfCheese -= 3;
		}
	    this.changeText(this.numberOfCheese);
		game.scene.remove(toxicCheese);
	}

	this.getRockCheese = function() {
		this.getRockCheeseSound.play();
	}

	this.hitOtherMouse = function(otherMouseID) {
		this.hitMouseSound.play();
        this.lastHitByOtherMice = otherMouseID;
        this.lastHitTime = (game.clock.getElapsedTime() / 1000);
	}
	/********** Methods **********/

	/********** Constructor **********/
	this.body.addEventListener('collision', function(other_object, linear_velocity, angular_velocity) {
		if(game.normalCheeses.indexOf(other_object) != -1) {
			this.mainPart.getNormalCheese(other_object);
		}
		if(game.toxicCheeses.indexOf(other_object) != -1) {
			this.mainPart.getToxicCheese(other_object);
		}
		if(game.rockCheeses.indexOf(other_object) != -1) {
			this.mainPart.getRockCheese();
		}
		for(var i = 0; i < 4; i++) {
		 	if(this.mainPart.mouseID != i) {
		 		if(game.mouses[i].body == other_object) {
		 			this.mainPart.hitOtherMouse(i);			
		 		}
		 	}
		}
	});
	/********** Constructor **********/
}  