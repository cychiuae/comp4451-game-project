Physijs.scripts.worker = 'js/lib/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js'

var game = new Object;
var render_stats, physics_stats;

game.init = function(playerNum, levelMode) {
	/*********** Game constant **********/
	game.WIDTH = 640;
	game.HEIGHT = 480;
	game.id = 0;
	/*********** Game constant **********/

	/********** Renderer *********/
	game.renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	game.renderer.setSize(game.WIDTH, game.HEIGHT);
	game.renderer.setClearColor(0xffffff, 1);
	document.getElementById('canvas').appendChild(game.renderer.domElement);
	/********** Renderer *********/

	//Level
	game.currentLevel = new Level();
	game.currentLevel.levelID = levelMode;

	/********** Background *********/
	var imgSrc = 'images/space.jpg';
	if(game.currentLevel.levelID == 2) {
		imgSrc = 'images/hell.jpg';
	}
	game.background = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(2, 2, 0),
		new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture(imgSrc)
		})
	);

	game.background.material.depthTest = false;
	game.background.material.depthWrite = false;

	game.backgroundScene = new THREE.Scene();
	game.backgroundCamera = new THREE.Camera();
	game.backgroundScene.add(game.backgroundCamera);
	game.backgroundScene.add(game.background);
	/********** Background *********/

	/********** FPS Stat *********/
	// render_stats = new Stats();
	// render_stats.domElement.style.position = 'absolute';
	// render_stats.domElement.style.top = '0px';
	// render_stats.domElement.style.zIndex = 100;
	// document.getElementById('canvas').appendChild( render_stats.domElement );
	
	// physics_stats = new Stats();
	// physics_stats.domElement.style.position = 'absolute';
	// physics_stats.domElement.style.top = '50px';
	// physics_stats.domElement.style.zIndex = 100;
	// document.getElementById('canvas').appendChild( physics_stats.domElement );
	/********** FPS Stat *********/

	/********** Scene *********/
	game.scene = new Physijs.Scene({
		fixedTimeStep: 1 / 60
	});
	game.scene.setGravity(new THREE.Vector3(0, -30, 0));
	game.scene.addEventListener(
		'update',
		function() {
			game.scene.simulate(undefined, 2);
			//physics_stats.update();
		}
	);
	/********** Scene *********/

	/********** Game Environment *********/
	game.isStart = false;
	game.isPause = false;
	game.winEnd = -1;
	game.drawEnd = false;
	/********** Game Environment *********/

	/********** Camera *********/
	game.camera = new THREE.PerspectiveCamera(60, game.WIDTH / game.HEIGHT, 1, 500);
	game.camera.position.set(0, 70, -75);
	game.camera.lookAt(game.scene.position);
	game.scene.add(game.camera);
	/********** Camera *********/

	/********** Light *********/
	var light = new THREE.DirectionalLight(0xffffff);
	light.position.set(20, 40, -15);
	game.scene.add(light);

	var light = new THREE.AmbientLight(0x404040); 
	game.scene.add(light);
	/********** Light *********/

	/********** Game nodes *********/
	//Clock
	game.clock = new THREE.Clock(game.isStart);

	//Arena
	game.arena = new Arena();
	game.scene.add(game.arena.body);
	
	//Cheese
	game.normalCheeses = [];
	game.toxicCheeses = [];
	game.rockCheeses = [];

	//Mouse
	game.mousePlayer = playerNum;
	game.mouses = [];

	//House
	game.houses = [];

	//Sound
	game.bgm;
	game.winSound = new Audio("sounds/win.mp3");
	game.drawSound = new Audio("sounds/draw.mp3");

	game.scene.add(game.currentLevel.body);
	
	game.generateMouse();
	if(game.currentLevel.levelID != 2) {
		game.generateHouse();
	}
	/********** Game nodes *********/

	game.scene.simulate();
	game.start();
};

