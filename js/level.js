function Level() {
	/********** Properties **********/
	this.levelTime = -1;
	this.levelID = -1;
	this.numberOfCheeses = -1;
	this.levelString = null;

	this.currentCountTime = -1;
	/********** Properties **********/

	/********** Graphics **********/
	this.body = new Physijs.BoxMesh(
		new THREE.BoxGeometry(15, 7.5, 15),
		new THREE.MeshLambertMaterial({
			color: 0xa9a9a9
		}),
		0
	);
	this.body.mainPart = this;
	
	var text3d = new THREE.TextGeometry(
		this.levelTime, {
			size: 10,
			height: 2,
			font: "helvetiker"
		}
	);
	text3d.computeBoundingBox();
	var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );
	var textMaterial = new THREE.MeshLambertMaterial({ 
		color: 0xffff00
	});
	this.text = new THREE.Mesh(
		text3d, 
		textMaterial
	);
	this.text.position.x = centerOffset - 2;
	this.group = new THREE.Group();
	this.group.add(this.text);
	this.group.position.set(-60, 15, 60);
	this.group.rotation.y += Math.PI;
	this.body.add(this.group);
	/********** Graphics **********/

	/********** Methods **********/
	this.changeLevelContent = function() {
		switch (this.levelID) {
			case 0:
				game.bgm = new Audio("sounds/bgm0.mp3");
				this.levelTime = 60;
				this.currentCountTime = 60;
				this.changeText(this.currentCountTime);
				this.levelString = "Who get the most cheeses wins!!!";
				break;
			case 1:
				game.bgm = new Audio("sounds/bgm1.mp3");
				this.levelTime = 300;
				this.currentCountTime = 300;
				this.changeText(this.currentCountTime);
				this.numberOfCheeses = 20;
				this.levelString = "The first who get " + this.numberOfCheeses + " wins!!!";
				break;
			case 2:
				game.bgm = new Audio("sounds/bgm2.mp3");
				this.changeText("TIME NEVER ENDS           ____");
				this.levelString = "The one who survives wins!!!";
				break;
			default:
				this.levelTime = -1;
				this.levelID = -1;
				this.numberOfCheeses = -1;
				this.levelString = null;
		}
	}

	this.checkWin = function() {
		switch (this.levelID) {
			case 0:
				if(!game.clock.running) {
					var mostCheese = 0;
					var mouseIndex = -1;
					var tie = false;
					for(var i = 0; i < 4; i++) {			
						if(game.houses[i].numberOfCheese > mostCheese) {
							mostCheese = game.houses[i].numberOfCheese;
							mouseIndex = i;
							tie = false;
						} else if (game.houses[i].numberOfCheese == mostCheese) {
							tie = true;
						}
					}

					if(tie) {
						game.drawEnd = true;
					} else {
						game.winEnd = mouseIndex;
					}
				}
				break;
			case 1:
				for(var i = 0; i < 4; i++) {
					if(game.houses[i].numberOfCheese >= this.numberOfCheeses) {
						game.winEnd = i;
					}
				}
				if(!game.clock.running) {
					game.drawEnd = true;
				}
				break;
			case 2:
				var dead = [];
				for(var i = 0; i < 4; i++) {
					if(game.mouses[i].isDead) {
						dead.push(i);
					}
				}
				if(dead.length == 3) {
					for(var i = 0; i < 4; i++) {
						if(dead.indexOf(i) == -1) {
							game.winEnd = i;
							break;
						}
					}
				}
				break;
			default:
				;
		}
	}

	this.changeText = function(text) {
		this.group.remove(this.text);
		this.text = null;
		var text3d = new THREE.TextGeometry(
			text, {
				size: 10,
				height: 2,
				font: "helvetiker"
			}
		);
		text3d.computeBoundingBox();
		var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );
		var textMaterial = new THREE.MeshLambertMaterial({ 
			color: 0xffff00
		});
		this.text = new THREE.Mesh(
			text3d, 
			textMaterial
		);
		this.text.position.x = centerOffset - 2;
		this.group.remove(this.text);
		this.group.add(this.text);
	};

	this.countDown = function() {
		if(!game.isPause) {
			if(game.clock.getElapsedTime() >= this.levelTime) {
				game.clock.stop();
			} else if (~~(this.levelTime - game.clock.getElapsedTime()) != this.currentCountTime){
				this.currentCountTime -= 1;
		        this.changeText(this.currentCountTime);
		    }
		}
	};
	/********** Methods **********/
}