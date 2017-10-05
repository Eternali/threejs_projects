/****  DECLARE IMPORTANT VARIABLES  ****/
let width, height, worldWidth, worldHeight;
let renderer, camera, scene, loadingManager;
let clock, time, delta;
let floor, ambientLight, light;
let player;

// for holding keyboard data
let keyboard = {};
// for handling mouse events
let mouseEnabled = false;  // allows user to rotate with the mouse instead of arrows
let mouse = { x: 0, y: 0 };
let mouseVec = { x: 0, y: 0 };

// "enums" for handling movement and directions
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

// objects for storing data about classes of meshes in the scene
let models = {
};

// holds mesh bodies for all structures in the actual scene
let meshes = {};

/****  INITIALIZE THE ENVIRONMENT  ****/
function init () {

    // initialize variables
    width = window.innerWidth - 20;
    height = window.innerHeight - 20;
    worldWidth = 50;
    worldHeight = 50;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(9, width/height, 0.1, 1000);
    clock = new THREE.Clock();

    player = new Player(50, -50, camera);

    // generate floor
    floor = new THREE.Mesh(
        new THREE.PlaneGeometry(150,150, worldWidth, worldHeight),
        new THREE.MeshPhongMaterial({ color: 0x454545, wireframe: true })
    );
    floor.rotation.x += -Math.PI/2;
    floor.receiveShadow = true;

    // lighting
    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    // add elements to scene
    scene.add(floor);
    scene.add(ambientLight);

    // create the renderer, add it to the DOM, and start animating
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    document.body.appendChild(renderer.domElement);
    animate();

}


/**** EVERY FRAME UPDATE THE ENVIRONMENT AND RENDER IT  ****/
function animate () {
    // check for different scenes

    requestAnimationFrame(animate);

    // get user input
    if (keyboard[65]) player.move(dirs.LEFT);  // A
    if (keyboard[68]) player.move(dirs.RIGHT);  // D
    if (keyboard[83]) player.move(dirs.BACKWARD);  // S
    if (keyboard[87]) player.move(dirs.FORWARD);  // W
    if (keyboard[37]) player.look(looks.LEFT);  // left arrow
    if (keyboard[39]) player.look(looks.RIGHT);  // right arrow
    // if (keyboard[40]) player.look(looks.DOWN);  // down arrow
    // if (keyboard[38]) player.look(looks.UP);  // up arrow

    // update the game state

    // render the updated scene and camera
    renderer.render(scene, camera);

}


/****  GET USER INPUT  ****/
function keyDown (event) {
    keyboard[event.keyCode] = true;
}

function keyUp (event) {
    keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

// initialize game when the window has loaded
window.onload = init;
