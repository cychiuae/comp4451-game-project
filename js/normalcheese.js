function Normalcheese() {
	/********** Graphics **********/
	var cheeseMaterial = new THREE.MeshPhongMaterial({
		map: THREE.ImageUtils.loadTexture('images/normalCheese.jpg')
	});
	cheeseMaterial.map.wrapS = cheeseMaterial.map.wrapT = THREE.RepeatWrapping;
	cheeseMaterial.map.repeat.set(1.2, 0.5);
	this.body = new Physijs.CylinderMesh(
		new THREE.CylinderGeometry(3, 3, 3, 3),
		cheeseMaterial
	);

	this.body.isExist = false;

	this.body.position.set(
		45 - Math.random() * 90,
		25, 
		45 - Math.random() * 90
	);
	/********** Graphics **********/

	/********** Methods **********/
	this.body.update = function() {
		if(this.position.y < -20) {
			this.reset();
		}
	};

	this.body.reset = function() {
		this.__dirtyPosition = true;
		this.position.set(
 			45 - Math.random() * 90,
 			8, 
 			45 - Math.random() * 90
 		);
	};
	/********** Methods **********/
}