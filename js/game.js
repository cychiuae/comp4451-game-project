var WIDTH = 640;
var HEIGHT = 480;

var renderer, scene, camera;
var mouse;

function gameInit() {
	setup();
	requestAnimationFrame(updateAndRender);
}

function setup() {
	scene = new Physijs.Scene;
	scene.setGravity(new THREE.Vector3( 0, -30, 0 ));

	camera = new THREE.PerspectiveCamera(75, WIDTH/HEIGHT, 0.1, 500);
	//scene.add(camera);

	var plane = new Physijs.BoxMesh(
		new THREE.CubeGeometry(500, 10, 500),
		new THREE.MeshBasicMaterial({
			color: 0x123456
		})
	);
	scene.add(plane);

	mouse = new Physijs.BoxMesh(
		new THREE.CubeGeometry(10, 10, 10),
		new THREE.MeshBasicMaterial({
			color: 0x654211
		})
	);	
	mouse.position.y = 20;
    mouse.add(camera);
	camera.position.set(0, 10, 20);
	camera.lookAt(new THREE.Vector3(0, -5, -5));

	scene.add(mouse);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	document.body.appendChild(renderer.domElement);
	scene.simulate();
}

function updateMouse() {
	if(KEY_STATUS.left) {
		mouse.rotation.y += 0.1;
	}
	if(KEY_STATUS.right) {
		mouse.rotation.y -= 0.1;
	}
	if(KEY_STATUS.up) {
		mouse.position.z -= 2 * Math.cos(mouse.rotation.y);
		mouse.position.x -= 2 * Math.sin(mouse.rotation.y);
	}
	if(KEY_STATUS.down) {
		mouse.position.z += 2 * Math.cos(mouse.rotation.y);
		mouse.position.x += 2 * Math.sin(mouse.rotation.y);
	}
	if(KEY_STATUS.space) {
		mouse.applyCentralImpulse(new THREE.Vector3(0,1110,0));
	}
}

function updateAndRender() {
	updateMouse();
	renderer.render(scene, camera);
	requestAnimationFrame(updateAndRender);
}