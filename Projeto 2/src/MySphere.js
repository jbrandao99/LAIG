/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
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
    this.normals = [];
    this.indices = [];
    this.texCoords = [];

    var beta = (2 * Math.PI) / this.slices;
    var alpha = (Math.PI) / this.stacks;

    for (var stack = 0; stack < this.stacks + 1; ++stack) {
      for (var slice = 0; slice <= this.slices; ++slice) {
        this.vertices.push(
            this.radius * Math.sin(stack * alpha) * Math.cos(slice * beta),
            this.radius * Math.sin(stack * alpha) * Math.sin(slice * beta),
            this.radius * Math.cos(stack * alpha));
        this.normals.push(
            Math.sin(stack * alpha) * Math.cos(slice * beta),
            Math.sin(stack * alpha) * Math.sin(slice * beta),
            Math.cos(stack * alpha));
        this.texCoords.push(slice / this.slices, stack / this.stacks);
      }
    }

    for (var stack = 0; stack < this.stacks; ++stack) {
      for (var slice = 0; slice < this.slices; ++slice) {
        this.indices.push(
            stack * (this.slices + 1) + slice,
            (stack + 1) * (this.slices + 1) + slice,
            (stack + 1) * (this.slices + 1) + slice + 1);
        this.indices.push(
            stack * (this.slices + 1) + slice,
            (stack + 1) * (this.slices + 1) + slice + 1,
            stack * (this.slices + 1) + slice + 1);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  /**
   * @method updateTexCoords
   * Updates the list of texture coordinates of the sphere
   * @param {Array} coords - Array of texture coordinates
   */
  updateTexCoords(coords) {
    this.texCoords = [...coords];
    this.updateTexCoordsGLBuffers();
  }
}
