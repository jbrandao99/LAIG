/**
 * MyPatch
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyPatch extends CGFobject {
  constructor(scene, id, npointsU, npointsV, npartsU, npartsV, controlPoints) {
    super(scene);
    this.id = id;
    this.npointsU = npointsU;
    this.npointsV = npointsV;
    this.npartsU = npartsU;
    this.npartsV = npartsV;
    this.controlPoints = controlPoints;

    this.makeSurface(this.npointsU - 1, this.npointsV - 1, this.controlPoints);
  }

  makeSurface(degree1, degree2, controlvertexes) {
    var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

    this.obj = new CGFnurbsObject(
        this.scene, this.npartsU, this.npartsV, nurbsSurface);
  }

  display() {
    this.obj.display();
  }
}