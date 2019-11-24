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
   * @param animation
   */
  constructor(id, transformations, materials, texture, children, animation) {
      this.id = id;
      this.transformations = transformations;
      this.materials = materials;
      this.texture = texture;
      this.children = children;
      this.animation = animation;
  }

  /*
   * Adds Children to the Component
   */
  addChildren_Component(component) {
      this.children.componentref.push(component);
  }

}