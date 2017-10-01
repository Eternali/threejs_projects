function Model (src, pos, rot, castShadow=true, receiveShadow=true) {

    this.pos = pos;
    this.rot = rot;
    this.castShadow = castShadow;
    this.receiveShadow = receiveShadow;

    this.mtl = 'assets/Models/' + src + '.mtl';
    this.obj = 'assets/Models/' + src + '.obj';
    this.mesh = null;

}
