/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTorus extends CGFobject {
    constructor(scene, id, inner, outer, slices, loops) {
        super(scene);

        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;
        this.initBuffers();
    }
    initBuffers() {
        //-----declaracao-----
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices; //angulo entre as faces do prisma

        var sides = 1; //nr of cylinders
        var angRot = 0;
        var alphaAngRot = 360/sides;

        for (var j = 0; j < sides; j++) {

            angRot+=alphaAngRot;//implement creation of several cylinders to create torus(see sketch)

            for (var i = 0; i < this.slices; i++) {
                var senAng = Math.sin(ang);
                var senAng_Alpha = Math.sin(ang + alphaAng);
                var cosAng = Math.cos(ang);
                var cosAng_Alpha = Math.cos(ang + alphaAng);

                this.vertices.push(cosAng * this.inner, 0, -senAng * this.inner);
                this.texCoords.push(0, 1);
                this.vertices.push(cosAng_Alpha * this.inner, 0, -senAng_Alpha * this.inner); //pontos base c/ y=0
                this.texCoords.push(1, 1);

                this.vertices.push(cosAng * this.inner, 1, -senAng * this.inner);//1 numero generico
                this.texCoords.push(0, 0);
                this.vertices.push(cosAng_Alpha * this.inner, 1, -senAng_Alpha * this.inner); //pontos topo c/ y=stacks
                this.texCoords.push(1, 0);

                // square normal computation
                var normal = [
                    cosAng,
                    0,
                    -senAng
                ];

                // normalization
                var nsize = Math.sqrt(
                    normal[0] * normal[0] +
                    normal[1] * normal[1] +
                    normal[2] * normal[2]
                );

                normal[0] /= nsize;
                normal[1] /= nsize;
                normal[2] /= nsize;

                //normal values for next face(avoid using previous angle)
                var normalNext = [
                    Math.cos(ang + alphaAng),
                    0,
                    -Math.sin(ang + alphaAng)];

                // push normal once for each vertex of this square
                this.normals.push(...normal);
                this.normals.push(...normalNext);
                this.normals.push(...normal);
                this.normals.push(...normalNext);

                this.indices.push(4 * i, (4 * i + 1), (4 * i + 3));
                this.indices.push(4 * i, (4 * i + 3), (4 * i + 2));


                ang += alphaAng;
            }

        }
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity) {
        this.slices = 5 + Math.round(5 * complexity); //complexity varies 0-1, so slices varies 0-10

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}