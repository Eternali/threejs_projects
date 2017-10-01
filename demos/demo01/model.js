function Model (src) {
    this.mtl = 'assets/Models/' + src + '.mtl';
    this.obj = 'assets/Models/' + src + '.obj';
    this.mesh = null;

    this.load = function (loadingMgr, pos, angle) {
        let mLoader = new THREE.MTLLoader(loadingMgr);
        mLoader.load(this.mtl, function (materials) {
            materials.preload();
            let oLoader = new THREE.OBJLoader(loadingMgr);
            oLoader.setMaterials(materials);
            oLoader.load(this.obj, function (mesh) {
                // objs are made of many small meshes, traverse though them to add shadows.
                mesh.traverse(function (node) {
                    if (node instanceof THREE.Mesh) {
                        node.receiveShadow = true;
                        node.castShadow = true;
                    }
                });

                mesh.position.set(pos.x,pos.y,pos.z);
                // mesh.rotation.set(angle.x,angle.y,angle.z);
                this.mesh = mesh;
            });
        });
    }
}
