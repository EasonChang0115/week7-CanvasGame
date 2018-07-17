import GameObject from './GameObject';

class Bullet extends GameObject {
  constructor(args) {
    super(args);
    let def = {
      color: 'white',
      r: 15,
      defendR: 90,
      dotR: 70,
      isDead: false
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }
  draw() {}
  update() {
    // this.p.move(this.v.x, this.v.y);
    this.direction = this.v.unit.angle;
    this.checkBoundary();
  }
  collide(gobj) {}
}

export default Bullet;
