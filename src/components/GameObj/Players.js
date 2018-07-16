import GameObject from './GameObject';
import Vec2 from '../Canvas/Vector';
import global from '../../util/global.js';

class Players extends GameObject {
  constructor(args) {
    super(args);
    let def = {
      p: new Vec2(0, 0),
      color: 'white',
      r: 75 / 2,
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
  update() {
    this.p.move(this.v.x, this.v.y);
    this.checkBoundary();
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

export default Players;
