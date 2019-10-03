var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

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

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

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
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        this.onXMLMinorError("To do: Parse views and create cameras.");

        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

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

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
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
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

		var children = texturesNode.children;

        var textures = [];
        var numTextures = 0;

        for(let i = 0; i < children.length; i++) {
            if(children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            //get the id of the current texture
            var textureId = this.reader.getString(children[i], 'id');
            if (textureId == null)
                return "no ID defined for texture";
                
            // Checks for repeated IDs.
            for(let i = 0; i < textures.length; i++){
                if(textures[i].id == textureId)
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";
            }
            //get the file of the current texture
            var file = this.reader.getString(children[i], 'file');
            if (file == null)
                return "no file defined for " + textureId;

            var newTexture = new CGFtexture(this.scene, file);

            textures.push({
                id: textureId,
                texture: newTexture
            })

            numTextures++;
        }

        if (numTextures == 0)
            return "at least one texture must be defined";

        this. textures = textures;

        this.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        var materials = [];
        var numMaterials = 0;

        for(let i = 0; i < children.length; i++) {
            if(children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            //get the id of the current material
            var materialId = this.reader.getString(children[i], 'id');
            if (materialId == null)
                return "no ID defined for material";
                
            // Checks for repeated IDs.
            for(let i = 0; i < materials.length; i++){
                if(materials[i].id == materialId)
                return "ID must be unique for each material (conflict: ID = " + materialId + ")";
            }

            //get the shininess of the current material
            var shininess = this.reader.getFloat(children[i], 'shininess');
            if (shininess == null || isNaN(shininess) || shininess < 0)
                return "error parsing shininess for " + materialId;

            var grandChildren = children[i].children;

            var nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }
            var emissionIndex = nodeNames.indexOf("emission");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Retrieves the material emission.
            var emission = [];
            if (emissionIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[emissionIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the emission value for ID = " + materialId;
                else
                    emission.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[emissionIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the emission value for ID = " + materialId;
                else
                    emission.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[emissionIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the emission value for ID = " + materialId;
                else
                    emission.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[emissionIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the emission value for ID = " + materialId;
                else
                    emission.push(a);
            }
            else
                return "emission component undefined for ID = " + materialId;

            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient value for ID = " + materialId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient value for ID = " + materialId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient value for ID = " + materialId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient value for ID = " + materialId;
                else
                    ambientIllumination.push(a);
            }
            else
                return "ambient component undefined for ID = " + lightId;

            // Retrieve the diffuse component
            var diffuseIllumination = [];
            if (diffuseIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the diffuse value for ID = " + materialId;
                else
                    diffuseIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the diffuse value for ID = " + materialId;
                else
                    diffuseIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the diffuse value for ID = " + materialId;
                else
                    diffuseIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the diffuse value for ID = " + materialId;
                else
                    diffuseIllumination.push(a);
            }
            else
                return "diffuse component undefined for ID = " + materialId;

            // Retrieve the specular component
            var specularIllumination = [];
            if (specularIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the specular value for ID = " + materialId;
                else
                    specularIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the specular value for ID = " + materialId;
                else
                    specularIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the specular value for ID = " + materialId;
                else
                    specularIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the specular value for ID = " + materialId;
                else
                    specularIllumination.push(a);
            }
            else
                return "specular component undefined for ID = " + materialId;

            var newMaterial = new CGFappearance(this.scene);
            newMaterial.setShininess(shininess);
            newMaterial.setAmbient(ambientIllumination[0], ambientIllumination[1], ambientIllumination[2], ambientIllumination[3]);
            newMaterial.setDiffuse(diffuseIllumination[0], diffuseIllumination[1], diffuseIllumination[2], diffuseIllumination[3]);
            newMaterial.setSpecular(specularIllumination[0], specularIllumination[1], specularIllumination[2], specularIllumination[3]);
            newMaterial.setEmission(emission[0], emission[1], emission[2], emission[3]);
            newMaterial.setTextureWrap('REPEAT','REPEAT');

            materials.push({
                id: materialId,
                material: newMaterial
            });
            
            numMaterials++;
        }

        if (numMaterials == 0)
            return "at least one material must be defined";

        this.materials = materials;

        this.log("Parsed materials");

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

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'rotate':
                        // angle
						 var axis = this.reader.getString(grandChildren[j],'axis');
               			 if(axis != "x" && axis != "y" && axis != "z") return "unable to parse the axis-coordinate. Expected: \"x\", \"y\" or \"z\". Given: \"" + axis + "\" for transformation ID = " + transformationId;
               			
                		var angle = this.reader.getFloat(grandChildren[j],'angle');
                		if(!(angle != null && !isNaN(angle))) 
                    		return "unable to parse angle parameter of the scale transformation with ID = " + transformationId;
                		else
                		{
                    	var angle_rad = angle * 0.017453;

 	                   if(axis == "x") mat4.rotate(transfMatrix, transfMatrix, angle_rad,axis);
    	                else if (axis == "y") mat4.rotate(transfMatrix, transfMatrix, angle_rad,axis);
        	            else mat4.rotate(transfMatrix, transfMatrix, angle_rad,axis);
                }
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
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

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

				this.onXMLMinorError("caralho4");
                this.primitives[primitiveId] = rect;
            }
            
            if (primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 >= y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3) && y3 > y2))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                var tri = new MyTriangle(this.scene, primitiveId, x1, x2, x3, y1, y2, y3, z1, z2, z3);

                this.primitives[primitiveId] = tri;
            }
          
            if (primitiveType == 'cylinder') {

                // base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;
                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var cylind = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);

                this.primitives[primitiveId] = cylind;
            }
           

            if (primitiveType == 'sphere') {

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var sphere = new MySphere(this.scene, primitiveId, radius, slices, stacks);

                this.primitives[primitiveId] = sphere;
            }
            
            if (primitiveType == 'torus') {

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

                // outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                // loops
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

                var torus = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);

                this.primitives[primitiveId] = torus;
            }
            
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        var components = [];

        for(let i = 0; i < children.length; i++) {
            if(children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            //get the id of the current component
            var componentId = this.reader.getString(children[i], 'id');
            if (componentId == null)
                return "no ID defined for component";
                
            // Checks for repeated IDs.
            for(let i = 0; i < components.length; i++){
                if(components[i].id == componentId)
                    return "ID must be unique for each component (conflict: ID = " + componentId + ")";
            }

            var grandChildren = children[i].children;
            if(grandChildren.length != 4) {
                return "There must be a transformation, materials, texture and a children tags in component with ID = " +componentId;
            }

            //Transformation
            var temp = grandChildren[0];
            var componentTransformations = [];
            if(temp.nodeName != "transformation")
                return "missing / out of order transformation tag in component with ID = " + componentId;
            
            var componentTransformationsChildren = temp.children;
            if(componentTransformationsChildren.length != 0){
                if(componentTransformationsChildren[0].nodeName == "transformationref"){
                     componentTransformations = this.transformations[this.reader.getString(componentTransformationsChildren[0],'id')];
                    if(componentTransformations == null)
                        return "no transformation with ID = " + this.reader.getString(componentTransformationsChildren[0],'id');
                }
                else{
                    var innerTransformations = [];
                    var innerTCounter = 0;
                    for(let j = 0; j < componentTransformationsChildren.length; j++) {
                        if(componentTransformationsChildren[j].nodeName == "translate") {
                            // x
                            var x = this.reader.getFloat(componentTransformationsChildren[j], 'x');
                            if (!(x != null && !isNaN(x)))
                                return "unable to parse translation x for the transformations in component with ID = " + componentId;

                            // y
                            var y = this.reader.getFloat(componentTransformationsChildren[j], 'y');
                            if (!(y != null && !isNaN(y)))
                                return "unable to parse translation y for the transformations in component with ID = " + componentId;

                            // z
                            var z = this.reader.getFloat(componentTransformationsChildren[j], 'z');
                            if (!(z != null && !isNaN(z)))
                                return "unable to parse translation z for the transformations in component with ID = " + componentId;
                            
                            innerTransformations.push({type: 1, x: x, y: y, z: z});


                        } else if(componentTransformationsChildren[j].nodeName == "rotate") {
                            // axis
                            var axis = this.reader.getString(componentTransformationsChildren[j], 'axis');
                            if (!(axis != null) || (axis != "x" && axis != "y" && axis != "z"))
                                return "unable to parse rotation axis for the transformations in component with ID = " + componentId;

                            // angle
                            var angle = this.reader.getFloat(componentTransformationsChildren[j], 'angle');
                            if (!(angle != null && !isNaN(angle)))
                                return "unable to parse rotation angle for the transformations in component with ID = " + componentId;
                            
                            innerTransformations.push({type: 2, axis: axis, angle: angle*DEGREE_TO_RAD});

                        } else if(componentTransformationsChildren[j].nodeName == "scale") {
                            // x
                            var x = this.reader.getFloat(componentTransformationsChildren[j], 'x');
                            if (!(x != null && !isNaN(x)))
                                return "unable to parse scale x value for the transformations in component with ID = " + componentId;

                            // y
                            var y = this.reader.getFloat(componentTransformationsChildren[j], 'y');
                            if (!(y != null && !isNaN(y)))
                                return "unable to parse scale y value for the transformations in component with ID = " + componentId;

                            // z
                            var z = this.reader.getFloat(componentTransformationsChildren[j], 'z');
                            if (!(z != null && !isNaN(z)))
                                return "unable to parse scale y value for the transformations in component with ID = " + componentId;
                            
                            innerTransformations.push({type: 3, x: x, y: y, z: z});

                        } else {
                            this.onXMLMinorError("unknown tag <" + componentTransformationsChildren[j].nodeName + ">");
                            continue;
                        }
                        innerTCounter++;
                    }

                    if(innerTCounter == 0) {
                        return "at least one action must be defined for tansformation in component with ID = " + componentId;
                    }

                    this.scene.loadIdentity();
                    for(let i = 0; i < innerTransformations.length; i++){
                        let trans = innerTransformations[i];
                        switch(trans.type){
                            case 1:
                                this.scene.translate(trans.x,trans.y,trans.z);
                                break;
                            case 2:
                                this.scene.rotate(trans.angle, trans.axis == "x" ? 1 : 0, trans.axis == "y" ? 1 : 0, trans.axis == "z" ? 1 : 0);
                                break;
                            case 3:
                                this.scene.scale(trans.x, trans.y, trans.z);
                                break;
                            default: break;
                        }
                    }

                    componentTransformations = this.scene.getMatrix();
                }
            }
            else{
                componentTransformations = null;
            }

            //Materials
            var temp = grandChildren[1];
            var componentMaterials = [];
            if(temp.nodeName != "materials")
                return "missing / out of order materials tag in component with ID = " + componentId;

            var componentMaterialsCounter = 0;
            var componentMaterialChildren = temp.children;
            for (let i = 0; i < componentMaterialChildren.length; i++) {
                var nodeName = componentMaterialChildren[i].nodeName;
                if(nodeName != "material") {
                    this.onXMLMinorError("unknown tag <" + nodeName + ">");
                    continue;
                }

                if(this.reader.getString(componentMaterialChildren[i],'id') == "inherit"){
                    componentMaterials.push({
                        id: "inherit",
                        material: null
                    });
                }
                else{
                    var material = null;
                    for(let n = 0; n < this.materials.length; n++){
                        if(this.materials[n].id == this.reader.getString(componentMaterialChildren[i],'id'))
                            material = this.materials[n];
                    }
                    if(material == null)
                        return "no material with ID = " + this.reader.getString(componentMaterialChildren[i],'id');
                    componentMaterials.push(material);
                }
                componentMaterialsCounter++;
            }
            if(componentMaterialsCounter == 0){
                return "There must be a material in component with ID = " + componentId;
            }

            //Texture
            var temp = grandChildren[2];
            var componentTexture = [];
            if(temp.nodeName != "texture")
                return "missing / out of order texture tag in component with ID = " + componentId;
            
            var textureID = this.reader.getString(temp, 'id');
            var textureLengthS = null;
            var textureLengthT = null;

            if((this.reader.hasAttribute(temp, 'length_s')) && (this.reader.hasAttribute(temp, 'length_s'))){
                textureLengthS = this.reader.getFloat(temp, 'length_s');
                textureLengthT = this.reader.getFloat(temp, 'length_t');
                if(textureLengthS == null || isNaN(textureLengthS) || textureLengthS <= 0 ||
                textureLengthT == null || isNaN(textureLengthT) || textureLengthT <= 0) {
                    return "error parsing lenght_s and/or lenght_t in component with ID = " + componentId + " (must be a number > 0)";
                }
            }
            if(this.reader.hasAttribute(temp, 'length_s') != this.reader.hasAttribute(temp, 'length_t')) {
                return "error on lenght_s and/or lenght_t in component with ID = " + componentId;
            }

            var texture = {id: null, texture: null};

            if(textureID == "inherit"){
                texture.id = "inherit";
            } else if (textureID == "none"){
                texture.id = "none";
            } else{
                if(textureLengthS == null || textureLengthT == null)
                    return "error on lenght_s and/or lenght_t in component with ID = " + componentId;

                for(let i = 0; i < this.textures.length; i++){
                    if(this.textures[i].id == textureID)
                        texture = this.textures[i];
                }
                if(texture == null)
                    return "no texture with ID = " + textureID;
            }

            componentTexture = {
                id: texture.id,
                texture: texture.texture,
                length_s: textureLengthS,
                length_t: textureLengthT
            }
            
            //Children
            var temp = grandChildren[3];
            var componentChildren = [];
            var primitive = [];
            var component = [];
            if(temp.nodeName != "children")
                return "missing / out of order children tag in component with ID = " + componentId;

            var componentChildrenCounter = 0;
            var componentChildrenChildren = temp.children;
            for (let i = 0; i < componentChildrenChildren.length; i++) {
                var nodeName = componentChildrenChildren[i].nodeName;
                if(nodeName != "primitiveref" && nodeName != "componentref") {
                    this.onXMLMinorError("unknown tag <" + nodeName + ">");
                    continue;
                }
                if(nodeName == "componentref"){
                    component.push(this.reader.getString(componentChildrenChildren[i],'id'));
                }
                else{
                    var primitiveID = this.reader.getString(componentChildrenChildren[i],'id');
                    var primitive2 = null;
					
                    for(let i = 0; i < this.primitives.length; i++){
						  this.onXMLMinorError("caralho1");
                        if(this.primitives[i] == primitiveID){
                            primitive2 = this.primitives[i];
							this.onXMLMinorError("caralho2");
							
                        }
                    }
                    if(primitive2 == null){
						this.onXMLMinorError("caralho3");
                        return "no primitive with ID = " + this.reader.getString(componentChildrenChildren[i],'id');
                    }
                    primitive.push(primitive2);
                }
                componentChildrenCounter++;
            }
            if(componentChildrenCounter == 0){
                return "There must be a componentref or/and a primitiveref in the component with ID = " +componentId;
            }
            componentChildren = {
                primitiveref: primitive,
                componentref: component
            }
            
            components.push({
                id: componentId,
                transformations: componentTransformations,
                materials: componentMaterials,
                texture: componentTexture,
                children: componentChildren
            });   
        }

        //Creates Components objects
        var componentsTemp = [];
        components.forEach(function(element) {
            componentsTemp.push(new MyComponent(element.id, element.transformations, element.materials, element.texture, element.children));
        })
        
        //Adding childrens to the components
        for(let i = 0; i < componentsTemp.length; i++){
            var childrens = componentsTemp[i].children.componentref.slice();
            componentsTemp[i].children.componentref = [];
            for(let j = 0; j < childrens.length; j++) {
                var c = componentsTemp.find(function(element) {
                    return element.id == childrens[j];
                });
                if(c == undefined)
                    return "no component with ID = " + childrens[j];
                else if (c.id == componentsTemp[i].id)
                    return "an object can not reference itself as a children (ID = " + c.id + ")";
                componentsTemp[i].addChildren_Component(c);
            }
        }

        this.components = componentsTemp;
        
        this.log("Parsed components");

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
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

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

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

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
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        var rootMaterial;
        if(this.rootComponent.materials[0].id == "inherit")
            rootMaterial = this.materialDefault;
        else{
            rootMaterial = this.rootComponent.materials[0].material;
        }
        var rootTexture = this.rootComponent.texture;

        this.scene.pushMatrix();
        this.displaySceneRecursive(this.rootComponent, rootMaterial, rootTexture);
        this.scene.popMatrix();
    }
    
    displaySceneRecursive(component, materialFather, textureFather, fatherLength_s, fatherLength_t) {
    
        var currComponent = component
    
        var currMaterial = materialFather;
        var currTexture;
        

        if(currComponent.transformations != null)
            this.scene.multMatrix(currComponent.transformations);
        
        var index = this.materialCounter % currComponent.materials.length;
        if(currComponent.materials[index].id != "inherit"){
            currMaterial = currComponent.materials[index].material;
        }

        
        if(currComponent.texture.id == "none")
            currTexture = null;
        else if(currComponent.texture.id == "inherit")
            currTexture = textureFather;
        else
            currTexture = currComponent.texture;


        if(currTexture != null)
            currMaterial.setTexture(currTexture.texture);
        else
            currMaterial.setTexture(null);

        currMaterial.apply();


        var length_s = null;
        var length_t = null;

        if(currComponent.texture.id == "inherit" &&
        currComponent.texture.length_s == null &&
        currComponent.texture.length_t == null){
            length_s = fatherLength_s;
            length_t = fatherLength_t;
        }
        else if(currComponent.texture.id != "none"){
            length_s = currComponent.texture.length_s;
            length_t = currComponent.texture.length_t;
        }

        for (let i = 0; i < currComponent.children.componentref.length; i++) {
                    this.scene.pushMatrix();
                    var children = currComponent.children.componentref[i];
                    this.displaySceneRecursive(children, currMaterial, currTexture, length_s, length_t);
                    this.scene.popMatrix();
        }

        for (let i = 0; i < currComponent.children.primitiveref.length; i++){
            var temp = currComponent.children.primitiveref[i];
            temp.primitive.updateTexCoords(length_s, length_t);
            temp.primitive.display();
        }
    }
	
}
