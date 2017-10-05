/****  DECLARE IMPORTANT VARIABLES  ****/
let width, height, worldWidth, worldHeight;
let renderer, camera, scene, loadingManager;
let clock, time, delta;
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
    LEFT: { x: -3, y: 0 },
    RIGHT: { x: 3, y: 0 },
    DOWN: { x: 0, y: -3 },
    UP: { x: 0, y: 3 }
};

// objects for storing data about classes of meshes in the scene
let models = {
};
// holds mesh bodies for all structures in the actual scene
let meshes = {};

// holds plane bodies for all planes in the scene
let planes = {};
// holds light objects for all lights in the scene
let lights = {};


// wall generation
function makeWall (length, density, x, z, angle) {
    let wall = new THREE.Mesh(
        new THREE.PlaneGeometry(length,4, density,density),
        new THREE.MeshPhongMaterial({ color: 0xff0000, wireframe: false })
    );
    wall.position.y += 2;
    wall.rotation.x += Math.PI;
    wall.rotation.y += angle;
    wall.material.side = THREE.DoubleSide;
    wall.receiveShadow = true;

    return wall
}

function generateWalls () {
    let walls = [];

    let wall01 = makeWall();
    walls.push(makeWall(50, 50, 0, 0, 0));

    return walls;
}

function addPlanes (planes) {
    for (let p in planes) {
        if (p == 'walls') addPlanes(planes[p]);
        else scene.add(planes[p]);
    }
}


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

    player = new Player(-70, -70, camera);

    // generate floor
    planes['floor'] = new THREE.Mesh(
        new THREE.PlaneGeometry(150,150, worldWidth, worldHeight),
        new THREE.MeshPhongMaterial({ color: 0x454545, wireframe: false })
    );
    planes['floor'].rotation.x -= Math.PI/2;
    planes['floor'].receiveShadow = true;

    // generate walls
    planes['walls'] = generateWalls();

    // lighting
    lights['ambientLight'] = new THREE.AmbientLight(0xffffff, 0.3);
    lights['pointLight00'] = new Lamp(-75, -25);
    lights['pointLight01'] = new Lamp(-75, 25);

    // add elements to scene
    addPlanes(planes);
    for (let l in lights) {
        scene.add((~l.indexOf('point')) ? lights[l].light : lights[l]);
    }

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
