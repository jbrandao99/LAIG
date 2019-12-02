/**
 * MyCylinder2
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinder2 extends CGFobject
{
	constructor(scene, base, top, heigth, slices, stacks)
	{
		super(scene);

		this.base = base;
		this.top = top;
		this.heigth = heigth;
		this.slices = slices;
		this.stacks = stacks;
		this.controlPoints = [
			[
				[0,-this.base,0,1],
				[-this.base,-this.base,0,Math.sqrt(2)/2],
				[-this.base,0,0,1],
				[-this.base, this.base,0,Math.sqrt(2)/2],
				[0,this.base,0,1],
				[this.base,this.base,0,Math.sqrt(2)/2],
				[this.base,0,0,1],
				[this.base,-this.base,0,Math.sqrt(2)/2],
				[0,-this.base,0,1]
			],
			[
				[0,-this.top,this.heigth,1             ],
				[-this.top,  -this.top,   this.heigth,  Math.sqrt(2)/2],
				[-this.top,  0,  		  this.heigth,  1             ],
				[-this.top,  this.top,    this.heigth,  Math.sqrt(2)/2],
				[0,		     this.top,    this.heigth,  1             ],
				[this.top,   this.top,    this.heigth,  Math.sqrt(2)/2],
				[this.top,	 0,    	      this.heigth,  1             ],
				[this.top,	 -this.top,   this.heigth,  Math.sqrt(2)/2],
				[0, 		 -this.top,   this.heigth,  1             ]
			]
		];

		let nurbsSurface = new CGFnurbsSurface(1, 8, this.controlPoints);
		this.obj = new CGFnurbsObject(this.scene, this.stacks, this.slices, nurbsSurface);
    }

	display(){
		this.obj.display();
	}

	updateTexCoords(s, t) {}

};
