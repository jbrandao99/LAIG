var DEGREE_TO_RAD = Math.PI / 180;
var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

		 //Camera interface related variables
        this.cameraIDs = [];
        this.selectedCamera = null;
    }

	 initGraphCameras() {
        //Every id is saved so cameras can be manipulated on the interface
        for (var key in this.graph.views) {
            this.cameraIDs.push(key);
        }

        //Currently active camera is set to the default camera
        this.selectedCamera = this.graph.defaultCameraId;
        this.changeCamera();
    }


    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

	 updateCameraNear(){
        this.camera.near = this.cameraNear;
    }

	changeCamera(currentCamera) {
    this.camera = this.views[currentCamera];
    this.interface.setActiveCamera(this.camera);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

	initViews(){
        this.views = [];
        for(var key in this.graph.views){
            var near = this.graph.views[key].near;
            var far = this.graph.views[key].far;
            var angle = this.graph.views[key].angle;
            var left = this.graph.views[key].left;
            var right = this.graph.views[key].right;
            var top = this.graph.views[key].top;
            var bottom = this.graph.views[key].bottom;
            var from = this.graph.views[key].from;
            var to = this.graph.views[key].to;

            if(this.graph.views[key].type == "perspective"){
                this.views[key] = new CGFcamera(angle, near, far, vec3.fromValues(from.x, from.y, from.z), vec3.fromValues(to.x, to.y, to.z));
            }
            else{
                this.views[key] = new CGFcameraOrtho(left, right, bottom, top, near, far, vec3.fromValues(from.x, from.y, from.z), vec3.fromValues(to.x, to.y, to.z), vec3.fromValues(0,1,0));
            }
        }
    }

    /** Handler called when the graph is finally loaded.
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {

		this.initViews();
        this.camera = this.views[this.graph.defaultView];
        this.interface.setActiveCamera(this.camera);

        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

		this.interface.addLightsGroup(this.graph.lights);

		    this.currentView = this.graph.defaultView;
        this.interface.addViews(this);


        this.sceneInited = true;
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation

        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();



         var i = 0;
        for (var key in this.lightValues) {
            if (this.lightValues.hasOwnProperty(key)) {
                if (this.lightValues[key]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                this.lights[i].update();
                i++;
            }
        }

		this.axis.display();

        if (this.sceneInited) {

            // Draw axis
            this.setDefaultAppearance();
			     this.pushMatrix();


            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
			 this.popMatrix();
        }


        // ---- END Background, camera and axis setup
    }
}
