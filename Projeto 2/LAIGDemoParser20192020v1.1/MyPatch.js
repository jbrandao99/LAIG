/**
 * MyPatch
 * @constructor
 */
class MyPatch extends CGFobject
{
	constructor(scene, nPointsU, nPointsV, uDiv, vDiv, controlPoints) {
        super(scene);

        this.uDiv = uDiv;
        this.vDiv = vDiv;
        this.nPointsU = nPointsU;
        this.nPointsV = nPointsV;
        this.uDeg = this.nPointsU - 1;
        this.vDeg = this.nPointsV - 1;

        this.controlPoints = [];
        let i = 0;
        for(let u = 0; u < nPointsU; u++) {
            let uArray = [];
            for(let v = 0; v < nPointsV; v++) {
                uArray.push(controlPoints[i++]);
            }
            this.controlPoints.push(uArray);
        }

        let nurbsSurface = new CGFnurbsSurface(this.uDeg, this.vDeg, this.controlPoints);
        this.obj = new CGFnurbsObject(this.scene, this.uDiv, this.vDiv, nurbsSurface);
    };

    display() {
        this.obj.display();
    }

    updateTexCoords(s, t) {}

};
