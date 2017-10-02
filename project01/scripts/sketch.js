/*** Important global variable declarations ***/
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
    camera: new THREE.PerspectiveCamera(90, 1200/600, 0.1, 1000),
    box: new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshBasicMaterial({ color: 0x4444ff })
    )
}
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
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, 1200/600, 0.1, 1000);
    clock = new THREE.Clock();

    player = new Player(0, 0, camera);

    // initialize loading screen
    // loadingScreen.box.position.set(0,0,5);
    // loasingScreen.camera.lookAt(loadingScreen.box.position);
    // loadingScreen.scene.add(loadingScreen.box);

    loadingManager = new THREE.LoadingManager();
    // what to do after loading progresses (e.g. show a progress bar)
    loadingManager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };
    // when assets are finished loading, generate all meshes to scene.
    loadingManager.onLoad = function () {


        resourcesLoaded = true;
    };

    floor = new THREE.Mesh(
        new THREE.PlaneGeometry(50,50, 10,10),
        new THREE.MeshPhongMaterial({ color: 0x454545 })
    );
    floor.rotation.x -= Math.PI / 2;
    floor.receiveShadow = true;

    // lighting
    ambientLight = new THREE.AmbientLight(0xffffff, 0.3);

    light = new THREE.PointLight(0xffffff, 1.1, 28);
    light.position.set(40,6,40);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;



    // add all elements to the scene
    scene.add(floor);
    scene.add(ambientLight);
    scene.add(light);

    // create the renderer, add it to the DOM, and start animating
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(1200,600);
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

    // render the updated scene and camera //
    renderer.render(scene, camera);
}


function keyDown () {
    keyboard[event.keyCode] = true;
}

function keyUp () {
    keyboard[event.keyCode] = false;
}


window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;
