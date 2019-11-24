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

    this.initKeys();

    return true;
  }

  /**
 *
  // a folder for grouping parameters for one of the lights
 */

  addLightsFolder(lights) {
    var lightsFolder = this.gui.addFolder('Lights');
    lightsFolder.open();

    for (var key in lights) {
      this.scene.lightValues[key] = lights[key][0];
      lightsFolder.add(this.scene.lightValues, key);
    }
  }

  addViews(scene) {
    var viewsKeys = [];
    for (var key in this.scene.views) {
      if (this.scene.views.hasOwnProperty(key)) {
        viewsKeys.push(key);
      }
    }

    var controller = this.gui.add(this.scene, 'currentView', viewsKeys);
    controller.onChange(function (value) {
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