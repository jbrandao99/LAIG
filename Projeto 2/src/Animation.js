/**
 * Animation
 * @constructor
 */
class Animation {
  constructor() {}

  update(t) {
    throw new Error('Method \'update(t)\' must be implemented.');
  }

  apply() {
    throw new Error('Method \'apply()\' must be implemented.');
  }
}
