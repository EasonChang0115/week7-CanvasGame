import Vec2 from '../Canvas/Vector.js';

class GameObject {
  constructor(args) {
    let def = {
      ctx: null,
      p: Vec2.ZERO,
      v: Vec2.ZERO,
      a: Vec2.ZERO,
      speed: 4,
      direction: Vec2.ZERO
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }
  checkBoundary() {
    if (this.p.x - this.r < -global.width / 2) {
      this.p.x = -global.width / 2 + this.r;
    }

    if (this.p.x + this.r > global.width / 2) {
      this.p.x = global.width / 2 - this.r;
    }

    if (this.p.y - this.r < -global.height / 2) {
      this.p.y = -global.height / 2 + this.r;
    }

    if (this.p.y + this.r > global.height / 2) {
      this.p.y = global.height / 2 - this.r;
    }
  }
  collide(gobj) {}
}

export default GameObject;
