/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyCylinder extends CGFobject {
  constructor(scene, id, base, top, height, slices, stacks) {
    super(scene);
    this.base = base;
    this.top = top;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;
    this.initBuffers();
  }
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var r = this.base;
    var delta_r = (this.top - this.base) / this.stacks;
    var sliceAng = 2 * Math.PI / this.slices;
    var delta_z = this.height / this.stacks;
    var m = this.height / (this.base - this.top);
    var maxheight;

    if (this.base > this.top)
      maxheight = this.top * m + this.height;
    else maxheight = this.base * m + this.height;

    for (var i = 0; i <= this.stacks; i++) {
      for (var j = 0; j <= this.slices; j++) {
        this.vertices.push(
          r * Math.cos(j * sliceAng),
          r * Math.sin(j * sliceAng),
          i * delta_z
        );
        if (Math.abs(this.base - this.top) < 0.0001) {
          this.normals.push(Math.cos(j * sliceAng), Math.sin(j * sliceAng), 0);
        } else if (this.base > this.top) {
          this.normals.push(
            maxheight *
            Math.cos(j * sliceAng) /
            Math.sqrt(Math.pow(this.base, 2) + Math.pow(maxheight, 2)),
            maxheight *
            Math.sin(j * sliceAng) /
            Math.sqrt(Math.pow(this.base, 2) + Math.pow(maxheight, 2)),
            this.base /
            Math.sqrt(Math.pow(this.base, 2) + Math.pow(maxheight, 2))
          );
        } else {
          this.normals.push(
            maxheight *
            Math.cos(j * sliceAng) /
            Math.sqrt(Math.pow(this.top, 2) + Math.pow(maxheight, 2)),
            maxheight *
            Math.sin(j * sliceAng) /
            Math.sqrt(Math.pow(this.top, 2) + Math.pow(maxheight, 2)),
            this.top /
            Math.sqrt(Math.pow(this.top, 2) + Math.pow(maxheight, 2))
          );
        }
        this.texCoords.push(j / this.slices, i / this.stacks);
      }
      r = (i + 1) * delta_r + this.base;
    }

    for (var i = 0; i < this.stacks; i++) {
      for (var j = 0; j < this.slices; j++) {
        this.indices.push(
          i * (this.slices + 1) + j,
          i * (this.slices + 1) + (j + 1),
          (i + 1) * (this.slices + 1) + (j + 1)
        );
        this.indices.push(
          (i + 1) * (this.slices + 1) + (j + 1),
          (i + 1) * (this.slices + 1) + j,
          i * (this.slices + 1) + j
        );
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the triangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}
