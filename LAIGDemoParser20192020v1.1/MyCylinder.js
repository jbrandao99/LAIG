class MyCylinder extends CGFobject
{
	constructor(scene, id, base, top, height, slices, stacks)
	{
		super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.top = top;
        this.base = base;
        this.height = height;
        
        this.initBuffers();
	};

  initBuffers()
	{

    this.vertices = [];
    this.indices = [];
    this.normals = [];
	this.texCoords = [];

    var ang=2*Math.PI/this.slices;

  	for(let j =0; j <= this.stacks; j++){
    	for(let i=0; i < this.slices; i++){
         this.vertices.push(Math.cos(ang *i),j*1/this.stacks,Math.sin(ang*i));
         this.normals.push(Math.cos(i*ang),0,Math.sin(i*ang));
	     this.texCoords.push(i*1/this.slices,j*1/this.stacks);
       }
   	}

	 var numPontos=this.stacks*this.slices;

	 for (let i =0; i < numPontos; i++ ){
	   if((i+1)%this.slices==0){
	     this.indices.push(i+1-this.slices,i, i+1);
	     this.indices.push(i+1, i, i+this.slices);
	   }
	   else {
	     this.indices.push(i+1,i, i+1+this.slices);
	     this.indices.push(i+1+this.slices,i, i+this.slices);
	   }
	 }

	 this.primitiveType = this.scene.gl.TRIANGLES;
	 this.initGLBuffers();
	 };
}
