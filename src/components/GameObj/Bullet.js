import GameObject from './GameObject';
import global from '../../util/global.js';

class Bullet extends GameObject {
  constructor(args) {
    super(args);
    let def = {
      color: 'white',
      r: 5,
      isDead: false
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }
  draw() {
    const ctx = this.ctx;
    if (!this.isDead) {
      ctx.save();
      ctx.translate(this.p.x, this.p.y);
      if (this.type === 'player') {
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      if (this.type === 'enemy-circle') {
        ctx.save();
        ctx.translate(0 - Math.cos(this.direction), 0 - Math.sin(this.direction));
        ctx.beginPath();
        ctx.scale(1, 0.5);
        ctx.arc(0, 0, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }
  }
  update() {
    this.p.move(this.v.x, this.v.y);
    this.checkBoundary();
  }
  checkBoundary() {
    if (this.p.x - this.r < -global.width / 2) {
      this.isDead = true;
    }

    if (this.p.x + this.r > global.width / 2) {
      this.isDead = true;
    }

    if (this.p.y - this.r < -global.height / 2) {
      this.isDead = true;
    }

    if (this.p.y + this.r > global.height / 2) {
      this.isDead = true;
    }
  }
  collide(gobj) {
    return this.p.sub(gobj.p).length < this.r + gobj.r;
  }
}

export default Bullet;
