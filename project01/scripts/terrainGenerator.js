// object for generating threejs compatible terrain
function TerrainGenerator (inwidth, indepth, hscale) {

    this.inwidth = inwidth;
    this.indepth = indepth;
    this.hscale = hscale;

    this.createGeometry = function (inwidth=this.inwidth, indepth=this.indepth) {
        this.geometry = new THREE.PlaneBufferGeometry(inwidth, indepth, worldWidth-1, worldDepth-1);
        this.geometry.rotateX(-Math.PI/2);

        let heights = this.generateHeight(worldWidth, worldDepth);
        this.vertices = this.geometry.attributes.position.array;

        for (let i = 0, j = 0; i < this.vertices.length; i ++, j += 3) {
            this.vertices[j+1] = heights[i];
        }

        return this.geometry;
    };

    this.generateHeight = function (width=this.inwidth, depth=this.indepth,
                                    hscale=this.hscale, quality=1, passes=4) {
        let size = width * depth;
        let heights = new Float32Array(size);
        for (let j = 0; j < passes; j ++) {
            for (let i = 0; i < size; i ++) {
                // note: ~~ is equivalent to flooring a float (cuts all decimals)
                let x = i % width, y = ~~ (i / width);
                // heights[i] = map(noise.simplex2(x, y), -1, 1, -hscale, hscale);
                heights[i] = noise.simplex2(x / quality, y / quality) * hscale;
            }
            quality += 5;
        }
        return heights;
    };

}

//     canvas: { width: 0, height: 0 },
//     createCanvas: function (inwidth, inheight) {
//         canvas.width = inwidth;
//         canvas.height = inheight;
//     },
//
//     createGeometry: function (inNoise, indepth, widthSegs, heightSegs) {
//         let geometry = new THREE.BufferGeometry();
//         let points = inNoise.width * inNoise.height;
//         let indices = (inNoise.width - 1) * (inNoise.height - 1);
//
//         geometry.addAttribute('index', new THREE.BufferAttribute(new Uint32Array(indices), 1));
//         geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(points*3), 3));
//         geometry.addAttribute('position', new THREE.BufferAttribute(new Uint32Array(points*3), 3));
//
//         this.createVertices(inNoise, geometry, indepth);
//         this.createFaces(inNoise, withSegs, heightSegs);
//
//         return geometry;
//     }
//
// }
