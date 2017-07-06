
var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
	green:0x458248,
	lightgreen:0x629265,
};



var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;


function createScene() {
	// Get the width and height of the screen
	// and use them to setup the aspect ratio
	// of the camera and the size of the renderer.
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	// Create the scene.
	scene = new THREE.Scene();

	// Add FOV Fog effect to the scene. Same colour as the BG int he stylesheet.
	scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

	// Create the camera
	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
	);
	// Position the camera
	camera.position.x = 0;
	camera.position.y = 150;
	camera.position.z = 100;	

	// Create the renderer

	renderer = new THREE.WebGLRenderer ({
	// Alpha makes the background transparent, antialias is performant heavy
		alpha: true,
		antialias:true
	});

	//set the size of the renderer to fullscreen
	renderer.setSize (WIDTH, HEIGHT);
	//enable shadow rendering
	renderer.shadowMap.enabled = true;

	// Add the Renderer to the DOM, in the world div.
	container = document.getElementById('world');
	container.appendChild (renderer.domElement);

	//RESPONSIVE LISTENER
	window.addEventListener('resize', handleWindowResize, false);
}

//RESPONSIVE FUNCTION
function handleWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}


var hemispshereLight, shadowLight;

function createLights(){
	// Gradient coloured light - Sky, Ground, Intensity
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
	// Parallel rays
	shadowLight = new THREE.DirectionalLight(0xffffff, .9);

	shadowLight.position.set(0,350,350);
	shadowLight.castShadow = true;

	// define the visible area of the projected shadow
	shadowLight.shadow.camera.left = -650;
	shadowLight.shadow.camera.right = 650;
	shadowLight.shadow.camera.top = 650;
	shadowLight.shadow.camera.bottom = -650;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	// Shadow map size
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	// Add the lights to the scene
	scene.add(hemisphereLight);  
	scene.add(shadowLight);
}	


// Sea = function(){
// 	var geom = new THREE.CylinderGeometry(600,600,1500,40,10);
// 	//rotate on the x axis
// 	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
// 	//create a material
// 	// var mat = new THREE.MeshBasicMaterial( { color: 0xffff00 } );

// 	var mat = new THREE.MeshPhongMaterial({
// 		color: Colors.green,
// 		transparent:true,
// 		opacity: .6,
// 		shading:THREE.FlatShading,
// 	});

// 	//create a mesh of the object
// 	this.mesh = new THREE.Mesh(geom, mat);
// 	//receive shadows
// 	this.mesh.receiveShadow = true;
// }

Land = function(){
	var geom = new THREE.CylinderGeometry(600,600,1700,40,10);
	//rotate on the x axis
	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
	//create a material
	var mat = new THREE.MeshPhongMaterial({
		color: Colors.lightgreen,
		shading:THREE.FlatShading,
	});

	//create a mesh of the object
	this.mesh = new THREE.Mesh(geom, mat);
	//receive shadows
	this.mesh.receiveShadow = true;
}

Cloud = function(){
	// Create an empty container for the cloud
	this.mesh = new THREE.Object3D();
	// Cube geometry and material
	var geom = new THREE.DodecahedronGeometry(20,0);
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.white,  
	});

	var nBlocs = 3+Math.floor(Math.random()*3);

	for (var i=0; i<nBlocs; i++ ){
		//Clone mesh geometry
		var m = new THREE.Mesh(geom, mat);
			//Randomly position each cube
			m.position.x = i*15;
			m.position.y = Math.random()*10;
			m.position.z = Math.random()*10;
			m.rotation.z = Math.random()*Math.PI*2;
			m.rotation.y = Math.random()*Math.PI*2;

			//Randomly scale the cubes
			var s = .1 + Math.random()*.9;
			m.scale.set(s,s,s);

			// m.castShadow = true;
			// m.receiveShadow = true;
			//add to the container mesh
			this.mesh.add(m);
	}
}

Sky = function(){

	this.mesh = new THREE.Object3D();

	// Number of cloud groups
	this.nClouds = 25;

	// Space the consistenly
	var stepAngle = Math.PI*2 / this.nClouds;

	// Create the Clouds

	for(var i=0; i<this.nClouds; i++){
	
		var c = new Cloud();

		//set rotation and position using trigonometry
		var a = stepAngle*i;
		// this is the distance between the center of the axis and the cloud itself
		var h = 800 + Math.random()*200;
		c.mesh.position.y = Math.sin(a)*h;
		c.mesh.position.x = Math.cos(a)*h;		

		// rotate the cloud according to its position
		c.mesh.rotation.z = a + Math.PI/2;

		// random depth for the clouds on the z-axis
		c.mesh.position.z = -400-Math.random()*400;

		// random scale for each cloud
		var s = 1+Math.random()*2;
		c.mesh.scale.set(s,s,s);

		this.mesh.add(c.mesh);
	}
}

