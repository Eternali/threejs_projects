function Lamp (x, z) {
    this.light = new THREE.PointLight(0xffffff, 1.1, 100);
    this.light.position.set(x,10,z);
    this.light.castShadow = true;
    this.light.shadow.camera.near = 0.1;
    this.light.shadow.camera.far = 100;
}
