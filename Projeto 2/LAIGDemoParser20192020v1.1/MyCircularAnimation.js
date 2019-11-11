
var degToRad = Math.PI / 180.0;

/**
* MyCircularAnimation
* @constructor
*/
class MyCircularAnimation extends MyAnimation{

  /**
   * @constructor
   */
  constructor(scene, id, time, center, initialAngle, rotationAngle, radius) {
      super(scene, id, time);

      this.center = center;
      this.initialAngle = initialAngle;
      this.rotationAngle = rotationAngle;
      this.initialAngleRad = initialAngle * degToRad;
      this.rotationAngleRad = rotationAngle * degToRad;
      this.radius = radius;
      this.animationVelocity = this.rotationAngleRad / this.time;
      this.currentAngle = this.initialAngleRad;
      this.timeCounter = 0;
  }

  update(deltaTime){
      this.timeCounter += (deltaTime / 1000);

      if(this.timeCounter > this.time)
          this.timeCounter = this.time;

      this.currentAngle = this.initialAngleRad + this.animationVelocity * this.timeCounter;
  }

  apply(){
      this.scene.translate(this.center[0], this.center[1], this.center[2]);
      this.scene.rotate(this.currentAngle, 0, 1, 0);
      this.scene.translate(this.radius, 0, 0);
  }

  clone(){
      return new MyCircularAnimation(this.scene, this.id, this.time, this.center, this.initialAngle, this.rotationAngle, this.radius);
  }
}
