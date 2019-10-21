/**
* MyCylinder
* @constructor
*/
class MyCylinder extends CGFobject {
  constructor(scene, id, base, top, height, slices, stacks) {
    super(scene);
    this.base = base;
    this.top = top;
    this.slices = slices;
    this.height = height;
    this.stacks = stacks;
    this.initBuffers();
  }
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var ang = 0;
    var alphaAng = 2*Math.PI/this.slices;

    var difRadius = this.top -this.base;
    var stackRadius = difRadius/this.stacks;
    //var tmpRadius = this.base;
    for(var j = 0; j < this.stacks; j++){

      for(var i = 0; i < this.slices; i++){

        var sa = Math.sin(ang) * this.base;
        var saa = Math.sin(ang+alphaAng) * this.base;
        var ca = Math.cos(ang) * this.base;
        var caa = Math.cos(ang+alphaAng) * this.base;

        var sa2 = Math.sin(ang) * (this.base+ stackRadius);
        var saa2 = Math.sin(ang+alphaAng) * (this.base+ stackRadius);
        var ca2 = Math.cos(ang) * (this.base+ stackRadius);
        var caa2 = Math.cos(ang+alphaAng) * (this.base+ stackRadius);

        // vertices of the face of the prism
        this.vertices.push(ca2, sa2, (this.height/this.stacks)*(j+1));
        this.vertices.push(ca, sa, j*(this.height/this.stacks));
        this.vertices.push(caa2, saa2, (this.height/this.stacks)*(j+1));
        this.vertices.push(caa, saa, j*(this.height/this.stacks));

        // normals of the face of the cylinder
        this.normals.push(Math.cos(ang), 0, Math.sin(ang));
        this.normals.push(Math.cos(ang), 0, Math.sin(ang));
        this.normals.push(Math.cos(ang + alphaAng), 0, Math.sin(ang + alphaAng));
        this.normals.push(Math.cos(ang + alphaAng), 0, Math.sin(ang + alphaAng));

        // indices of the face of the cylinder
        this.indices.push(4 * i + (4* (j*this.slices)), (4 * i + 1) + (4* (j*this.slices)), (4 * i + 2) + (4* (j*this.slices)));
        this.indices.push((4 * i + 1) + (4* (j*this.slices)), (4 * i + 3) + (4* (j*this.slices)), (4 * i + 2) + (4* (j*this.slices)));
        this.indices.push((4 * i + 2) + (4* (j*this.slices)), (4 * i + 1) + (4* (j*this.slices)), 4 * i + (4* (j*this.slices)));
        this.indices.push((4 * i + 2) + (4* (j*this.slices)), (4 * i + 3) + (4* (j*this.slices)), (4 * i + 1) + (4* (j*this.slices)));

        // text cords of the face of the cylinder
        this.texCoords.push(i*1.0/this.slices, 0);
        this.texCoords.push(i*1.0/this.slices, 1);
        this.texCoords.push(i*1.0/this.slices + 1.0/this.slices, 0);
        this.texCoords.push(i*1.0/this.slices + 1.0/this.slices, 1);



        ang+=alphaAng;
      }
      this.base+=stackRadius;
      ang = 0;
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  /*
  updateBuffers(complexity){
  this.slices = 4 + Math.round(16 * complexity); //complexity varies 0-1, so slices varies 3-12
  // reinitialize buffers
  this.initBuffers();
  this.initNormalVizBuffers();
}
*/
updateTexCoords(s, t) {}
}
