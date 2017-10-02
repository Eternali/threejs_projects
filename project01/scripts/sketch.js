/*** Important global variable declarations ***/
let width, height;
let renderer, scene, camera;
let loadingManager, clock, time, delta;
let ambientLight, light, floor;
let player;

// for handling keyboard events
let keyboard = {};

// "enums" for player movement
let dirs = {
    LEFT: 0,
    RIGHT: 1,
    FORWARD: 2,
    BACKWARD: 3,
    UP: 4,
    DOWN: 5
};
let looks = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3
};

// object for loading screen
let loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(90, 1200/700, 0.1, 1000),
    box: new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshBasicMaterial({ color: 0x4444ff })
    )
};
let resourcesLoaded = false;

/*** Scene object formatting and initializations ***/

// make a dict for storing all possible types of objects in scene
let models = {
//     tree: ,
//     crate: ,
//
//     uzi1: ,
};

// holds mesh bodies for all structures in the scene
let meshes = {};


function init () {
    width = window.innerWidth - 20;
    height = window.innerHeight - 20;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, width/height, 0.1, 1000);
    clock = new THREE.Clock();

    player = new Player(0, 0, camera);

    // initialize loading screen
    loadingScreen.box.position.set(0,0,5);
    loadingScreen.camera.lookAt(loadingScreen.box.position);
    loadingScreen.scene.add(loadingScreen.box);

    loadingManager = new THREE.LoadingManager();
    // after loading progresses do (e.g. show a progress bar)
    loadingManager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };
    // when assets are finished loading, generate all meshes to scene.
    loadingManager.onLoad = function () {


        resourcesLoaded = true;
    };

    floor = new THREE.Mesh(
        new THREE.PlaneGeometry(50,50, 10,10),
        new THREE.MeshBasicMaterial({ color: 0x454545 })
    );
    floor.position.set(0,0,0);
    floor.rotation.x -= Math.PI / 2;
    floor.receiveShadow = true;

    // lighting
    ambientLight = new THREE.AmbientLight(0xffffff, 0.3);

    light = new THREE.PointLight(0xffffff, 1.6, 38);
    light.position.set(-25,25,-10);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 40;

    camera.position.set(-20,10,-20);
    camera.lookAt(new THREE.Vector3(0,0,0));

    meshes.box = new THREE.Mesh(
        new THREE.BoxGeometry(3,3,3),
        new THREE.MeshPhongMaterial({ color: 0xff7575, wireframe: false })
    );
    meshes.box.position.y += 5
    meshes.box.castShadow = true;
    meshes.box.receiveShadow = true;

    // add all elements to the scene
    scene.add(floor);
    scene.add(meshes.box);
    scene.add(ambientLight);
    scene.add(light);

    // create the renderer, add it to the DOM, and start animating
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    document.body.appendChild(renderer.domElement);

    animate();
}


function animate () {
    // check for different scenes //
    if (!resourcesLoaded) {

    }

    requestAnimationFrame(animate);

    // update game state //

    time = Date.now() * 0.0005;
    delta = clock.getDelta();

    meshes.box.rotation.x += 0.01;
    meshes.box.rotation.y += 0.02;

    // render the updated scene and camera //
    renderer.render(scene, camera);
}


function keyDown (event) {
    keyboard[event.keyCode] = true;
}

function keyUp (event) {
    keyboard[event.keyCode] = false;
}


window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;
