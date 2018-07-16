import Vec2 from '../Canvas/Vector.js';

class GameObject {
  constructor(args) {
    let def = {
      ctx: null,
      p: Vec2.ZERO,
      v: Vec2.ZERO,
      a: Vec2.ZERO,
      speed: 4
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }
  collide(gobj) {}
}

export default GameObject;
