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
	//Arena
	game.arena = new Arena();
	game.scene.add(game.arena.body);
	
	//Cheese
	game.numberOfCheese = 20;
	game.cheeses = [];

	//Mouse
	game.mousePlayer = playerNum;
	game.mouses = [];

	//House
	game.houses = [];
	
	//Sound
	game.bgm = new Audio("sounds/bgm.mp3");
	game.winSound = new Audio("sounds/win.mp3");

	//Level
	game.currentLevel = new Level();
	game.currentLevel.levelID = levelMode;
	game.currentLevel.changeLevelContent();
	game.scene.add(game.currentLevel.body);

	game.generateMouseAndHouse();
	/********** Game nodes *********/

	game.scene.simulate();
	game.start();
};

game.generateMouseAndHouse = function() {
	for(var i = 0; i < 4; i++) {
		var mouse, house;

		switch (i) {
			case 0:
				mouse = new Mouse(0xffa54f);
				house = new House(0xffa54f);
				mouse.body.position.set(0, 15, -30);
				mouse.resetPositionVector.set(0, 15, -40);
				mouse.body.position.z = -40;
				house.body.position.set(0, 10, -57.5);
				break;
			case 1:
				mouse = new Mouse(0xb4eeb4);
				house = new House(0xb4eeb4);
				mouse.body.position.set(-30, 15, 0);
				mouse.resetPositionVector.set(-40, 15, 0);
				mouse.resetFacingAngle = Math.PI * 0.5;
				mouse.body.rotation.y = Math.PI * 0.5;
				house.body.position.set(-57.5, 10, 0);
				break;
			case 2:
				mouse = new Mouse(0x57104d);
				house = new House(0x57104d);
				mouse.body.position.set(0, 15, 30);
				mouse.resetPositionVector.set(0, 15, 40);
				mouse.resetFacingAngle = Math.PI;
				mouse.body.rotation.y = Math.PI;
				house.body.position.set(0, 10, 57.5);
				break;
			case 3:
				mouse = new Mouse(0x6897bb);
				house = new House(0x6897bb);
				mouse.body.position.set(30, 15, 0);
				mouse.resetPositionVector.set(40, 15, 0);
				mouse.resetFacingAngle = Math.PI * 1.5;
				mouse.body.rotation.y = Math.PI * 1.5;
				house.body.position.set(57.5, 10, 0);
				break;
			default:
				;
		}

		mouse.mouseID = house.houseID = i;

		if(i >= game.mousePlayer) {
			mouse.isComputer = true;
		}

		game.mouses.push(mouse);
		game.scene.add(mouse.body);
		game.houses.push(house);
		game.scene.add(house.body);
	}
}

game.randomGenerateCheese = function() {
	var delta = ~~(new Date().valueOf() / 1000) - game.currentLevel.currentTime;
	if(delta == 1) {
		var numberOfCheese = parseInt(Math.random() * 2 + 1);
		for(var i = 0; i < numberOfCheese; i++) {
			var cheese = new Cheese();
			cheese.body.isExist = true;
			game.cheeses.push(cheese.body);
			game.scene.add(cheese.body);
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

	for(var i = 0; i < 4; i++) {
	 	game.mouses[i].update();
	 	if(game.mouses[i].isComputer) {
	 		if(i > 1) {
	 			game.mouses[i].aiFindClosestPlayer();
	 		}
			
			if(game.mouses[i].numberOfCheese >= 2) {
				game.mouses[i].aiFindHouse();
			}
			else {
				game.mouses[i].rotate();
				game.mouses[i].aiFindClosestCheese();
			}
		}
	}

	for(var i = 0; i < game.cheeses.length; i++) {
	 	game.cheeses[i].update();
	}

	for(var i = 0; i < 4; i++) {
	 	game.houses[i].rotateText();
	}

	game.userUpdate();
	
	if(game.currentLevel.levelID < 2) {
		game.currentLevel.countDown();
	};
	
	game.currentLevel.checkWin();
};

game.draw = function() {
	if(KEY.pause == -1) {
		game.isPause = !game.isPause;
	}

	if(!game.isPause) {
		if(game.currentLevel.levelID < 2) {
			game.randomGenerateCheese();
		};
		game.update();
		game.renderer.render(game.scene, game.camera);
		//render_stats.update();
	}

	KEY.pause = 0;

	game.id = window.requestAnimationFrame(game.draw);
};

game.start = function() {
	game.isStart = true;
	game.bgm.play();
	game.currentLevel.currentTime = ~~(new Date().valueOf() / 1000);
	document.getElementById("info").innerHTML = game.currentLevel.levelString;
    game.draw();
}

game.finish = function() {
	game.bgm.load();
	game.isStart = false;
	document.getElementById("canvas").style.display = "none";
	if(game.winEnd != -1) {
		console.log(game.winEnd);
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
		game.winSound.load();
	} else if (game.drawEnd){
		document.getElementById("draw").style.display = null;
	}

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