game.generateMouse = function() {
	for(var i = 0; i < 4; i++) {
		var mouse;

		switch (i) {
			case 0:
				mouse = new Mouse(0xffa54f);
				mouse.body.position.set(0, 15, -30);
				mouse.resetPositionVector.set(0, 15, -40);
				mouse.body.position.z = -40;
				break;
			case 1:
				mouse = new Mouse(0xb4eeb4);
				mouse.body.position.set(-30, 15, 0);
				mouse.resetPositionVector.set(-40, 15, 0);
				mouse.resetFacingAngle = Math.PI * 0.5;
				mouse.body.rotation.y = Math.PI * 0.5;
				break;
			case 2:
				mouse = new Mouse(0x57104d);
				mouse.body.position.set(0, 15, 30);
				mouse.resetPositionVector.set(0, 15, 40);
				mouse.resetFacingAngle = Math.PI;
				mouse.body.rotation.y = Math.PI;
				break;
			case 3:
				mouse = new Mouse(0x6897bb);
				mouse.body.position.set(30, 15, 0);
				mouse.resetPositionVector.set(40, 15, 0);
				mouse.resetFacingAngle = Math.PI * 1.5;
				mouse.body.rotation.y = Math.PI * 1.5;
				break;
			default:
				;
		}

		mouse.mouseID = i;

		if(i >= game.mousePlayer) {
			mouse.isComputer = true;
		}

		game.mouses.push(mouse);
		game.scene.add(mouse.body);
	}
}

game.generateHouse = function() {
	for(var i = 0; i < 4; i++) {
		var house;

		switch (i) {
			case 0:
				house = new House(0xffa54f);
				house.body.position.set(0, 10, -57.5);
				break;
			case 1:
				house = new House(0xb4eeb4);
				house.body.position.set(-57.5, 10, 0);
				break;
			case 2:
				house = new House(0x57104d);
				house.body.position.set(0, 10, 57.5);
				break;
			case 3:
				house = new House(0x6897bb);
				house.body.position.set(57.5, 10, 0);
				break;
			default:
				;
		}

		house.houseID = i;

		game.houses.push(house);
		game.scene.add(house.body);
	}
}

game.randomGenerateNormalCheese = function() {
	if((~~(game.clock.getElapsedTime() * 100)) % 110 == 0) {
		var numberOfCheese = parseInt(Math.random() * 2.5);
		for(var i = 0; i < numberOfCheese; i++) {
			var normalCheese = new Normalcheese();
			normalCheese.body.isExist = true;
			game.normalCheeses.push(normalCheese.body);
			game.scene.add(normalCheese.body);
		}		
	}
};

game.randomGenerateToxicCheese = function() {
	if((~~(game.clock.getElapsedTime() * 100)) % 190 == 0) {
		var numberOfCheese = parseInt(Math.random() * 2);
		for(var i = 0; i < numberOfCheese; i++) {
			var toxicCheese = new Toxiccheese();
			game.toxicCheeses.push(toxicCheese.body);
			game.scene.add(toxicCheese.body);
		}		
	}
};

game.randomGenerateRockCheese = function() {
	if((~~(game.clock.getElapsedTime() * 100)) % 230 == 0) {
		var numberOfCheese = parseInt(Math.random() * 1.7);
		for(var i = 0; i < numberOfCheese; i++) {
			var rockCheese = new Rockcheese();
			game.rockCheeses.push(rockCheese.body);
			game.scene.add(rockCheese.body);
		}		
	}
};

game.userUpdate = function() {
	if((KEY.mouse1 == 1) && (game.mouses[0].isComputer == false)) {
		game.mouses[0].applyForce(70);
	} 
	else if(KEY.mouse1 == -1) {
		game.mouses[0].reverse();
		KEY.mouse1 = 0;
	} 
	else {
		game.mouses[0].rotate();
	}

	if((KEY.mouse2 == 1) && (game.mouses[1].isComputer == false)) {
		game.mouses[1].applyForce(70);
	} 
	else if(KEY.mouse2 == -1) {
		game.mouses[1].reverse();
		KEY.mouse2 = 0;
	} 
	else {
		game.mouses[1].rotate();
	}

	if((KEY.mouse3 == 1) && (game.mouses[2].isComputer == false)) {
		game.mouses[2].applyForce(70);
	} 
	else if(KEY.mouse3 == -1) {
		game.mouses[2].reverse();
		KEY.mouse3 = 0;
	} 
	else {
		game.mouses[2].rotate();
	}

	if((KEY.mouse4 == 1) && (game.mouses[3].isComputer == false)) {
		game.mouses[3].applyForce(70);
	} 
	else if(KEY.mouse4 == -1) {
		game.mouses[3].reverse();
		KEY.mouse4 = 0;
	} 
	else {
		game.mouses[3].rotate();
	}
}

