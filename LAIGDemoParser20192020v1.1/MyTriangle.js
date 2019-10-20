/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of triangle in X
 * @param y - Scale of triangle in Y
 */
class MyTriangle extends CGFobject {
	constructor(scene, id, x1, x2, x3, y1, y2, y3, z1, z2, z3) {
		super(scene);
		this.x1 = x1;
        this.x2 = x2;
        this.x3 = x3;
				this.y1 = y1;
        this.y2 = y2;
        this.y3 = y3;
        this.z1 = z1;
        this.z2 = z2;
        this.z3 = z3;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y1, this.z2,	//1
			this.x3, this.y3, this.z3	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			2, 1, 0, 
		];

		var vector1 = [this.x2 - this.x1, this.y2-this.y1,this.z2-this.z1];
		var vector2 = [this.x3 - this.x2, this.y3-this.y2,this.z3-this.z2];
		var vector3 = [this.x1 - this.x3, this.y1 - this.y3, this.z1 - this.z3];




		var normal =vec3.create() //n - normal ao triangulo
	 vec3.cross(normal, vector1, vector2);
	 vec3.normalize(normal, normal);

	 this.normals = [
		 normal[0], normal[1], normal[2],
		 normal[0], normal[1], normal[2],
		 normal[0], normal[1], normal[2]];


		/*
		Texture coords (s,t)
		+----------> s
        |
        |  FALTA TEXT COORDS
		|
		v
        t
        */

		this.texCoords = []
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	updateTexCoords(s,t) {
		var distA = Math.sqrt(Math.pow(this.x2 - this.x3, 2) + Math.pow(this.y2 - this.y3, 2) + Math.pow(this.z2 - this.z3, 2));
	 var distB = Math.sqrt(Math.pow(this.x1 - this.x3, 2) + Math.pow(this.y2 - this.y3, 2) + Math.pow(this.z2 - this.z3, 2));
	 var distC = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y2, 2) + Math.pow(this.z2 - this.z2, 2));

	 var angBeta = Math.acos((Math.pow(distA, 2) - Math.pow(distB, 2) + Math.pow(distC, 2)) / (2 * distA * distC));

	 var distD = distA * Math.sin(angBeta);

	 this.texCoords = [
		 0, distD/t,
		 distC/s, distD/t,
		 (distC-distA*Math.cos(angBeta))/s,(distD-distA*Math.sin(angBeta))/t
	 ];

		this.updateTexCoordsGLBuffers();
 	 console.log(this.texCoords);
}
}
