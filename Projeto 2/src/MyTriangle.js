/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTriangle extends CGFobject {
  constructor(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    super(scene);

    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;
    this.x3 = x3;
    this.y3 = y3;
    this.z3 = z3;

    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      this.x1, this.y1, this.z1,  // 0
      this.x2, this.y2, this.z2,  // 1
      this.x3, this.y3, this.z3,  // 2
      this.x1, this.y1, this.z1,  // 3
      this.x2, this.y2, this.z2,  // 4
      this.x3, this.y3, this.z3   // 5
    ];

    // Counter-clockwise reference of vertices
    this.indices = [0, 1, 2, 3, 5, 4];

    this.normals = [];
    this.texCoords = [];

    var v1x = this.x3 - this.x1;
    var v1y = this.y3 - this.y1;
    var v1z = this.z3 - this.z1;

    var v2x = this.x2 - this.x1;
    var v2y = this.y2 - this.y1;
    var v2z = this.z2 - this.z1;

    var normal2 = this.crossProduct([v1x, v1y, v1z], [v2x, v2y, v2z]);
    var normal1 = [-normal2[0], -normal2[1], -normal2[2]];

    this.normals.push(...normal1, ...normal1, ...normal1);
    this.normals.push(...normal2, ...normal2, ...normal2);

    this.a = Math.sqrt(
        Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2) +
        Math.pow(this.z2 - this.z1, 2));
    var b = Math.sqrt(
        Math.pow(this.x2 - this.x3, 2) + Math.pow(this.y2 - this.y3, 2) +
        Math.pow(this.z2 - this.z3, 2));
    this.c = Math.sqrt(
        Math.pow(this.x1 - this.x3, 2) + Math.pow(this.y1 - this.y3, 2) +
        Math.pow(this.z1 - this.z3, 2));

    var cosine = ((this.a * this.a) - (b * b) + (this.c * this.c)) /
        (2 * this.a * this.c);
    var sine = Math.sqrt(1 - cosine * cosine);

    var len = Math.max(this.a, this.c * cosine, this.c * sine);
    this.texCoords.push(
        0,
        0,
        this.a / len,
        0,
        (this.c * cosine) / len,
        (this.c * sine) / len,
        0,
        0,
        this.a / len,
        0,
        (this.c * cosine) / len,
        (this.c * sine) / len,
    );

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

  applyScaleFactor(lentgh_S, lentgh_T) {
    this.texCoords[2] = a / lentgh_S;
    this.texCoords[4] = (this.c * cosine) / lentgh_S;
	this.texCoords[5] =  (this.c * sine) / lentgh_T;
	this.texCoords[8] = a / lentgh_S;
    this.texCoords[10] = (this.c * cosine) / lentgh_S;
    this.texCoords[11] =  (this.c * sine) / lentgh_T;

    this.updateTexCoordsGLBuffers();
  }

  normalizeVector(x, y, z) {
    var length = Math.sqrt(x * x + y * y + z * z);
    return [x / length, y / length, z / length];
  }

  crossProduct(v1, v2) {
    return this.normalizeVector(
        v1[1] * v2[2] - v1[2] * v2[1], v1[2] * v2[0] - v1[0] * v2[2],
        v1[0] * v2[1] - v1[1] * v2[0]);
  }
}
