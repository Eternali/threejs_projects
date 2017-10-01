let scene, camera, renderer;
let ambientLight, light;
let player, mesh;
let crate, crateTexture, crateNormalMap, crateBumpMap;

let keyboard = {};

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

function init () {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, 1000/600, 0.1, 1000);
    player = new Player(0, -5, camera);

    mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial({ color: 0xff9999, wireframe: false })
    );
    mesh.position.y += 2;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(20,20, 10,10),
        new THREE.MeshPhongMaterial({ color: 0x757575, wireframe: false })
    );
    meshFloor.rotation.x -= Math.PI / 2;
    meshFloor.receiveShadow = true;

    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);

    light = new THREE.PointLight(0xffffff, 1.1, 28);
    light.position.set(-3,6,-3);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;

    let textureLoader = new THREE.TextureLoader();
    crateTexture = textureLoader.load('assets/crate0/crate0_diffuse.png');
    crateBumpMap = textureLoader.load('assets/crate0/crate0_bump.png');
    crateNormalMap = textureLoader.load('assets/crate0/crate0_normal.png');

    crate = new THREE.Mesh(
        new THREE.BoxGeometry(3,3,3),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: crateTexture,
            bumpMap: crateBumpMap,
            normalMap: crateNormalMap,
            wireframe: false
        })
    );
    crate.position.set(3, 3/2, 3);
    crate.receiveShadow = true;
    crate.castShadow = true;

    scene.add(mesh);
    scene.add(meshFloor);
    scene.add(ambientLight);
    scene.add(light);
    scene.add(crate);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(1000,600);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    document.body.appendChild(renderer.domElement);

    animate();
}

function animate () {
    requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    crate.rotation.y += 0.01;

    if (keyboard[65]) player.move(dirs.LEFT);  // A
    if (keyboard[68]) player.move(dirs.RIGHT);  // D
    if (keyboard[87]) player.move(dirs.FORWARD);  // W
    if (keyboard[83]) player.move(dirs.BACKWARD);  // S

    if (keyboard[37]) player.look(looks.LEFT);  // left arrow
    if (keyboard[39]) player.look(looks.RIGHT);  // right arrow

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