game.update = function() {
	if((game.winEnd != -1) || (game.drawEnd)) {
		game.finish();
	}

	if(game.currentLevel.levelID != 2) {
		for(var i = 0; i < 4; i++) {
		 	game.mouses[i].update();
		 	if(game.mouses[i].isComputer) {
		 		if((game.mouses[0].numberOfCheese > 3) || (game.houses[0].numberOfCheese > 6)) {
		 			game.mouses[i].aiFindClosestPlayer();
		 		}

				if(game.mouses[i].numberOfCheese >= 2) {
					game.mouses[i].aiFindHouse();
				} else {
					game.mouses[i].rotate();
					game.mouses[i].aiFindClosestCheese();
				}
			}
		}

		for(var i = 0; i < 4; i++) {
		 	game.houses[i].rotateText();
		}
		game.currentLevel.countDown();
	} else {
		for(var i = 0; i < 4; i++) {
		 	game.mouses[i].update();
		 	if(game.mouses[i].isComputer) {
		 		game.mouses[i].aiFindClosestPlayer();
		 	}
		 	game.mouses[i].removeText();
		}
	}

	for(var i = 0; i < game.normalCheeses.length; i++) {
	 	game.normalCheeses[i].update();
	}

	game.userUpdate();
	
	game.currentLevel.checkWin();
};

game.draw = function() {
	if(KEY.pause == -1) {
		game.isPause = !game.isPause;
	}

	if(!game.isPause) {
		if(game.currentLevel.levelID < 2) {
			game.randomGenerateNormalCheese();
			game.randomGenerateRockCheese();
		};
		game.randomGenerateToxicCheese();
		game.update();
        game.renderer.autoClear = false;
        game.renderer.clear();
        game.renderer.render(game.backgroundScene, game.backgroundCamera);
		game.renderer.render(game.scene, game.camera);
		//render_stats.update();
	}

	KEY.pause = 0;

	game.id = window.requestAnimationFrame(game.draw);
};

game.start = function() {
	game.currentLevel.changeLevelContent();
	game.bgm.load();
	game.isStart = true;
	game.bgm.play();
	game.clock.start();
	document.getElementById("info").innerHTML = game.currentLevel.levelString;
	document.getElementById("top").innerHTML = game.currentLevel.levelString;
    game.draw();
}

game.finish = function() {
	game.bgm.load();
	game.bgm = null;
	game.winSound.load();
	game.drawSound.load();
	game.isStart = false;
	document.getElementById("canvas").style.display = "none";
	if(game.winEnd != -1) {
		switch (game.winEnd) {
			case 0:
				document.getElementById("win1").style.display = null;
				break;
			case 1:
				document.getElementById("win2").style.display = null;
				break;
			case 2:
				document.getElementById("win3").style.display = null;
				break;
			case 3:
				document.getElementById("win4").style.display = null;
				break;
			default:
				document.getElementById("win").style.display = null;
		}
		game.winSound.play();
	} else if (game.drawEnd){
		document.getElementById("draw").style.display = null;
		game.drawSound.play();
	}
	game.terminate();
}

/*
game.winSound.onended = function() {
	game.terminate();
}

game.drawSound.onended = function() {
	game.terminate();
}*/

game.terminate = function() {
	var list = document.getElementById('canvas');
	list.innerHTML = "";

	window.cancelAnimationFrame(game.id);
	game.id = undefined;
	end();
}

var end = function() {
	game = null;
}

window.requestAnimFrame = function() {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
}();