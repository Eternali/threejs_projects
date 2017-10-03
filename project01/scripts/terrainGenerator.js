// object for generating threejs compatible terrain
function TerrainGenerator (inwidth, indepth, hscale) {

    this.inwidth = inwidth;
    this.indepth = indepth;
    this.hscale = hscale;
    this.heights;

    this.init = function () {
        let geometry = this.createGeometry();
        let texture = new THREE.CanvasTexture(this.generateTexture());
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        return new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ map: texture }));
    };

    this.createGeometry = function (inwidth=this.inwidth, indepth=this.indepth) {
        this.geometry = new THREE.PlaneBufferGeometry(inwidth, indepth, worldWidth-1, worldDepth-1);
        this.geometry.rotateX(-Math.PI/2);

        this.heights = this.generateHeight(worldWidth, worldDepth);
        this.vertices = this.geometry.attributes.position.array;

        for (let i = 0, j = 0; i < this.vertices.length; i ++, j += 3) {
            this.vertices[j+1] = this.heights[i];
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

    this.generateTexture = function (data=this.heights, width=worldWidth, height=worldDepth) {
        var canvas, canvasScaled, context, image, imageData,
				level, diff, vector3, sun, shade;
				vector3 = new THREE.Vector3( 0, 0, 0 );
				sun = new THREE.Vector3( 1, 1, 1 );
				sun.normalize();
				canvas = document.createElement( 'canvas' );
				canvas.width = width;
				canvas.height = height;
				context = canvas.getContext( '2d' );
				context.fillStyle = '#000';
				context.fillRect( 0, 0, width, height );
				image = context.getImageData( 0, 0, canvas.width, canvas.height );
				imageData = image.data;
				for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {
					vector3.x = data[ j - 2 ] - data[ j + 2 ];
					vector3.y = 2;
					vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
					vector3.normalize();
					shade = vector3.dot( sun );
					imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
					imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
					imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
				}
				context.putImageData( image, 0, 0 );
				// Scaled 4x
				canvasScaled = document.createElement( 'canvas' );
				canvasScaled.width = width * 4;
				canvasScaled.height = height * 4;
				context = canvasScaled.getContext( '2d' );
				context.scale( 4, 4 );
				context.drawImage( canvas, 0, 0 );
				image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
				imageData = image.data;
				for ( var i = 0, l = imageData.length; i < l; i += 4 ) {
					var v = ~~ ( Math.random() * 5 );
					imageData[ i ] += v;
					imageData[ i + 1 ] += v;
					imageData[ i + 2 ] += v;
				}
				context.putImageData( image, 0, 0 );
				return canvasScaled;

    };

}
