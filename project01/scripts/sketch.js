/*** Important global variable declarations ***/
let width, depth, worldWidth, worldDepth;
let renderer, scene, camera;
let loadingManager, clock, time, delta;
let ambientLight, light, terrain;
let player;

// for handling keyboard events
let keyboard = {};
// for handling mouse events
let mouseEnabled = false;  // this allows the user to rotate with the mouse instead of arrows
let mouse = { x: 0, y: 0 };
let mouseVec = { x: 0, y: 0 };

// "enums" for player movement
let dirs = {
    LEFT: 0,
    RIGHT: 1,
    BACKWARD: 2,
    FORWARD: 3,
    DOWN: 4,
    UP: 5
};
// used if mouse is not enabled
let looks = {
    LEFT: { x: -4, y: 0 },
    RIGHT: { x: 4, y: 0 },
    DOWN: { x: 0, y: -4 },
    UP: { x: 0, y: 4 }
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
// let basicModels = {
//     floor: THREE.Mesh(
//         new THREE.PlaneGeometry(50,50, 10,10),
//         new THREE.MeshBasicMaterial({ color: 0x454545 })
//     )
// };
let models = {
//     tree: ,
//     crate: ,
//
//     uzi1: ,
};

// holds mesh bodies for all structures in the scene
let meshes = {};


function init () {
    //seed perlin noise
    noise.seed(Math.random());

    // initialize variables
    width = window.innerWidth - 20;
    depth = window.innerHeight - 20;
    worldWidth = 60;
    worldDepth = 60;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, width/depth, 0.1, 1000);
    clock = new THREE.Clock();

    player = new Player(50, -50, camera);

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

    let terrainGenerator = new TerrainGenerator(200, 200, 20);
    terrain = terrainGenerator.init();
    // let terrainGeometry = terrainGenerator.createGeometry();
    // terrain = new THREE.Mesh(
    //     terrainGeometry,
    //     new THREE.MeshPhongMaterial({ color: 0x454545, wireframe: false })
    // );
    // terrain.receiveShadow = true;
    // terrain = new THREE.Mesh(
    //     new THREE.PlaneGeometry(50,50, 10,10),
    //     new THREE.MeshPhongMaterial({ color: 0x454545 })
    // );
    // terrain.rotateX(-Math.PI/2);
    terrain.receiveShadow = true;

    // lighting
    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    light = new THREE.PointLight(0xffffff, 6, 525);
    light.position.set(-200,400,0);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 600;

    meshes.box = new THREE.Mesh(
        new THREE.BoxGeometry(10,10,10),
        new THREE.MeshPhongMaterial({ color: 0xff7575, wireframe: false })
    );
    meshes.box.position.y += 30;
    meshes.box.castShadow = true;
    meshes.box.receiveShadow = true;

    // add all elements to the scene
    scene.add(terrain);
    scene.add(meshes.box);
    scene.add(ambientLight);
    scene.add(light);

    // create the renderer, add it to the DOM, and start animating
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, depth);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    document.body.appendChild(renderer.domElement);

    animate();
}


function animate () {
    // check for different scenes //
    if (!resourcesLoaded) {}

    requestAnimationFrame(animate);

    // get user input //
    if (keyboard[65]) player.move(dirs.LEFT);  // A
    if (keyboard[68]) player.move(dirs.RIGHT);  // D
    if (keyboard[83]) player.move(dirs.BACKWARD);  // S
    if (keyboard[87]) player.move(dirs.FORWARD);  // W
    if (keyboard[37]) player.look(looks.LEFT);  // left arrow
    if (keyboard[39]) player.look(looks.RIGHT);  // right arrow
    // if (keyboard[40]) player.look(looks.DOWN);  // down arrow
    // if (keyboard[38]) player.look(looks.UP);  // up arrow

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

function mouseMove (event) {
    if (!mouseEnabled) return;
    mouseVec.x = event.clientX - mouse.x;
    mouseVec.y = event.clientY - mouse.y;
    mouse.x = event.x;
    mouse.y = event.y;
    player.look(mouseVec);
}


window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.addEventListener('mousemove', mouseMove);

window.onload = init;