Tree = function () {

	this.mesh = new THREE.Object3D();

	var matTreeLeaves = new THREE.MeshPhongMaterial( { color:Colors.green, shading:THREE.FlatShading});

	var geonTreeBase = new THREE.BoxGeometry( 10,20,10 );
	var matTreeBase = new THREE.MeshBasicMaterial( { color:Colors.brown});
	var treeBase = new THREE.Mesh(geonTreeBase,matTreeBase);
	treeBase.castShadow = true;
	treeBase.receiveShadow = true;
	this.mesh.add(treeBase);

	var geomTreeLeaves1 = new THREE.CylinderGeometry(1, 12*3, 12*3, 4 );
	var treeLeaves1 = new THREE.Mesh(geomTreeLeaves1,matTreeLeaves);
	treeLeaves1.castShadow = true;
	treeLeaves1.receiveShadow = true;
	treeLeaves1.position.y = 20
	this.mesh.add(treeLeaves1);

	var geomTreeLeaves2 = new THREE.CylinderGeometry( 1, 9*3, 9*3, 4 );
	var treeLeaves2 = new THREE.Mesh(geomTreeLeaves2,matTreeLeaves);
	treeLeaves2.castShadow = true;
	treeLeaves2.position.y = 40;
	treeLeaves2.receiveShadow = true;
	this.mesh.add(treeLeaves2);

	var geomTreeLeaves3 = new THREE.CylinderGeometry( 1, 6*3, 6*3, 4);
	var treeLeaves3 = new THREE.Mesh(geomTreeLeaves3,matTreeLeaves);
	treeLeaves3.castShadow = true;
	treeLeaves3.position.y = 55;
	treeLeaves3.receiveShadow = true;
	this.mesh.add(treeLeaves3);

}


Forest = function(){

	this.mesh = new THREE.Object3D();

	// Number of Trees
	this.nTrees = 300;

	// Space the consistenly
	var stepAngle = Math.PI*2 / this.nTrees;

	// Create the Trees

	for(var i=0; i<this.nTrees; i++){
	
		var t = new Tree();

		//set rotation and position using trigonometry
		var a = stepAngle*i;
		// this is the distance between the center of the axis and the tree itself
		var h = 605;
		t.mesh.position.y = Math.sin(a)*h;
		t.mesh.position.x = Math.cos(a)*h;		

		// rotate the tree according to its position
		t.mesh.rotation.z = a + (Math.PI/2)*3;

		//Andreas Trigo funtime
		//t.mesh.rotation.z = Math.atan2(t.mesh.position.y, t.mesh.position.x)-Math.PI/2;

		// random depth for the tree on the z-axis
		t.mesh.position.z = 0-Math.random()*600;

		// random scale for each tree
		var s = .3+Math.random()*.75;
		t.mesh.scale.set(s,s,s);

		this.mesh.add(t.mesh);
	}
}


var AirPlane = function() {
	
	this.mesh = new THREE.Object3D();

	// Create the cabin
	var geomCockpit = new THREE.BoxGeometry(80,50,50,1,1,1);
	var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	geomCockpit.vertices[4].y-=10;
	geomCockpit.vertices[4].z+=20;
	geomCockpit.vertices[5].y-=10;
	geomCockpit.vertices[5].z-=20;
	geomCockpit.vertices[6].y+=30;
	geomCockpit.vertices[6].z+=20;
	geomCockpit.vertices[7].y+=30;
	geomCockpit.vertices[7].z-=20;
	var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	cockpit.castShadow = true;
	cockpit.receiveShadow = true;
	this.mesh.add(cockpit);
	
	// Create the engine
	var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
	var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
	var engine = new THREE.Mesh(geomEngine, matEngine);
	engine.position.x = 40;
	engine.castShadow = true;
	engine.receiveShadow = true;
	this.mesh.add(engine);
	
	// Create the tail
	var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
	var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
	tailPlane.position.set(-35,25,0);
	tailPlane.castShadow = true;
	tailPlane.receiveShadow = true;
	this.mesh.add(tailPlane);
	
	// Create the wing
	var geomSideWing = new THREE.BoxGeometry(40,4,150,1,1,1);
	var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});

	var sideWingTop = new THREE.Mesh(geomSideWing, matSideWing);
	var sideWingBottom = new THREE.Mesh(geomSideWing, matSideWing);
	sideWingTop.castShadow = true;
	sideWingTop.receiveShadow = true;
	sideWingBottom.castShadow = true;
	sideWingBottom.receiveShadow = true;

	sideWingTop.position.set(20,12,0);
	sideWingBottom.position.set(20,-3,0);
	this.mesh.add(sideWingTop);
	this.mesh.add(sideWingBottom);

	// propeller
	var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
	var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
	this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
	this.propeller.castShadow = true;
	this.propeller.receiveShadow = true;


	var geomBlade = new THREE.BoxGeometry(1,100,20,1,1,1);
	var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
	
	var blade = new THREE.Mesh(geomBlade, matBlade);
	blade.position.set(8,0,0);
	blade.castShadow = true;
	blade.receiveShadow = true;
	this.propeller.add(blade);
	this.propeller.position.set(50,0,0);
	this.mesh.add(this.propeller);
}



// Put the sea object into the scene.


var sky;
var forest;
var land;
var airplane;

// var sea;
var offSet = -600;


function createSky(){
  sky = new Sky();
  sky.mesh.position.y = offSet;
  scene.add(sky.mesh);
}

// function createSea(){
//   sea = new Sea();
//   sea.mesh.position.y = -600;
//   scene.add(sea.mesh);
// }

function createLand(){
  land = new Land();
  land.mesh.position.y = offSet;
  scene.add(land.mesh);
}


function createForest(){
  forest = new Forest();
  forest.mesh.position.y = offSet;
  scene.add(forest.mesh);
}

function createPlane(){ 
	airplane = new AirPlane();
	airplane.mesh.scale.set(.35,.35,.35);
	airplane.mesh.position.set(-75,110,-250);
	airplane.mesh.rotation.z = Math.PI/15;
	scene.add(airplane.mesh);
}

function loop(){
  land.mesh.rotation.z += .005;
  sky.mesh.rotation.z += .003;
  forest.mesh.rotation.z += .005;
  airplane.propeller.rotation.x += 0.3;
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}



function init() {
	createScene();
	createLights();
	createPlane();

	// createSea();
	createLand();
	createForest();
	createSky();
	loop();
}

window.addEventListener('load', init, false);