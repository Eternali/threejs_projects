/****  DECLARE IMPORTANT VARIABLES  ****/
let renderer, camera, scene, loadingManager;
let clock, time, delta;
let ambientLight, light;
let player;

// for holding keyboard data
let keyboard = {};

// "enums" for handling movement and directions
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


/****  INITIALIZE THE ENVIRONMENT  ****/
function init () {



}


/**** EVERY FRAME UPDATE THE ENVIRONMENT AND RENDER IT  ****/
function animate () {

    requestAnimationFrame(animate);


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
