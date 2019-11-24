var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var GLOBALS_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
  /**
   * @constructor
   */
  constructor(filename, scene) {
    this.loadedOk = null;

    // Establish bidirectional references between scene and graph.
    this.scene = scene;
    scene.graph = this;

    this.nodes = [];

    this.idRoot = null;  // The id of the root element.

    this.axisCoords = [];
    this.axisCoords['x'] = [1, 0, 0];
    this.axisCoords['y'] = [0, 1, 0];
    this.axisCoords['z'] = [0, 0, 1];

    // File reading
    this.reader = new CGFXMLreader();

    /*
     * Read the contents of the xml file, and refer to this class for loading
     * and error handlers. After the file is read, the reader calls onXMLReady
     * on this object. If any error occurs, the reader calls onXMLError on this
     * object, with an error message
     */
    this.reader.open('scenes/' + filename, this);

    this.mIndex = 0;
    this.lengthSandLengthTset = false;
  }

  /*
   * Callback to be executed after successful reading
   */
  onXMLReady() {
    this.log('XML Loading finished.');
    var rootElement = this.reader.xmlDoc.documentElement;

    // Here should go the calls for different functions to parse the various
    // blocks
    var error = this.parseXMLFile(rootElement);

    if (error != null) {
      this.onXMLError(error);
      return;
    }

    this.loadedOk = true;

    // As the graph loaded ok, signal the scene so that any additional
    // initialization depending on the graph can take place
    this.scene.onGraphLoaded();
  }

  /**
   * Parses the XML file, processing each block.
   * @param {XML root element} rootElement
   */
  parseXMLFile(rootElement) {
    if (rootElement.nodeName != 'lxs') return 'root tag <lxs> missing';

    var nodes = rootElement.children;

    // Reads the names of the nodes to an auxiliary buffer.
    var nodeNames = [];

    for (var i = 0; i < nodes.length; i++) {
      nodeNames.push(nodes[i].nodeName);
    }

    var error;

    // Processes each node, verifying errors.

    // <scene>
    var index;
    if ((index = nodeNames.indexOf('scene')) == -1)
      return 'tag <scene> missing';
    else {
      if (index != SCENE_INDEX)
        this.onXMLMinorError('tag <scene> out of order ' + index);

      // Parse scene block
      if ((error = this.parseScene(nodes[index])) != null) return error;
    }

    // <views>
    if ((index = nodeNames.indexOf('views')) == -1)
      return 'tag <views> missing';
    else {
      if (index != VIEWS_INDEX)
        this.onXMLMinorError('tag <views> out of order');

      // Parse views block
      if ((error = this.parseView(nodes[index])) != null) return error;
    }

    // <globals>
    if ((index = nodeNames.indexOf('globals')) == -1)
      return 'tag <GLOBALS> missing';
    else {
      if (index != GLOBALS_INDEX)
        this.onXMLMinorError('tag <globals> out of order');

      // Parse globals block
      if ((error = this.parseGlobals(nodes[index])) != null) return error;
    }

    // <lights>
    if ((index = nodeNames.indexOf('lights')) == -1)
      return 'tag <lights> missing';
    else {
      if (index != LIGHTS_INDEX)
        this.onXMLMinorError('tag <lights> out of order');

      // Parse lights block
      if ((error = this.parseLights(nodes[index])) != null) return error;
    }
    // <textures>
    if ((index = nodeNames.indexOf('textures')) == -1)
      return 'tag <textures> missing';
    else {
      if (index != TEXTURES_INDEX)
        this.onXMLMinorError('tag <textures> out of order');

      // Parse textures block
      if ((error = this.parseTextures(nodes[index])) != null) return error;
    }

    // <materials>
    if ((index = nodeNames.indexOf('materials')) == -1)
      return 'tag <materials> missing';
    else {
      if (index != MATERIALS_INDEX)
        this.onXMLMinorError('tag <materials> out of order');

      // Parse materials block
      if ((error = this.parseMaterials(nodes[index])) != null) return error;
    }

    // <transformations>
    if ((index = nodeNames.indexOf('transformations')) == -1)
      return 'tag <transformations> missing';
    else {
      if (index != TRANSFORMATIONS_INDEX)
        this.onXMLMinorError('tag <transformations> out of order');

      // Parse transformations block
      if ((error = this.parseTransformations(nodes[index])) != null)
        return error;
    }

    // <animations>
    if ((index = nodeNames.indexOf('animations')) == -1)
      return 'tag <animations> missing';
    else {
      if (index != ANIMATIONS_INDEX)
        this.onXMLMinorError('tag <animations> out of order');

      // Parse animations block
      if ((error = this.parseAnimations(nodes[index])) != null) return error;
    }

    // <primitives>
    if ((index = nodeNames.indexOf('primitives')) == -1)
      return 'tag <primitives> missing';
    else {
      if (index != PRIMITIVES_INDEX)
        this.onXMLMinorError('tag <primitives> out of order');

      // Parse primitives block
      if ((error = this.parsePrimitives(nodes[index])) != null) return error;
    }

    // <components>
    if ((index = nodeNames.indexOf('components')) == -1)
      return 'tag <components> missing';
    else {
      if (index != COMPONENTS_INDEX)
        this.onXMLMinorError('tag <components> out of order');

      // Parse components block
      if ((error = this.parseComponents(nodes[index])) != null) return error;
    }
    this.log('all parsed');
  }

  /**
   * Parses the <scene> block.
   * @param {scene block element} sceneNode
   */
  parseScene(sceneNode) {
    // Get root of the scene.
    var root = this.reader.getString(sceneNode, 'root')
    if (root == null) return 'no root defined for scene';

    this.idRoot = root;

    // Get axis length
    var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
    if (axis_length == null)
      this.onXMLMinorError(
          'no axis_length defined for scene; assuming \'length = 1\'');

    this.referenceLength = axis_length || 1;

    this.log('Parsed scene');

    return null;
  }

  /**
   * Parses the <views> block.
   * @param {view block element} viewsNode
   */
  parseView(viewsNode) {
    this.defaultView = this.reader.getString(viewsNode, 'default');
    if (this.defaultView == null) return 'no default view defined for scene';

    this.views = [];
    var children = viewsNode.children;
    var numViews = 0;

    if (children.length == 0) return 'At least one view must be defined';

    for (var i = 0; i < children.length; i++) {
      // Check type of view
      if (children[i].nodeName != 'perspective' &&
          children[i].nodeName != 'ortho') {
        this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
        return null;
      }

      // Get the id of the current view
      var viewId = this.reader.getString(children[i], 'id');
      if (viewId == null) return 'no ID defined for view';

      // Checks for repeated IDs.
      if (this.views[viewId] != null)
        return 'ID must be unique for each view (conflict: ID = ' + viewId +
            ')';

      // Get the near field value of the current view
      var near = this.reader.getFloat(children[i], 'near');
      if (near == null || isNaN(near))
        return 'No near defined for view with ID' + viewId;

      // Get the far field value of the current view
      var far = this.reader.getFloat(children[i], 'far');
      if (far == null || isNaN(far))
        return 'No far defined for view with ID' + viewId;

      if (children[i].nodeName == 'perspective') {
        // Get the angle field value of the current view
        var angle = this.reader.getFloat(children[i], 'angle');
        if (angle == null || isNaN(angle))
          return 'no angle defined for view with ID' + viewId;

        angle = DEGREE_TO_RAD * angle;
      } else if (children[i].nodeName == 'ortho') {
        // Get the left field value of the current view
        var left = this.reader.getFloat(children[i], 'left');
        if (left == null || isNaN(left))
          return 'no left defined for view with ID' + viewId;

        // Get the right field value of the current view
        var right = this.reader.getFloat(children[i], 'right');
        if (right == null || isNaN(right))
          return 'no right defined for view with ID' + viewId;

        // Get the top field value of the current view
        var top = this.reader.getFloat(children[i], 'top');
        if (top == null || isNaN(top))
          return 'no top defined for view with ID' + viewId;

        // Get the bottom field value of the current view
        var bottom = this.reader.getFloat(children[i], 'bottom');
        if (bottom == null || isNaN(bottom))
          return 'no bottom defined for view with ID' + viewId;
      } else {
        this.onXMLMinorError(
            'View' + viewId + 'must be of ortho or perspective type');
        return null;
      }

      var grandChildren = children[i].children;

      var nodeNames = [];

      for (var j = 0; j < grandChildren.length; j++) {
        nodeNames.push(grandChildren[j].nodeName);
      }
      var fromIndex = nodeNames.indexOf('from');
      var toIndex = nodeNames.indexOf('to');

      if (fromIndex == null || toIndex == null) {
        this.onXMLMinorError(
            'View' + viewId + 'must have \'from\' and \'to\' elements defined');
        continue;
      }

      var from = this.parseCoordinates3D(
          grandChildren[fromIndex],
          '\'From\' element for View with ID ' + viewId);

      var to = this.parseCoordinates3D(
          grandChildren[toIndex], '\'To\' element for View with ID ' + viewId);

      if (!Array.isArray(from)) return from;
      if (!Array.isArray(to)) return to;

      // Adds the camera to the array, depending if ortho or perspective
      if (children[i].nodeName == 'perspective') {
        this.views[viewId] = {
          type: children[i].nodeName,
          near: near,
          far: far,
          angle: angle,
          left: left,
          right: right,
          top: top,
          bottom: bottom,
          from: from,
          to: to
        }
      } else if (children[i].nodeName == 'ortho') {
        var upIndex = nodeNames.indexOf('up');

        if (upIndex == -1) {
          up = [0, 1, 0];
        } else {
          var up = this.parseCoordinates3D(
              grandChildren[upIndex],
              '\'Up\' element for View with ID ' + viewId);
        }

        if (!Array.isArray(up)) return up;

        this.views[viewId] = {
          type: children[i].nodeName,
          near: near,
          far: far,
          angle: angle,
          left: left,
          right: right,
          top: top,
          bottom: bottom,
          from: from,
          to: to,
          up: up
        }
      }

      numViews++;
    }

    if (numViews == 0)
      return 'There must be, at least, one of the following views: perspective, ortho';

    // Get the id of the default view
    if (this.views[this.defaultView] == null) return 'Default view not defined';

    this.log('Parsed views');

    return null;
  }


  /**
   * Parses the <globals> node.
   * @param {globals block element} globalsNode
   */
  parseGlobals(globalsNode) {
    var children = globalsNode.children;

    this.ambient = [];
    this.background = [];

    var nodeNames = [];

    for (var i = 0; i < children.length; i++)
      nodeNames.push(children[i].nodeName);

    var ambientIndex = nodeNames.indexOf('ambient');
    var backgroundIndex = nodeNames.indexOf('background');

    var color = this.parseColor(children[ambientIndex], 'ambient');
    if (!Array.isArray(color))
      return color;
    else
      this.ambient = color;

    color = this.parseColor(children[backgroundIndex], 'background');
    if (!Array.isArray(color))
      return color;
    else
      this.background = color;

    this.log('Parsed globals');

    return null;
  }

  /**
   * Parses the <light> node.
   * @param {lights block element} lightsNode
   */
  parseLights(lightsNode) {
    var children = lightsNode.children;

    this.lights = [];
    var numLights = 0;

    var grandChildren = [];
    var nodeNames = [];

    // Any number of lights.
    for (var i = 0; i < children.length; i++) {
      // Storing light information
      var global = [];
      var attributeNames = [];
      var attributeTypes = [];

      // Check type of light
      if (children[i].nodeName != 'omni' && children[i].nodeName != 'spot') {
        this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
        continue;
      } else {
        attributeNames.push(...['location', 'ambient', 'diffuse', 'specular']);
        attributeTypes.push(...['position', 'color', 'color', 'color']);
      }

      // Get id of the current light.
      var lightId = this.reader.getString(children[i], 'id');
      if (lightId == null) return 'no ID defined for light';

      // Checks for repeated IDs.
      if (this.lights[lightId] != null)
        return 'ID must be unique for each light (conflict: ID = ' + lightId +
            ')';

      // Light enable/disable
      var enableLight = true;
      var aux = this.reader.getBoolean(children[i], 'enabled');
      if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
        this.onXMLMinorError(
            'unable to parse value component of the \'enable light\' field for ID = ' +
            lightId + '; assuming \'value = 1\'');

      enableLight = aux && 1;

      // Add enabled boolean and type name to light info
      global.push(enableLight);
      global.push(children[i].nodeName);

      grandChildren = children[i].children;
      // Specifications for the current light.

      nodeNames = [];
      for (var j = 0; j < grandChildren.length; j++) {
        nodeNames.push(grandChildren[j].nodeName);
      }

      for (var j = 0; j < attributeNames.length; j++) {
        var attributeIndex = nodeNames.indexOf(attributeNames[j]);

        if (attributeIndex != -1) {
          if (attributeTypes[j] == 'position')
            var aux = this.parseCoordinates4D(
                grandChildren[attributeIndex],
                'light position for ID' + lightId);
          else
            var aux = this.parseColor(
                grandChildren[attributeIndex],
                attributeNames[j] + ' illumination for ID' + lightId);

          if (!Array.isArray(aux)) return aux;

          global.push(aux);
        } else
          return 'light ' + attributeNames[i] +
              ' undefined for ID = ' + lightId;
      }

      // Gets the additional attributes of the spot light
      if (children[i].nodeName == 'spot') {
        var angle = this.reader.getFloat(children[i], 'angle');
        if (!(angle != null && !isNaN(angle)))
          return 'unable to parse angle of the light for ID = ' + lightId;

        var exponent = this.reader.getFloat(children[i], 'exponent');
        if (!(exponent != null && !isNaN(exponent)))
          return 'unable to parse exponent of the light for ID = ' + lightId;

        var targetIndex = nodeNames.indexOf('target');

        // Retrieves the light target.
        var targetLight = [];
        if (targetIndex != -1) {
          var aux = this.parseCoordinates3D(
              grandChildren[targetIndex], 'target light for ID ' + lightId);
          if (!Array.isArray(aux)) return aux;

          targetLight = aux;
        } else
          return 'light target undefined for ID = ' + lightId;

        global.push(...[angle, exponent, targetLight])
      }

      this.lights[lightId] = global;
      numLights++;
    }

    if (numLights == 0)
      return 'at least one light must be defined';
    else if (numLights > 8)
      this.onXMLMinorError(
          'too many lights defined; WebGL imposes a limit of 8 lights');

    this.log('Parsed lights');
    return null;
  }

  /**
   * Parses the <textures> block.
   * @param {textures block element} texturesNode
   */
  parseTextures(texturesNode) {
    var children = texturesNode.children;

    this.textures = [];
    var numTextures = 0;

    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != 'texture') {
        this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
        continue;
      }

      // Get current texture id
      var textureId = this.reader.getString(children[i], 'id');
      if (textureId == null) return 'no ID defined for texture';

      // Check if theres a repeated id
      if (this.textures[textureId] != null)
        return 'ID must be unique for each texture (conflict: ID = ' +
            textureId + ')';

      // Get File of texture
      var file = this.reader.getString(children[i], 'file');
      if (file == null)
        return 'failed to parse texture file for texture ID = \'' + id + '\'';

      var texture = new CGFtexture(this.scene, file);

      this.textures.push({id: textureId, texture: texture})

      numTextures++;
    }

    if (numTextures == 0) return 'At least one texture must be defined';

    this.log('Parsed textures');

    return null;
  }

  /**
   * Parses the <materials> node.
   * @param {materials block element} materialsNode
   */
  parseMaterials(materialsNode) {
    var children = materialsNode.children;

    this.materials = [];

    var grandChildren = [];
    var nodeNames = [];

    var numMaterials = 0;

    // Any number of materials.
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != 'material') {
        this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
        continue;
      }

      // Get id of the current material.
      var materialID = this.reader.getString(children[i], 'id');
      if (materialID == null) return 'no ID defined for material';

      // Checks for repeated IDs.
      if (this.materials[materialID] != null)
        return 'ID must be unique for each material (conflict: ID = ' +
            materialID + ')';

      // Get shininess
      var shininess = this.reader.getFloat(children[i], 'shininess');
      if (shininess == null || isNaN(shininess) || shininess < 0)
        return 'error parsing shininess for ' + materialID;

      grandChildren = children[i].children;

      for (var j = 0; j < grandChildren.length; j++) {
        nodeNames.push(grandChildren[j].nodeName);
      }

      var emissionIndex = nodeNames.indexOf('emission');
      var ambientIndex = nodeNames.indexOf('ambient');
      var diffuseIndex = nodeNames.indexOf('diffuse');
      var specularIndex = nodeNames.indexOf('specular');

      if (emissionIndex == -1 || ambientIndex == -1 || diffuseIndex == -1 ||
          specularIndex == -1)
        return 'material with ID' + materialID + 'has undefined components';

      var emission = this.parseColor(grandChildren[emissionIndex], 'emission');
      if (!Array.isArray(emission)) return emission;

      var ambient = this.parseColor(grandChildren[ambientIndex], 'ambient');
      if (!Array.isArray(ambient)) return ambientIllumination;

      var diffuse = this.parseColor(grandChildren[diffuseIndex], 'diffuse');
      if (!Array.isArray(diffuse)) return diffuse;

      var specular = this.parseColor(grandChildren[specularIndex], 'specular');
      if (!Array.isArray(specular)) return specular;

      var newMaterial = new CGFappearance(this.scene);
      newMaterial.setShininess(shininess);
      newMaterial.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
      newMaterial.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
      newMaterial.setSpecular(
          specular[0], specular[1], specular[2], specular[3]);
      newMaterial.setEmission(
          emission[0], emission[1], emission[2], emission[3]);
      newMaterial.setTextureWrap('REPEAT', 'REPEAT');

      this.materials.push({id: materialID, material: newMaterial});

      numMaterials++;
    }

    if (numMaterials == 0) return 'At least one material must be defined';

    this.log('Parsed materials');

    return null;
  }

  /**
   * Parses the <transformations> block.
   * @param {transformations block element} transformationsNode
   */
  parseTransformations(transformationsNode) {
    var children = transformationsNode.children;

    this.transformations = [];
    var grandChildren = [];

    var numTransformations = 0;

    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != 'transformation') {
        this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
        continue;
      }

      // Get id of the current transformation.
      var transformationID = this.reader.getString(children[i], 'id');
      if (transformationID == null) return 'no ID defined for transformation';

      // Checks for repeated IDs.
      if (this.transformations[transformationID] != null)
        return 'ID must be unique for each transformation (conflict: ID = ' +
            transformationID + ')';

      grandChildren = children[i].children;

      // Specifications for the current transformation.

      var transfMatrix = mat4.create();

      for (var j = 0; j < grandChildren.length; j++) {
        switch (grandChildren[j].nodeName) {
          case 'translate':

            var coordinates = this.parseCoordinates3D(
                grandChildren[j],
                'translate transformation for ID ' + transformationID);
            if (!Array.isArray(coordinates)) return coordinates;

            transfMatrix =
                mat4.translate(transfMatrix, transfMatrix, coordinates);

            break;
          case 'scale':

            var coordinates = this.parseCoordinates3D(
                grandChildren[j],
                'scale transformation for ID ' + transformationID);
            if (!Array.isArray(coordinates)) return coordinates;

            transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);

            break;
          case 'rotate':

            var axis = this.reader.getString(grandChildren[j], 'axis');
            var angle = this.reader.getFloat(grandChildren[j], 'angle');

            if (angle == null || isNaN(angle))
              return 'Invalid angle in rotation transformation in transformation with ID ' +
                  transformationID;

            if (axis == 'x')
              transfMatrix = mat4.rotate(
                  transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, [1, 0, 0]);
            else if (axis == 'y')
              transfMatrix = mat4.rotate(
                  transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, [0, 1, 0]);
            else if (axis == 'z')
              transfMatrix = mat4.rotate(
                  transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, [0, 0, 1]);
            else
              return 'Axis must be x, y or z! axis = ' + axis +
                  ' in rotation transformation in transformation with ID ' +
                  transformationID;
            break;
          default:
            this.onXMLMinorError(
                'unknown transformation <' + grandChildren[j].nodeName + '>');
            break;
        }
      }

      this.transformations[transformationID] = transfMatrix;

      numTransformations++;
    }

    if (numTransformations == 0)
      return 'At least one transformation must be defined';

    this.log('Parsed transformations');

    return null;
  }

  /**
   * Parses the <animations> block.
   * @param {animations block element} animationsNode
   */
  parseAnimations(animationsNode) {
    var children = animationsNode.children;

    this.animations = [];
    var grandChildren = [];
    var grandgrandChildren = [];

    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != 'animation') {
        this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
        continue;
      }

      // Get id of the current animation.
      var animationID = this.reader.getString(children[i], 'id');
      if (animationID == null) return 'no ID defined for animation';

      // Checks for repeated IDs.
      if (this.animations[animationID] != null)
        return 'ID must be unique for each animation (conflict: ID = ' +
            animationID + ')';

      grandChildren = children[i].children;

      if (grandChildren.length == 0)
        return 'No keyframes defined for animation with ID ' + animationID;

      var keyframes = []

          // Go trough keyframes
          for (var j = 0; j < grandChildren.length; j++) {
        if (grandChildren[j].nodeName != 'keyframe') {
          this.onXMLMinorError(
              'unknown tag <' + grandChildren[i].nodeName + '>');
          continue;
        }

        // Get instant of the current keyframe.
        var instant = this.reader.getFloat(grandChildren[j], 'instant');
        if (instant == null || instant < 0)
          return 'Keyframe instant must be >= 0 in animation with ID ' +
              animationID;

        grandgrandChildren = grandChildren[j].children;

        if (grandgrandChildren.length != 3)
          return 'keyframe must have translate, rotate and scale elements in animation with ID ' +
              animationID;

        if (grandgrandChildren[0].nodeName != 'translate' ||
            grandgrandChildren[1].nodeName != 'rotate' ||
            grandgrandChildren[2].nodeName != 'scale')
          return 'keyframe must have translate, rotate and scale elements in animation with ID ' +
              animationID;


        // Get transformation
        var translateCoordinates = this.parseCoordinates3D(
            grandgrandChildren[0],
            'translate in animation with ID ' + animationID);

        // Get rotation
        var angle_x = this.reader.getFloat(grandgrandChildren[1], 'angle_x');
        var angle_y = this.reader.getFloat(grandgrandChildren[1], 'angle_y');
        var angle_z = this.reader.getFloat(grandgrandChildren[1], 'angle_z');

        if (angle_x == null || isNaN(angle_x) || angle_y == null ||
            isNaN(angle_y) || angle_z == null || isNaN(angle_z))
          return 'keyframe must have valid rotation values in animation with ID ' +
              animationID;

        var rotationInEachAngle = [angle_x, angle_y, angle_z];

        // Get escalation
        var escalationCoordinates = this.parseCoordinates3D(
            grandgrandChildren[2],
            'escalation in animation with ID ' + animationID);

        keyframes.push(new KeyframeComponent(
            instant, translateCoordinates, rotationInEachAngle,
            escalationCoordinates));
      }

      var animation = new KeyframeAnimation(this.scene, keyframes);
      this.animations[animationID] = animation;
    }

    this.log('Parsed animations');

    return null;
  }

  /**
   * Parses the <primitives> block.
   * @param {primitives block element} primitivesNode
   */
  parsePrimitives(primitivesNode) {
    var children = primitivesNode.children;

    this.primitives = [];

    var grandChildren = [];

    // Any number of primitives.
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != 'primitive') {
        this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
        continue;
      }

      // Get id of the current primitive.
      var primitiveId = this.reader.getString(children[i], 'id');
      if (primitiveId == null) return 'no ID defined for texture';

      // Checks for repeated IDs.
      if (this.primitives[i] != null)
        return 'ID must be unique for each primitive (conflict: ID = ' +
            primitiveId + ')';

      grandChildren = children[i].children;

      // Validate the primitive type
      if (grandChildren.length != 1 ||
          (grandChildren[0].nodeName != 'rectangle' &&
           grandChildren[0].nodeName != 'triangle' &&
           grandChildren[0].nodeName != 'cylinder' &&
           grandChildren[0].nodeName != 'sphere' &&
           grandChildren[0].nodeName != 'torus' &&
           grandChildren[0].nodeName != 'plane' &&
           grandChildren[0].nodeName != 'patch' &&
           grandChildren[0].nodeName != 'cylinder2')) {
        return 'There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)'
      }

      // Specifications for the current primitive.
      var primitiveType = grandChildren[0].nodeName;

      // Retrieves the primitive coordinates.
      if (primitiveType == 'rectangle') {
        // x1
        var x1 = this.reader.getFloat(grandChildren[0], 'x1');
        if (!(x1 != null && !isNaN(x1)))
          return 'unable to parse x1 of the primitive coordinates for ID = ' +
              primitiveId;

        // y1
        var y1 = this.reader.getFloat(grandChildren[0], 'y1');
        if (!(y1 != null && !isNaN(y1)))
          return 'unable to parse y1 of the primitive coordinates for ID = ' +
              primitiveId;

        // x2
        var x2 = this.reader.getFloat(grandChildren[0], 'x2');
        if (!(x2 != null && !isNaN(x2) && x2 > x1))
          return 'unable to parse x2 of the primitive coordinates for ID = ' +
              primitiveId;

        // y2
        var y2 = this.reader.getFloat(grandChildren[0], 'y2');
        if (!(y2 != null && !isNaN(y2) && y2 > y1))
          return 'unable to parse y2 of the primitive coordinates for ID = ' +
              primitiveId;

        var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

        this.primitives.push(
            {id: primitiveId, type: 'rectangle', primitive: rect});
      } else if (primitiveType == 'triangle') {
        // x1
        var x1 = this.reader.getFloat(grandChildren[0], 'x1');
        if (!(x1 != null && !isNaN(x1)))
          return 'unable to parse x1 of the primitive coordinates for ID = ' +
              primitiveId;

        // y1
        var y1 = this.reader.getFloat(grandChildren[0], 'y1');
        if (!(y1 != null && !isNaN(y1)))
          return 'unable to parse y1 of the primitive coordinates for ID = ' +
              primitiveId;

        // z1
        var z1 = this.reader.getFloat(grandChildren[0], 'z1');
        if (!(z1 != null && !isNaN(z1)))
          return 'unable to parse z1 of the primitive coordinates for ID = ' +
              primitiveId;


        // x2
        var x2 = this.reader.getFloat(grandChildren[0], 'x2');
        if (!(x2 != null && !isNaN(x2)))
          return 'unable to parse x2 of the primitive coordinates for ID = ' +
              primitiveId;

        // y2
        var y2 = this.reader.getFloat(grandChildren[0], 'y2');
        if (!(y2 != null && !isNaN(y2)))
          return 'unable to parse y2 of the primitive coordinates for ID = ' +
              primitiveId;

        // z2
        var z2 = this.reader.getFloat(grandChildren[0], 'z2');
        if (!(z2 != null && !isNaN(z2)))
          return 'unable to parse z2 of the primitive coordinates for ID = ' +
              primitiveId;

        // x3
        var x3 = this.reader.getFloat(grandChildren[0], 'x3');
        if (!(x3 != null && !isNaN(x3)))
          return 'unable to parse x3 of the primitive coordinates for ID = ' +
              primitiveId;

        // y3
        var y3 = this.reader.getFloat(grandChildren[0], 'y3');
        if (!(y3 != null && !isNaN(y3)))
          return 'unable to parse y3 of the primitive coordinates for ID = ' +
              primitiveId;

        // z3
        var z3 = this.reader.getFloat(grandChildren[0], 'z3');
        if (!(z3 != null && !isNaN(z3)))
          return 'unable to parse z3 of the primitive coordinates for ID = ' +
              primitiveId;
        var tri = new MyTriangle(
            this.scene, primitiveId, x1, y1, z1, x2, y2, z2, x3, y3, z3);

        this.primitives.push(
            {id: primitiveId, type: 'triangle', primitive: tri});
      } else if (primitiveType == 'cylinder') {
        // base
        var base = this.reader.getFloat(grandChildren[0], 'base');
        if (!(base != null && !isNaN(base)))
          return 'unable to parse base of the primitive coordinates for ID = ' +
              primitiveId;

        // top
        var top = this.reader.getFloat(grandChildren[0], 'top');
        if (!(top != null && !isNaN(top)))
          return 'unable to parse top of the primitive coordinates for ID = ' +
              primitiveId;

        // height
        var height = this.reader.getFloat(grandChildren[0], 'height');
        if (!(height != null && !isNaN(height)))
          return 'unable to parse height of the primitive coordinates for ID = ' +
              primitiveId;

        // slices
        var slices = this.reader.getFloat(grandChildren[0], 'slices');
        if (!(slices != null && !isNaN(slices) && Number.isInteger(slices)))
          return 'unable to parse slices of the primitive coordinates for ID = ' +
              primitiveId;

        // stacks
        var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
        if (!(stacks != null && !isNaN(stacks) && Number.isInteger(stacks)))
          return 'unable to parse stacks of the primitive coordinates for ID = ' +
              primitiveId;

        var cyl = new MyCylinder(
            this.scene, primitiveId, base, top, height, slices, stacks);

        this.primitives.push(
            {id: primitiveId, type: 'cylinder', primitive: cyl});
      } else if (primitiveType == 'sphere') {
        // radius
        var radius = this.reader.getFloat(grandChildren[0], 'radius');
        if (!(radius != null && !isNaN(radius)))
          return 'unable to parse radius of the primitive coordinates for ID = ' +
              primitiveId;

        // slices
        var slices = this.reader.getFloat(grandChildren[0], 'slices');
        if (!(slices != null && !isNaN(slices) && Number.isInteger(slices)))
          return 'unable to parse slices of the primitive coordinates for ID = ' +
              primitiveId;

        // stacks
        var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
        if (!(stacks != null && !isNaN(stacks) && Number.isInteger(stacks)))
          return 'unable to parse stacks of the primitive coordinates for ID = ' +
              primitiveId;

        var sph = new MySphere(this.scene, primitiveId, radius, slices, stacks);

        this.primitives.push({id: primitiveId, type: 'sphere', primitive: sph});
      } else if (primitiveType == 'torus') {
        // inner
        var inner = this.reader.getFloat(grandChildren[0], 'inner');
        if (!(inner != null && !isNaN(inner)))
          return 'unable to parse inner of the primitive coordinates for ID = ' +
              primitiveId;

        // outer
        var outer = this.reader.getFloat(grandChildren[0], 'outer');
        if (!(outer != null && !isNaN(outer)))
          return 'unable to parse outer of the primitive coordinates for ID = ' +
              primitiveId;

        // slices
        var slices = this.reader.getFloat(grandChildren[0], 'slices');
        if (!(slices != null && !isNaN(slices) && Number.isInteger(slices)))
          return 'unable to parse slices of the primitive coordinates for ID = ' +
              primitiveId;

        // loops
        var loops = this.reader.getFloat(grandChildren[0], 'loops');
        if (!(loops != null && !isNaN(loops) && Number.isInteger(loops)))
          return 'unable to parse loops of the primitive coordinates for ID = ' +
              primitiveId;

        var tor =
            new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);

        this.primitives.push({id: primitiveId, type: 'torus', primitive: tor});
      } else if (primitiveType == 'plane') {
        // npartsU
        var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
        if (!(npartsU != null && !isNaN(npartsU) && Number.isInteger(npartsU)))
          return 'unable to parse npartsU of the primitive coordinates for ID = ' +
              primitiveId;

        // npartsV
        var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
        if (!(npartsV != null && !isNaN(npartsV) && Number.isInteger(npartsV)))
          return 'unable to parse npartsV of the primitive coordinates for ID = ' +
              primitiveId;

        var plane = new Plane(this.scene, primitiveId, npartsU, npartsV);

        this.primitives.push(
            {id: primitiveId, type: 'plane', primitive: plane});
      } else if (primitiveType == 'patch') {
        // npointsU
        var npointsU = this.reader.getFloat(grandChildren[0], 'npointsU');
        if (!(npointsU != null && !isNaN(npointsU) &&
              Number.isInteger(npointsU)))
          return 'unable to parse npointsU of the primitive coordinates for ID = ' +
              primitiveId;

        // npointsV
        var npointsV = this.reader.getFloat(grandChildren[0], 'npointsV');
        if (!(npointsV != null && !isNaN(npointsV) &&
              Number.isInteger(npointsV)))
          return 'unable to parse npointsV of the primitive coordinates for ID = ' +
              primitiveId;

        // npartsU
        var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
        if (!(npartsU != null && !isNaN(npartsU) && Number.isInteger(npartsU)))
          return 'unable to parse npartsU of the primitive coordinates for ID = ' +
              primitiveId;

        // npartsV
        var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
        if (!(npartsV != null && !isNaN(npartsV) && Number.isInteger(npartsV)))
          return 'unable to parse npartsV of the primitive coordinates for ID = ' +
              primitiveId;


        var controlPointsList = grandChildren[0].children;

        var controlPoints = [];

        for (var j = 0; j < npointsU; j++) {
          var pointsV = [];
          for (var k = 0; k < npointsV; k++) {
            pointsV.push([
              this.reader.getFloat(controlPointsList[j * npointsV + k], 'xx'),
              this.reader.getFloat(controlPointsList[j * npointsV + k], 'yy'),
              this.reader.getFloat(controlPointsList[j * npointsV + k], 'zz'),
              1.0
            ]);
          }
          controlPoints.push(pointsV);
        }

        var patch = new MyPatch(
            this.scene, primitiveId, npointsU, npointsV, npartsU, npartsV,
            controlPoints);

        this.primitives.push(
            {id: primitiveId, type: 'patch', primitive: patch});
      } else if (primitiveType == 'cylinder2') {
        // base
        var base = this.reader.getFloat(grandChildren[0], 'base');
        if (!(base != null && !isNaN(base)))
          return 'unable to parse base of the primitive coordinates for ID = ' +
              primitiveId;

        // top
        var top = this.reader.getFloat(grandChildren[0], 'top');
        if (!(top != null && !isNaN(top)))
          return 'unable to parse top of the primitive coordinates for ID = ' +
              primitiveId;

        // height
        var height = this.reader.getFloat(grandChildren[0], 'height');
        if (!(height != null && !isNaN(height)))
          return 'unable to parse height of the primitive coordinates for ID = ' +
              primitiveId;

        // slices
        var slices = this.reader.getFloat(grandChildren[0], 'slices');
        if (!(slices != null && !isNaN(slices) && Number.isInteger(slices)))
          return 'unable to parse slices of the primitive coordinates for ID = ' +
              primitiveId;

        // stacks
        var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
        if (!(stacks != null && !isNaN(stacks) && Number.isInteger(stacks)))
          return 'unable to parse stacks of the primitive coordinates for ID = ' +
              primitiveId;

        var cyl2 = new MyCylinder2(
            this.scene, primitiveId, base, top, height, slices, stacks);

        this.primitives.push(
            {id: primitiveId, type: 'cylinder2', primitive: cyl2});
      }
    }

    this.log('Parsed primitives');
    return null;
  }

  /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
  parseComponents(componentsNode) {
    var children = componentsNode.children;

    var components = [];

    var grandChildren = [];
    var grandgrandChildren = [];
    var nodeNames = [];

    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != 'component') {
        this.onXMLMinorError('unknown tag <' + children[i].nodeName + '>');
        continue;
      }

      // Get id of the current component.
      var componentId = this.reader.getString(children[i], 'id');
      if (componentId == null) return 'no ID defined for component';

      // Checks for repeated IDs.
      if (components[componentId] != null)
        return 'ID must be unique for each component (conflict: ID = ' +
            componentId + ')';

      grandChildren = children[i].children;

      nodeNames = [];  // transformation, materials, ...
      for (var j = 0; j < grandChildren.length; j++) {
        nodeNames.push(grandChildren[j].nodeName);
      }

      var transformationIndex = nodeNames.indexOf('transformation');
      var materialsIndex = nodeNames.indexOf('materials');
      var animationIndex = nodeNames.indexOf('animationref');
      var textureIndex = nodeNames.indexOf('texture');
      var childrenIndex = nodeNames.indexOf('children');

      ///////////////////
      // Transformations
      ///////////////////

      if (transformationIndex == -1)
        return 'No transformation block for component with ID ' + componentId;

      grandgrandChildren = grandChildren[transformationIndex].children;

      var transformation = mat4.create();

      for (var j = 0; j < grandgrandChildren.length; j++) {
        if (grandgrandChildren[j].nodeName == 'transformationref') {
          // Get transformation with given ID
          var transformationrefID =
              this.reader.getString(grandgrandChildren[j], 'id');

          var transformationref = this.transformations[transformationrefID];

          if (transformationref == null) {
            this.onXMLError(
                'No transformation with ID ' + transformationrefID +
                ' exists (component with ID ' + componentId + ')');
            return null;
          }

          // Apply Transformation
          transformation =
              mat4.multiply(transformation, transformation, transformationref);

        } else {
          switch (grandgrandChildren[j].nodeName) {
            case 'translate':

              var coordinates = this.parseCoordinates3D(
                  grandgrandChildren[j],
                  'translate transformation in component with ID ' +
                      componentId);
              if (!Array.isArray(coordinates)) return coordinates;

              transformation =
                  mat4.translate(transformation, transformation, coordinates);

              break;
            case 'scale':

              var coordinates = this.parseCoordinates3D(
                  grandgrandChildren[j],
                  'scale transformation in component with ID ' + componentId);
              if (!Array.isArray(coordinates)) return coordinates;

              transformation =
                  mat4.scale(transformation, transformation, coordinates);

              break;
            case 'rotate':

              var axis = this.reader.getString(grandgrandChildren[j], 'axis');
              var angle = this.reader.getFloat(grandgrandChildren[j], 'angle');

              if (angle == null || isNaN(angle))
                return 'Invalid angle in rotation transformation in component with ID ' +
                    componentId;

              if (axis == 'x')
                transformation = mat4.rotate(
                    transformation, transformation, angle * DEGREE_TO_RAD,
                    [1, 0, 0]);
              else if (axis == 'y')
                transformation = mat4.rotate(
                    transformation, transformation, angle * DEGREE_TO_RAD,
                    [0, 1, 0]);
              else if (axis == 'z')
                transformation = mat4.rotate(
                    transformation, transformation, angle * DEGREE_TO_RAD,
                    [0, 0, 1]);
              else
                return 'Axis must be x, y or z! axis = ' + axis +
                    ' in rotation transformation in component with ID ' +
                    componentId;

              break;
            default:
              this.onXMLMinorError(
                  'unknown transformation <' + grandgrandChildren[i].nodeName +
                  '>');
              break;
          }
        }
      }

      var componentTransformations = transformation;

      ///////////////////
      // Animations
      ///////////////////

      var componentAnimation = [];

      if (animationIndex == -1) {
        componentAnimation = {animationref: null};
      } else {
        var animationID =
            this.reader.getString(grandChildren[animationIndex], 'id');

        var animation = this.animations[animationID];

        if (animation == null) {
          this.onXMLError(
              'Couldn\'t find animation with ID ' + animationID +
              ' in component with ID ' + componentId);
          return null;
        }

        componentAnimation = {animationref: animation};
      }

      ///////////////////
      // Materials
      ///////////////////

      if (materialsIndex == -1)
        return 'No materials block for component with ID ' + componentID;

      grandgrandChildren = grandChildren[materialsIndex].children;

      var componentMaterials = [];

      var nrcomponentMaterials = 0;

      for (var j = 0; j < grandgrandChildren.length; j++) {
        if (grandgrandChildren[j].nodeName == 'material') {
          // Get Material ID
          var materialID = this.reader.getString(grandgrandChildren[j], 'id');

          if (materialID == 'inherit') {
            componentMaterials.push({id: 'inherit', material: null});
          } else {
            var material = null;

            for (var k = 0; k < this.materials.length; k++) {
              if (this.materials[k].id == materialID)
                material = this.materials[k];
            }
            if (material == null) return 'no material with ID = ' + materialID;
            componentMaterials.push(material);
          }

          nrcomponentMaterials++;
        } else
          this.onXMLMinorError(
              'Must have material tag inside materials in component with ID ' +
              componentID);
      }

      if (nrcomponentMaterials == 0) {
        this.onXMLError(
            'Must have at least 1 material in component with ID ' +
            componentId);
        return null;
      }

      ///////////////////
      // Texture
      ///////////////////

      if (textureIndex == -1)
        return 'No texture block for component with ID ' + componentID;

      // Gets Texture ID
      var textureID = this.reader.getString(grandChildren[textureIndex], 'id');

      var componentTexture = [];

      var textureLengthS = null;
      var textureLengthT = null;

      if ((this.reader.hasAttribute(grandChildren[textureIndex], 'length_s')) &&
          (this.reader.hasAttribute(grandChildren[textureIndex], 'length_t'))) {
        textureLengthS =
            this.reader.getFloat(grandChildren[textureIndex], 'length_s');
        textureLengthT =
            this.reader.getFloat(grandChildren[textureIndex], 'length_t');

        if (textureLengthS == null || isNaN(textureLengthS) ||
            textureLengthS <= 0 || textureLengthT == null ||
            isNaN(textureLengthT) || textureLengthT <= 0) {
          return 'lenght_s and/or lenght_t have incorrect values in component with ID ' +
              componentId;
        }
      }

      if (this.reader.hasAttribute(grandChildren[textureIndex], 'length_s') !=
          this.reader.hasAttribute(grandChildren[textureIndex], 'length_t')) {
        return 'Must have both or none lenght_s and lenght_t defined in component with ID ' +
            componentId;
      }

      var texture = {id: null, texture: null};

      if (textureID == 'inherit')
        texture.id = 'inherit';
      else if (textureID == 'none')
        texture.id = 'none';
      else {
        if (textureLengthS == null || textureLengthT == null)
          return 'Error on lenght_s and/or lenght_t in component with ID = ' +
              componentId;

        for (var j = 0; j < this.textures.length; j++)
          if (this.textures[j].id == textureID) texture = this.textures[j];

        if (texture == null) return 'No texture with ID ' + textureID;
      }

      componentTexture = {
        id: texture.id,
        texture: texture.texture,
        length_s: textureLengthS,
        length_t: textureLengthT
      }

      ///////////////////
      // Children
      ///////////////////

      if (childrenIndex == -1)
      return 'No children block for component with ID ' + componentID;

      grandgrandChildren = grandChildren[childrenIndex].children;

      var componentChildren = [];
      var primitive = [];
      var component = [];
      var nrcomponentChildren = 0;

      for (var j = 0; j < grandgrandChildren.length; j++) {
        // Get Children ID
        var childrenID = this.reader.getString(grandgrandChildren[j], 'id');

        if (grandgrandChildren[j].nodeName == 'componentref')
          component.push(childrenID);
        else if (grandgrandChildren[j].nodeName == 'primitiveref') {
          var primitive2 = null;

          for (var k = 0; k < this.primitives.length; k++)
            if (this.primitives[k].id == childrenID)
              primitive2 = this.primitives[k];

          if (primitive2 == null) {
            this.onXMLError(
                'Couldn\'t find primitive child with ID ' + childrenID +
                ' in component with ID ' + componentID);
            return null;
          }

          primitive.push(primitive2);
        } else {
          this.onXMLMinorError(
              'Must have componentref or primitiveref tag inside childrem in component with ID ' +
              componentID);
          break;
        }

        nrcomponentChildren++;
      }
      if (nrcomponentChildren == 0) {
        return 'There must be a componentref or/and a primitiveref in the component with ID ' +
            componentId;
      }

      componentChildren = {primitiveref: primitive, componentref: component}

                          components.push({
                            id: componentId,
                            transformations: componentTransformations,
                            materials: componentMaterials,
                            texture: componentTexture,
                            children: componentChildren,
                            animation: componentAnimation,
                          });
    }

    ///////////////////
    // Creates Components objects
    ///////////////////

    var componentsTemp = [];

    components.forEach(function(element) {
      componentsTemp.push(new MyComponent(
          element.id, element.transformations, element.materials,
          element.texture, element.children, element.animation));
    })

    // Adding childrens to the components
    for (var i = 0; i < componentsTemp.length; i++) {
      var childrens = componentsTemp[i].children.componentref.slice();
      componentsTemp[i].children.componentref = [];
      for (var j = 0; j < childrens.length; j++) {
        var c = componentsTemp.find(function(element) {
          return element.id == childrens[j];
        });
        if (c == undefined)
          return 'No component with ID = ' + childrens[j];
        else if (c.id == componentsTemp[i].id)
          return 'An object can not reference itself as a children (ID = ' +
              c.id + ')';
        componentsTemp[i].addChildren_Component(c);
      }
    }

    this.components = componentsTemp;

    this.log('Parsed components');

    return null;
  }


  /**
   * Parse the coordinates from a node with ID = id
   * @param {block element} node
   * @param {message to be displayed in case of error} messageError
   */
  parseCoordinates3D(node, messageError) {
    var position = [];

    // x
    var x = this.reader.getFloat(node, 'x');
    if (!(x != null && !isNaN(x)))
      return 'unable to parse x-coordinate of the ' + messageError;

    // y
    var y = this.reader.getFloat(node, 'y');
    if (!(y != null && !isNaN(y)))
      return 'unable to parse y-coordinate of the ' + messageError;

    // z
    var z = this.reader.getFloat(node, 'z');
    if (!(z != null && !isNaN(z)))
      return 'unable to parse z-coordinate of the ' + messageError;

    position.push(...[x, y, z]);

    return position;
  }

  /**
   * Parse the coordinates from a node with ID = id
   * @param {block element} node
   * @param {message to be displayed in case of error} messageError
   */
  parseCoordinates4D(node, messageError) {
    var position = [];

    // Get x, y, z
    position = this.parseCoordinates3D(node, messageError);

    if (!Array.isArray(position)) return position;


    // w
    var w = this.reader.getFloat(node, 'w');
    if (!(w != null && !isNaN(w)))
      return 'unable to parse w-coordinate of the ' + messageError;

    position.push(w);

    return position;
  }

  /**
   * Parse the color components from a node
   * @param {block element} node
   * @param {message to be displayed in case of error} messageError
   */
  parseColor(node, messageError) {
    var color = [];

    // R
    var r = this.reader.getFloat(node, 'r');
    if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
      return 'unable to parse R component of the ' + messageError;

    // G
    var g = this.reader.getFloat(node, 'g');
    if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
      return 'unable to parse G component of the ' + messageError;

    // B
    var b = this.reader.getFloat(node, 'b');
    if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
      return 'unable to parse B component of the ' + messageError;

    // A
    var a = this.reader.getFloat(node, 'a');
    if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
      return 'unable to parse A component of the ' + messageError;

    color.push(...[r, g, b, a]);

    return color;
  }

  /*
   * Callback to be executed on any read error, showing an error on the
   * console.
   * @param {string} message
   */
  onXMLError(message) {
    console.error('XML Loading Error: ' + message);
    this.loadedOk = false;
  }

  /**
   * Callback to be executed on any minor error, showing a warning on the
   * console.
   * @param {string} message
   */
  onXMLMinorError(message) {
    console.warn('Warning: ' + message);
  }

  /**
   * Callback to be executed on any message.
   * @param {string} message
   */
  log(message) {
    console.log('   ' + message);
  }

  /**
   * Displays the scene, processing each node, starting in the root node.
   */
  displayScene() {
    // Get Root Component
    for (var i = 0; i < this.components.length; i++)
      if (this.components[i].id == this.idRoot)
        this.rootComponent = this.components[i];

    var rootMaterial;

    if (this.rootComponent.materials[0].id == 'inherit')
      rootMaterial = this.materials[0];
    else
      rootMaterial = this.rootComponent.materials[0].material;

    var rootTexture = this.rootComponent.texture;

    this.scene.pushMatrix();

    this.displayRecursive(this.rootComponent, rootMaterial, rootTexture);

    this.scene.popMatrix();
  }

  displayRecursive(component, fatherMaterial, fatherTexture) {
    var thisComponent = component;

    // Apply Transformations
    if (thisComponent.transformations != null)
      this.scene.multMatrix(thisComponent.transformations);

    // Apply animation
    if (thisComponent.animation.animationref != null)
      thisComponent.animation.animationref.apply();


    // Set Material
    var thisMaterial;

    var materialIndex = this.mIndex % thisComponent.materials.length;
    if (thisComponent.materials[materialIndex].id == 'inherit')
      thisMaterial = fatherMaterial;
    else
      thisMaterial = thisComponent.materials[materialIndex].material;

    // Set Texture
    var thisTexture;

    if (thisComponent.texture.id == 'none') {
      thisTexture = null;
      thisMaterial.setTexture(null);
    } else if (thisComponent.texture.id == 'inherit') {
      if (fatherTexture == null)
        thisMaterial.setTexture(null);
      else {
        thisTexture = fatherTexture;
        thisMaterial.setTexture(thisTexture.texture);
      }
    } else {
      thisTexture = thisComponent.texture;
      thisMaterial.setTexture(thisTexture.texture);
    }

    // Apply Material
    thisMaterial.apply();

    // Call Recursive Function to display children
    if (thisComponent.children.componentref.length > 0)
      for (var i = 0; i < thisComponent.children.componentref.length; i++) {
        this.scene.pushMatrix();

        this.displayRecursive(
            thisComponent.children.componentref[i], thisMaterial, thisTexture);

        this.scene.popMatrix();
      }

    // Display primitives
    if (thisComponent.children.primitiveref.length > 0)
      for (var i = 0; i < thisComponent.children.primitiveref.length; i++) {
        thisComponent.children.primitiveref[i].primitive.display();
      }
  }

  changeMaterials() {
    this.mIndex++;
  }

  setLengthSandLengthT() {
    this.setRecursive(this.rootComponent, null, null);
  }

  setRecursive(component, fatherLength_s, fatherLength_t) {
    var thisComponent = component;

    var thisLength_s;
    var thisLength_t;

    if (thisComponent.texture.id == 'none') {
      thisLength_s = null;
      thisLength_t = null;
    } else if (thisComponent.texture.id == 'inherit') {
      if (fatherLength_s == null && fatherLength_t == null) {
        thisLength_s = null;
        thisLength_t = null;
      } else {
        thisLength_s = fatherLength_s;
        thisLength_t = fatherLength_t;
      }
    } else {
      thisLength_s = thisComponent.texture.length_s;
      thisLength_t = thisComponent.texture.length_t;
    }

    if (thisComponent.children.componentref.length > 0)
      for (var i = 0; i < thisComponent.children.componentref.length; i++) {
        this.setRecursive(
            thisComponent.children.componentref[i], thisLength_s, thisLength_t);
      }

    // Set LenghtS and LengthT
    if (thisComponent.children.primitiveref.length > 0)
      for (var i = 0; i < thisComponent.children.primitiveref.length; i++) {
        if (thisComponent.children.primitiveref[i].primitive instanceof
                MyRectangle ||
            thisComponent.children.primitiveref[i].primitive instanceof
                MyTriangle) {
          thisComponent.children.primitiveref[i].primitive.applyScaleFactor(
              thisLength_s, thisLength_t);
        }
      }
  }
}
