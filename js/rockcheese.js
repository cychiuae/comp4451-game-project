function Rockcheese() {
	/********** Graphics **********/
	var cheeseMaterial = new THREE.MeshPhongMaterial({
		map: THREE.ImageUtils.loadTexture('images/rockCheese.jpg')
	});
	cheeseMaterial.map.wrapS = cheeseMaterial.map.wrapT = THREE.RepeatWrapping;
	cheeseMaterial.map.repeat.set(1.2, 0.5);
	this.body = new Physijs.CylinderMesh(
		new THREE.CylinderGeometry(3, 3, 3, 3),
		cheeseMaterial,
		170
	);

	this.body.position.set(
		45 - Math.random() * 90,
		25, 
		45 - Math.random() * 90
	);
	/********** Graphics **********/
}