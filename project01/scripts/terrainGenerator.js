// object for generating threejs compatible terrain
let TerrainGenerator = {

    canvas: { width: 0, height: 0 },
    createCanvas: function (inwidth, inheight) {
        canvas.width = inwidth;
        canvas.height = inheight;
    },

    createGeometry: function (inNoise, indepth, widthSegs, heightSegs) {
        let geometry = new THREE.BufferGeometry();
        let points = inNoise.width * inNoise.height;
        let indices = (inNoise.width - 1) * (inNoise.height - 1);

        geometry.addAttribute('index', new THREE.BufferAttribute(new Uint32Array(indices), 1));
        geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(points*3), 3));
        geometry.addAttribute('position', new THREE.BufferAttribute(new Uint32Array(points*3), 3));

        this.createVertices(inNoise, geometry, indepth);
        this.createFaces(inNoise, withSegs, heightSegs);

        return geometry;
    }

}
