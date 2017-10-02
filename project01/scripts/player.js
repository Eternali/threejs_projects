function Player (startX, startZ, camera=null) {

    this.camera = camera;
    if (this.camera === null) this.cameraEnabled = false;
    else this.cameraEnabled = true;

    this.height = 1.8;

}
