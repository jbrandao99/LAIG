/**
* MyRectangle
* @constructor
* @param scene - Reference to MyScene object
* @param x - Scale of rectangle in X
* @param y - Scale of rectangle in Y
*/
class MyRectangle extends CGFobject {
	constructor(scene, id, x1, x2, y1, y2) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.dx = this.x2 - this.x1;
		this.dy = this.y2 - this.y1;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y1, 0,	//1
			this.x1, this.y2, 0,	//2
			this.x2, this.y2, 0		//3
		];

		this.indices = [
			0, 1, 2,
			1, 3, 2,
			1, 0, 2,
			1, 2, 3
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		/*
		Texture coords (s,t)
		+----------> s
		|
		|
		|
		v
		t
		*/

		this.texCoords = [
			0, this.dy,
			this.dx, this.dy,
			0, 0,
			this.dx, 0
		]
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	display() {

		if(this.scene.pickMode == false) {
		  super.display();
		}
	}

	/**
	* @method updateTexCoords
	* Updates the list of texture coordinates of the rectangle
	* @param {Int} length_s - Scaling factor on texture's s axis
	* @param {Int} length_t - Scaling factor on texture's s axis
	*/
	updateTexCoords(length_s, length_t) {
		this.texCoords = [
			0, this.dy / length_t,
			this.dx / length_s, this.dy / length_t,
			0, 0,
			this.dx / length_s, 0
		];
		this.updateTexCoordsGLBuffers();
	}
}
