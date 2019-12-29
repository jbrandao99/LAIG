/**
 * MyPlane
 * @constructor
 */
class MyPlane extends CGFobject
{
	constructor(scene, uDiv, vDiv) {
        super(scene);

        this.uDiv = uDiv;
        this.vDiv = vDiv;

        let controlPoints = [
            [
                [-0.5, 0, 0.5, 1],
                [-0.5, 0, -0.5, 1]
            ],

            [
                [0.5, 0, 0.5, 1],
                [0.5, 0, -0.5, 1]
            ]
        ];

        let nurbsSurface = new CGFnurbsSurface(1, 1, controlPoints);
        this.obj = new CGFnurbsObject(this.scene, this.uDiv, this.vDiv, nurbsSurface);
    };

    display() {
        this.obj.display();
    }

    updateTexCoords(s, t) {}

};
