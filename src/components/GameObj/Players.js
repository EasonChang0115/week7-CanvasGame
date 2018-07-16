import GameObject from './GameObject';
import Vec2 from '../Canvas/Vector';

class Players extends GameObject {
  constructor(args) {
    super(args);
    let def = {
      p: new Vec2(0, 0),
      color: 'white',
      r: 75,
      maxR: 500,
      defendR: Math.PI / 2
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }
  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.p.x, this.p.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.restore();
  }
  collide(gobj) {}
}

export default Players;
