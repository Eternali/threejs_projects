function Player (startX, startZ, camera) {

    this.camera = camera;
    if (this.camera === null) this.cameraEnabled = false;
    else this.cameraEnabled = true;

    this.height = 1.8;
    this.x = startX;
    this.y = this.height;
    this.z = startZ;

    this.speed = 0.2;
    this.turnSpeed = Math.PI * 0.01;

    if (this.cameraEnabled) {
        this.camera.position.set(this.x, this.y, this.z);
        this.camera.lookAt(new THREE.Vector3(0, this.y, 0));
    }

    this.move = function (direction) {
        if (!this.cameraEnabled) return;
        switch (direction) {
            case dirs.LEFT:
                this.camera.position.x += Math.sin(this.camera.rotation.y + Math.PI/2) * this.speed;
                this.camera.position.z += -Math.cos(this.camera.rotation.y + Math.PI/2) * this.speed;
                break;
            case dirs.RIGHT:
                this.camera.position.x += Math.sin(this.camera.rotation.y - Math.PI/2) * this.speed;
                this.camera.position.z += -Math.cos(this.camera.rotation.y - Math.PI/2) * this.speed;
                break;
            case dirs.FORWARD:
                this.camera.position.x -= Math.sin(this.camera.rotation.y) * this.speed;
                this.camera.position.z -= -Math.cos(this.camera.rotation.y) * this.speed;
                break;
            case dirs.BACKWARD:
                this.camera.position.x += Math.sin(this.camera.rotation.y) * this.speed;
                this.camera.position.z += -Math.cos(this.camera.rotation.y) * this.speed;
                break;
        }
    }

    this.look = function (look) {
        if (!this.cameraEnabled) return;
        switch (look) {
            case looks.LEFT:
                this.camera.rotation.y -= this.turnSpeed;
                break;
            case looks.RIGHT:
                this.camera.rotation.y += this.turnSpeed;
                break;
        }
    }

    // this.body = new THREE.MESH();
}
