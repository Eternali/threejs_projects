function Player (startx, startz, camera=null) {

    this.camera = camera;
    this.cameraEnabled = (this.camera !== null);
    this.height = 1.8;

    if (this.cameraEnabled) {
        this.camera.position.set(startx, this.height, startz);
        this.camera.lookAt(new THREE.Vector3(0, this.height, 0));
    }

    this.speed = 0.125;

    this.move = function (direction) {
        if (!this.cameraEnabled) return;
        switch (direction) {
            case dirs.LEFT:
                this.camera.position.x += Math.sin(this.camera.rotation.y+Math.PI/2)*this.speed;
                this.camera.position.z -= Math.cos(this.camera.rotation.y+Math.PI/2)*this.speed;
                break;
            case dirs.RIGHT:
                this.camera.position.x += Math.sin(this.camera.rotation.y-Math.PI/2) * this.speed;
                this.camera.position.z -= Math.cos(this.camera.rotation.y-Math.PI/2)*this.speed;
                break;
            case dirs.FORWARD:
            this.camera.position.x -= Math.sin(this.camera.rotation.y) * this.speed;
            this.camera.position.z += Math.cos(this.camera.rotation.y)*this.speed;
                break;
            case dirs.BACKWARD:
            this.camera.position.x -= Math.sin(this.camera.rotation.y) * this.speed;
            this.camera.position.z += Math.cos(this.camera.rotation.y)*this.speed;
                break;
        }
    }

}
