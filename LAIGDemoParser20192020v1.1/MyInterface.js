/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
  /**
  * @constructor
  */
  constructor() {
    super();
  }

  /**
  * Initializes the interface.
  * @param {CGFapplication} application
  */
  init(application) {
    super.init(application);
    // init GUI. For more information on the methods, check:
    //  http://workshop.chromeexperiments.com/examples/gui

    this.gui = new dat.GUI();

    // add a group of controls (and open/expand by defult)


    this.initKeys();

    return true;
  }

  addLightsGroup(lights) {


    var group = this.gui.addFolder("Lights");
    group.open();

    for (var key in lights) {
      if (lights.hasOwnProperty(key)) {
        this.scene.lightValues[key] = lights[key][0];
        group.add(this.scene.lightValues, key);
      }
    }
  }

  addViews(scene){
    var viewsKeys = [];
    for (var key in this.scene.views) {
      if (this.scene.views.hasOwnProperty(key)) {
        viewsKeys.push(key);
      }
    }

    var controller = this.gui.add(this.scene, 'currentView', viewsKeys);
    controller.onChange(function(value){
      scene.changeCamera(scene.currentView);
    });
  }

  /**
  * initKeys
  */
  initKeys() {
    this.scene.gui = this;
    this.processKeyboard = function () { };
    this.activeKeys = {};
  }

  processKeyDown(event) {
    this.activeKeys[event.code] = true;
  };

  processKeyUp(event) {
    this.activeKeys[event.code] = false;
  };

  isKeyPressed(keyCode) {
    return this.activeKeys[keyCode] || false;
  }
}
