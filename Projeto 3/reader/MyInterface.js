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

  updategameStatusMessage(msg) {
       this.gameOptions.status = msg;
   }

  addCtrlv(scene){
    var group = this.gui.addFolder("Game");
    group.open;

    let GameOptions = function() {
            this.player_vs_player = () => scene.updateGameMode(1);
            this.player_vs_bot    = () => scene.updateGameMode(2);
            this.bot_vs_player    = () => scene.updateGameMode(3);
            this.bot_vs_bot       = () => scene.updateGameMode(4);
            this.undo             = () => scene.undo();
            this.reset            = () => scene.reset();
            this.replay           = () => scene.replay();

            this.maxTime          = 10;

            this.difficulty       = 3;
            this.custom           = false;
            this.depth            = 4;
            this.padding          = 2;
            this.tournament       = false;
            this.width_1          = 4;
            this.width_2          = 3;
            this.width_3          = 2;

            this.status           = "Choose a game mode";
        }

        this.gameOptions = new GameOptions();
        group.add(this.gameOptions, 'status').listen().name("Status");
       group.add(this.gameOptions, 'maxTime', 1, 60).name("Seconds/Turn");

       //game modes
       let gamemodes = group.addFolder("Game Modes");
       gamemodes.open();
       gamemodes.add(this.gameOptions, 'player_vs_player').name("Player vs Player");
       gamemodes.add(this.gameOptions, 'player_vs_bot').name("Player vs Bot");
       gamemodes.add(this.gameOptions, 'bot_vs_player').name("Bot vs Player");
       gamemodes.add(this.gameOptions, 'bot_vs_bot').name("Bot vs Bot");

       //options
       let bot_options = group.addFolder("Options");
       bot_options.add(this.gameOptions, 'difficulty', {Easy: 1, Medium: 2}).name("Difficulty")
       .onChange(value => {
           value = parseInt(value);
           switch (value) {
               case 1:
                   this.gameOptions.depth   = 2;
                   this.gameOptions.padding = 1;
                   this.gameOptions.width_1 = 3;
                   this.gameOptions.width_2 = 3;
                   this.gameOptions.width_3 = 3;
                   break;
               case 2:
                   this.gameOptions.depth   = 3;
                   this.gameOptions.padding = 2;
                   this.gameOptions.width_1 = 4;
                   this.gameOptions.width_2 = 3;
                   this.gameOptions.width_3 = 2;
                   break;
               case 3:
                   this.gameOptions.depth   = 4;
                   this.gameOptions.padding = 2;
                   this.gameOptions.width_1 = 4;
                   this.gameOptions.width_2 = 3;
                   this.gameOptions.width_3 = 2;
                   break;
               case 4:
                   this.gameOptions.depth   = 5;
                   this.gameOptions.padding = 2;
                   this.gameOptions.width_1 = 4;
                   this.gameOptions.width_2 = 3;
                   this.gameOptions.width_3 = 2;
                   break;
               case 5:
                   this.gameOptions.depth   = 6;
                   this.gameOptions.padding = 2;
                   this.gameOptions.width_1 = 5;
                   this.gameOptions.width_2 = 4;
                   this.gameOptions.width_3 = 3;
                   break;
           }
       });




       //actions
       let options = group.addFolder("Actions");
       options.add(this.gameOptions, 'undo').name("Undo");
       options.add(this.gameOptions, 'reset').name("Reset");
       options.add(this.gameOptions, 'replay').name("Replay");
   }

   /**
    * Updates bot settings.
    */
   update_bot_settings(v, bot_settings) {
       if(v) {
           bot_settings.forEach(e => {
               e.domElement.style.pointerEvents = "";
               e.domElement.style.opacity = 1;
           })
       } else {
           bot_settings.forEach(e => {
               e.domElement.style.pointerEvents = "none";
               e.domElement.style.opacity = 0.5;
           })
       }
  }

  /**
     * Adds a dropdown for all the ambients in the scene passed as parameter.
     * @param {CGFscene} scene
     */
    addAmbients(scene){
        var ambients = [];

        for(let i = 0; i < scene.graph.rootComponent.children.componentref.length; i++){
            ambients.push(scene.graph.rootComponent.children.componentref[i].id);
        }

        this.gui.add(this.scene, 'currentAmbient', ambients);
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

    this.gui.add(this.scene, 'currentSecurityCameraView', viewsKeys);
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

  processMouseMove(event) {
        super.processMouseMove(event);
        this.scene.onPick(event);
        this.scene.mouseHoverEvent = true;
    }
}
