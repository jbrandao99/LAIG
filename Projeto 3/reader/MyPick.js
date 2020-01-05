
/**
* MyPickableObject
* @constructor
*/
class MyPick extends CGFobject
{
constructor(scene, size)
{
  super(scene);
  this.size = size;
  this.initBuffers();
};

initBuffers()
{
  this.vertices = [
    0,         0,         0,
    this.size, 0,         0,
    0,         this.size, 0,
    this.size, this.size, 0
  ];

  this.indices = [
  0, 1, 2,
  3, 2, 1
  ];

  this.normals = [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1
  ];

  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
  };

  display() {
      if(this.scene.pickMode == true) {
        super.display();
      }
    }

updateTexCoords(s, t) {}
};
