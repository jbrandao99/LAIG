/**
* MyComponent
* @constructor
*/
class MyComponent {

  /**
  * @constructor
  * @param id
  * @param transformations
  * @param materials
  * @param texture
  * @param children
  * @param animations
  */
  constructor(id, transformations, materials, texture, children, animations) {
    this.id = id;
    this.transformations = transformations;
    this.materials = materials;
    this.texture = texture;
    this.children = children;
    this.materialIndex = 0;
    this.animations = animations;
  }

  updateMaterialIndex(component) {
          component.materialIndex = component.materialIndex + 1;
          if (component.materialIndex >= component.materials.length)
              component.materialIndex = 0;
  }

  /*
  * Adds Children to the Component
  */
  addChildren_Component(component) {
    this.children.componentref.push(component);
  }

}
