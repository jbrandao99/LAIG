/**
 * MyCylinder2
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyCylinder2 extends CGFobject {
    constructor(scene, id, base, top, height, slices, stacks) {
        super(scene);
        this.id = id;
        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        /*
        Half Cylinder
        Points
    
        1       2
    
        0       3
        */
        this.makeSurface(3, 1, [
            [[-this.top, 0, this.height, 1], [-this.base, 0, 0, 1]],
            [[-this.top, this.top * (4 / 3), this.height, 1], [-this.base, this.top * (4 / 3), 0, 1]],
            [[this.top, this.top * (4 / 3), this.height, 1], [this.base, this.top * (4 / 3), 0, 1]],
            [[this.top, 0, this.height, 1], [this.base, 0, 0, 1]]
        ]);
    }

    makeSurface(degree1, degree2, controlvertexes) {
        var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

        this.obj =
            new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbsSurface);
    }

    display() {
        this.scene.pushMatrix();

        this.obj.display();

        this.scene.rotate(Math.PI, 0, 0, 1);

        this.obj.display();

        this.scene.popMatrix();
    }
}
