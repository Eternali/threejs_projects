let scene, camera, renderer, loadingManager;
let clock, time, delta;
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

// create a loading screen object
let loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(90, 1000/600, 0.1, 1000),
    box: new THREE.Mesh(
            new THREE.BoxGeometry(0.5,0.5,0.5),
            new THREE.MeshBasicMaterial({ color: 0x4444ff })
    )
};
let RESOURCESLOADED = false;

// holds the data about all possible types of objects in the scene (the "bluprints")
let models = {
    tree: new Model('naturePack_089', {x: -3, y: 0, z: 6}, {x: 0, y: Math.PI/4, z: 0}),
    tent: new Model('naturePack_075', {x: -3, y: 0, z: -6}, {x: 0, y: Math.PI/2, z: 0}),
    uzi1: new Model('uziLong', {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, false)
};

// holds mesh bodies for all structures in the actual scene
let meshes = {};

function init () {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, 1000/600, 0.1, 1000);
    clock = new THREE.Clock();
    player = new Player(0, -5, camera);

    // initialize loading screen like any other scene
    loadingScreen.box.position.set(0,0,5);
    loadingScreen.camera.lookAt(loadingScreen.box.position);
    loadingScreen.scene.add(loadingScreen.box);

    loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };
    loadingManager.onLoad = function () {
        meshes['tent1'] = models.tent.mesh.clone();
        meshes['tent2'] = models.tent.mesh.clone();
        meshes['tent2'].position.z += 5;

        meshes['tree1'] = models.tree.mesh.clone();
        meshes['tree2'] = models.tree.mesh.clone();
        meshes['tree2'].position.z += 3;

        meshes['playergun'] = models.uzi1.mesh.clone();
        meshes['playergun'].scale.set(7,7,7);

        scene.add(meshes['tent1']);
        scene.add(meshes['tent2']);

        scene.add(meshes['tree1']);
        scene.add(meshes['tree2']);

        scene.add(meshes['playergun']);

        RESOURCESLOADED = true;
    };

    mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial({ color: 0xff7575, wireframe: false })
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

    ambientLight = new THREE.AmbientLight(0xffffff, 0.4);

    light = new THREE.PointLight(0xffffff, 1.1, 28);
    light.position.set(-3,6,-3);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;

    let textureLoader = new THREE.TextureLoader(loadingManager);
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

    // model/material loading
    for (let _key in models) {
        (function (key) {
            let mtlLoader = new THREE.MTLLoader(loadingManager);
            mtlLoader.load(models[key].mtl, function (materials) {
                materials.preload();
                let objLoader = new THREE.OBJLoader(loadingManager);
                objLoader.setMaterials(materials);
                objLoader.load(models[key].obj, function (mesh) {
                    // objs are made of many small meshes, traverse through them to add shadows.
                    mesh.traverse(function (node) {
                        if (node instanceof THREE.Mesh) {
                            node.castShadow = models[key].castShadow;
                            node.receiveShadow = models[key].receiveShadow;
                        }
                    });
                    models[key].mesh = mesh;
                    models[key].mesh.position.set(models[key].pos.x,models[key].pos.y,models[key].pos.z);
                    models[key].mesh.rotation.set(models[key].rot.x,models[key].rot.y,models[key].rot.z);
                });
            });
        })(_key);
    }

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
    if (!RESOURCESLOADED) {
        requestAnimationFrame(animate);

        loadingScreen.box.position.x -= 0.05;
        if (loadingScreen.box.position.x < -10) loadingScreen.box.position.x = 10;
        loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);

        renderer.render(loadingScreen.scene, loadingScreen.camera);
        return;
    }

    requestAnimationFrame(animate);

    time = Date.now() * 0.0005;
    delta = clock.getDelta();

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    crate.rotation.y += 0.01;

    if (keyboard[65]) player.move(dirs.LEFT);  // A
    if (keyboard[68]) player.move(dirs.RIGHT);  // D
    if (keyboard[87]) player.move(dirs.FORWARD);  // W
    if (keyboard[83]) player.move(dirs.BACKWARD);  // S

    if (keyboard[37]) player.look(looks.LEFT);  // left arrow
    if (keyboard[39]) player.look(looks.RIGHT);  // right arrow

    if (player.canShoot == 0 && keyboard[32]) player.fire();  // spacebar
    if (player.canShoot > 0) player.canShoot -= 1;

    // position gun in front of camera
    meshes['playergun'].position.set(
        camera.position.x - Math.sin(camera.rotation.y + Math.PI/6) * 0.6,
        camera.position.y - 0.325 + Math.sin(time*4 + camera.position.x+camera.position.z)*0.01,
        camera.position.z + Math.cos(camera.rotation.y + Math.PI/6) * 0.6
    );
    // rotate the gun to match camera
    meshes['playergun'].rotation.set(
        camera.rotation.x,
        camera.rotation.y + Math.PI,
        camera.rotation.z
    );

    for (let i in player.bullets) {
        if (!player.bullets[i].alive) {
            player.bullets.splice(i, 1);
            continue;
        }
        player.bullets[i].position.add(player.bullets[i].velocity);
    }

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
