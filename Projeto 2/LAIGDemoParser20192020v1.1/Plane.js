/**
 * Plane
 * @constructor
 * @param scene - Reference to MyScene object
 */
class Plane extends CGFobject {
    constructor(scene, id, npartsU, npartsV) {
        super(scene);
        this.id = id;
        this.npartsU = npartsU;
        this.npartsV = npartsV;

        this.makeSurface(1, 1, [
            [[-0.5, 0.0, 0.5, 1], [-0.5, 0.0, -0.5, 1]],
            [[0.5, 0.0, 0.5, 1], [0.5, 0.0, -0.5, 1]]
        ]);
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
