/**
 * MyTower
 * @constructor
 */
class MyTower extends CGFobject {
    constructor(scene,material) {

        super(scene);
        this.material = material;
        this.base = new MyPiece(this.scene, null);
        this.c1 = new MyCylinder(this.scene, null, 1, 1, 1, 100, 100);
        this.c2 = new MyCylinder(this.scene, null, 1, 0, 1, 100, 100);

    }

    display() {

        this.base.display();

        this.scene.pushMatrix();
        this.scene.translate(0, 1, 0);
        this.c1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 2, 0);
        this.c2.display();
        this.scene.popMatrix();
    }
}
