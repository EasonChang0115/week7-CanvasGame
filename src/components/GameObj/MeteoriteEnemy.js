import GameObject from './GameObject';
import Vec2 from '../Canvas/Vector';
import global from '../../util/global.js';

// let enemyType = ['circle', 'triangle', 'meteorite', 'boss'];

class MeteoriteEnemy extends GameObject {
  constructor(args) {
    super(args);
    let def = {
      type: 'triangle',
      r: 35,
      direction: new Vec2(0, 0)
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }
  draw() {
    let ctx = this.ctx;
    ctx.save();
    if (this.type === 'meteorite') {
      ctx.translate(this.p.x, this.p.y);
      ctx.beginPath();
      ctx.moveTo(this.r * Math.cos(0), this.r * Math.sin(0));
      ctx.lineTo(this.r * Math.cos(Math.PI * 2 / 6), this.r * Math.sin(Math.PI * 2 / 6));
      ctx.lineTo((this.r - 5) * Math.cos(Math.PI * 4 / 6), (this.r - 5) * Math.sin(Math.PI * 4 / 6));
      ctx.lineTo(this.r * Math.cos(Math.PI * 6 / 6), this.r * Math.sin(Math.PI * 6 / 6));
      ctx.lineTo(this.r * Math.cos(Math.PI * 8 / 6), this.r * Math.sin(Math.PI * 8 / 6));
      ctx.lineTo((this.r + 19) * Math.cos(Math.PI * 10 / 6), (this.r + 19) * Math.sin(Math.PI * 10 / 6));
      ctx.closePath();
      ctx.fillStyle = global.color.red;
      ctx.fill();
      // 陰影
      ctx.save();
        ctx.beginPath();
        ctx.translate(0 + 20 * Math.cos(this.direction), 0 + 20 * Math.sin(this.direction));
        ctx.arc(0, 0, this.r, 0, Math.PI * 2);
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = global.color.red;
        ctx.fill();
      ctx.restore();

      // 閃電標記
      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.lineTo(-10, -3);
      ctx.lineTo(3, -3);
      ctx.lineTo(0, -20);
      ctx.lineTo(10, 3);
      ctx.lineTo(-3, 3);
      ctx.lineTo(0, 20);
      ctx.fillStyle = 'white';
      ctx.globalAlpha = 1;
      ctx.fill();
    }
    ctx.restore();
  }
  update(time) {
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

export default MeteoriteEnemy;
