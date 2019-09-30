/**
 * MySphere
 * @constructor
 */
class MySphere extends CGFobject {

    constructor(scene, id, radius, slices, stacks) {
        super(scene);

        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }


    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (var stack = 0; stack <= this.stacks; stack++) {

            for (var slice = 0; slice <= this.slices; slice++) {

                var xCoord = this.radius * Math.cos(slice * 2 * Math.PI / this.slices) * Math.sin(stack * 2 * Math.PI / this.stacks);
                var yCoord = this.radius * Math.cos(stack * 2 * Math.PI / this.stacks);
                var zCoord = this.radius * Math.sin(slice * 2 * Math.PI / this.slices) * Math.sin(stack * 2 * Math.PI / this.stacks);

                this.vertices.push(xCoord, yCoord, zCoord);
                this.normals.push(xCoord, yCoord, zCoord);
                this.texCoords.push(1 - (slice / this.slices), 1 - (stack / this.stacks));
            }
        }

        for (var stack = 0; stack < this.stacks; stack++) {
            for (var slice = 0; slice < this.slices; slice++) {
                var ind = (stack * (this.slices + 1)) + slice;

                this.indices.push(ind, ind + this.slices + 2, ind + this.slices + 1);
                this.indices.push(ind, ind + 1, ind + this.slices + 2);
            }
        }
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
};