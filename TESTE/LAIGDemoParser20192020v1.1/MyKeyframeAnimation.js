/**
 * KeyframeAnimation
 * @constructor
 */
class KeyframeAnimation extends Animation {
  constructor(scene, KeyframeComponents) {
    super();

    if (this.constructor === Animation) {
      throw new TypeError(
          'Abstract class "Animation" cannot be instantiated directly.');
    }

    this.scene = scene;

    this.keyframeComponents = [];

    // Create null keyframe, represents  Initial State
    this.keyframeComponents.push(
        new KeyframeComponent(0, [0, 0, 0], [0, 0, 0], [1, 1, 1]));

    // Add other keyframes
    for (var i = 0; i < KeyframeComponents.length; i++)
      this.keyframeComponents.push(KeyframeComponents[i]);

    // So we know when animation is over
    this.lastKeyframeInstant =
        this.keyframeComponents[this.keyframeComponents.length - 1].instant;
  }

  update(t) {
    // If animation is not over
    if (t <= this.lastKeyframeInstant) {
      // Keyframes to use
      var formerKeyframe;
      var nextKeyframe;

      for (var i = 1; i < this.keyframeComponents.length; i++) {
        if (this.keyframeComponents[i].instant > t) {
          formerKeyframe = this.keyframeComponents[i - 1];
          nextKeyframe = this.keyframeComponents[i];
          break;
        }
      }

      var formerKeyframeInstant = formerKeyframe.instant;
      var nextKeyframeInstant = nextKeyframe.instant;

      var percentageAnimation = (t - formerKeyframeInstant) /
          (nextKeyframeInstant - formerKeyframeInstant);

      var xTranslation = this.lerp(
          formerKeyframe.translation[0], nextKeyframe.translation[0],
          percentageAnimation);
      var yTranslation = this.lerp(
          formerKeyframe.translation[1], nextKeyframe.translation[1],
          percentageAnimation);
      var zTranslation = this.lerp(
          formerKeyframe.translation[2], nextKeyframe.translation[2],
          percentageAnimation);
      var xRotation = this.lerp(
          formerKeyframe.rotation[0], nextKeyframe.rotation[0],
          percentageAnimation);
      var yRotation = this.lerp(
          formerKeyframe.rotation[1], nextKeyframe.rotation[1],
          percentageAnimation);
      var zRotation = this.lerp(
          formerKeyframe.rotation[2], nextKeyframe.rotation[2],
          percentageAnimation);
      var xEscalation = this.lerp(
          formerKeyframe.escalation[0], nextKeyframe.escalation[0],
          percentageAnimation);
      var yEscalation = this.lerp(
          formerKeyframe.escalation[1], nextKeyframe.escalation[1],
          percentageAnimation);
      var zEscalation = this.lerp(
          formerKeyframe.escalation[2], nextKeyframe.escalation[2],
          percentageAnimation);

      // Matrix to apply to objects
      this.animMatrix = mat4.create();

      // Apply translation
      this.animMatrix = mat4.translate(
          this.animMatrix, this.animMatrix,
          [xTranslation, yTranslation, zTranslation]);

      // Apply rotation
      this.animMatrix = mat4.rotate(
          this.animMatrix, this.animMatrix, xRotation * DEGREE_TO_RAD,
          [1, 0, 0]);
      this.animMatrix = mat4.rotate(
          this.animMatrix, this.animMatrix, yRotation * DEGREE_TO_RAD,
          [0, 1, 0]);
      this.animMatrix = mat4.rotate(
          this.animMatrix, this.animMatrix, zRotation * DEGREE_TO_RAD,
          [0, 0, 1]);

      // Apply escalation
      this.animMatrix = mat4.scale(
          this.animMatrix, this.animMatrix,
          [xEscalation, yEscalation, zEscalation]);
    }
  }

  apply() {
    this.scene.multMatrix(this.animMatrix);
  }

  lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
  }
}
