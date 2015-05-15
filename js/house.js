function House(houseColor) {
	/********** Properties **********/
	this.numberOfCheese = 0;
	this.houseID = 0;
	
	this.hitHouseSound = new Audio('sounds/hitHouse.mp3');
	this.hitHouseSound.volume = 0.2;
	this.hitHouseSound.load();
	/********** Properties **********/

	/********** Graphics **********/
	this.body = new Physijs.BoxMesh(
		new THREE.BoxGeometry(15, 7.5, 15),
		new THREE.MeshLambertMaterial({
			color: houseColor
		}),
		0
	);
	this.body.mainPart = this;

	var roof = new THREE.Mesh(
		new THREE.CylinderGeometry(0, 10.5, 10.5, 4),
		new THREE.MeshLambertMaterial({
			color: houseColor
		})
	);
	roof.rotation.y = Math.PI / 4;
	roof.position.set(0, 10, 0);
	this.body.add(roof);
	
	var text3d = new THREE.TextGeometry(
		this.numberOfCheese, {
			size: 10,
			height: 3,
			font: "helvetiker"
		}
	);
	text3d.computeBoundingBox();
	var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );
	var textMaterial = new THREE.MeshLambertMaterial({ 
		color: Math.random() * 0xffffff
	});
	this.text = new THREE.Mesh(
		text3d, 
		textMaterial
	);
	this.text.position.x = centerOffset - 2;
	this.group = new THREE.Group();
	this.group.add(this.text);
	this.group.position.set(0, 15, 0);
	this.body.add(this.group);
	/********** Graphics **********/

	/********** Methods **********/
	this.rotateText = function() {
		this.group.rotation.y += 0.05;
	};

	this.saveCheeses = function(numberOfCheeses) {
		this.numberOfCheese += numberOfCheeses;
		this.changeText(this.numberOfCheese);
	}

	this.changeText = function(text) {
		this.group.remove(this.text);
		this.text = null;
		var text3d = new THREE.TextGeometry(
			text, {
				size: 10,
				height: 3,
				font: "helvetiker"
			}
		);
		text3d.computeBoundingBox();
		var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );
		var textMaterial = new THREE.MeshLambertMaterial({ 
			color: Math.random() * 0xffffff
		});
		this.text = new THREE.Mesh(
			text3d, 
			textMaterial
		);
		this.text.position.x = centerOffset - 2;
		this.group.remove(this.text);
		this.group.add(this.text);
	};

	// Collision Event
	this.hitHouse = function() {
		if(game.mouses[this.houseID].numberOfCheese != 0) {
			this.hitHouseSound.play();
			this.saveCheeses(game.mouses[this.houseID].numberOfCheese);
			// for(var i = game.mouses[this.mainPart.houseID].numberOfCheese; i > 0; i--) {
			// 	game.cheeses.splice(game.mouses[this.mainPart.houseID].indexOfCheese[i - 1], 1);
			// }
			game.mouses[this.houseID].numberOfCheese = 0;
			game.mouses[this.houseID].changeText(0);
		}
	}

	/********** Methods **********/
	
	/********** Constructor **********/
	this.body.addEventListener('collision', function(other_object) {
		if(other_object == game.mouses[this.mainPart.houseID].body) {
			this.mainPart.hitHouse();
		}
	});
	/********** Constructor **********/
}