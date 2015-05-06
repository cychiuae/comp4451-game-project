function Arena() {
	var groundMaterial = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ 
			map: THREE.ImageUtils.loadTexture('images/rocks.jpg'),
		}),
		1, // high friction
		0.2 // low restitution
	);
	groundMaterial.map.wrapS = groundMaterial.map.wrapT = THREE.RepeatWrapping;
	groundMaterial.map.repeat.set(50, 50);

	this.body = new Physijs.CylinderMesh(
		new THREE.CylinderGeometry(50, 50, 10, 100),
		groundMaterial,
		0
	);
	
	this.body.receiveShadow = true;
}