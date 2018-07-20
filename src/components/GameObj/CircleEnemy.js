import GameObject from './GameObject';
import global from '../../util/global.js';

// let enemyType = ['circle', 'triangle', 'meteorite', 'boss'];

class CircleEnemy extends GameObject {
  constructor(args) {
    super(args);
    let def = {
      type: 'circle',
      r: 30,
      speed: 2,
      bulletFreq: 40
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }
  draw() {
    let ctx = this.ctx;
    ctx.save();
    if (this.type === 'circle') {
      ctx.translate(this.p.x + this.r * Math.cos(this.direction), this.p.y + this.r * Math.sin(this.direction));
      // 透明大圓
      let shadowRb = this.r + 8;
      ctx.save();
        ctx.beginPath();
        ctx.translate(0 + 8 * Math.cos(this.direction), 0 + 8 * Math.sin(this.direction));
        ctx.arc(0, 0, shadowRb, 0, Math.PI * 2);
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = global.color.yellow;
        ctx.fill();
      ctx.restore();
      // 透明小圓
      let shadowRs = this.r - 15;
      ctx.save();
        ctx.translate(0 - 32.5 * Math.cos(this.direction), 0 - 32.5 * Math.sin(this.direction));
        ctx.beginPath();
        ctx.arc(0, 0, shadowRs, 0, Math.PI * 2);
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = global.color.yellow;
        ctx.fill();
      ctx.restore();
      // 中心圓
      ctx.beginPath();
      ctx.arc(0, 0, this.r, 0, Math.PI * 2);
      ctx.globalAlpha = 1;
      ctx.fillStyle = global.color.yellow;
      ctx.fill();
      // 中間圖案
      ctx.beginPath();
      ctx.arc(12, 5, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(-5, -15, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(-8, 19, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(8, 1);
      ctx.lineTo(2, -3);
      ctx.lineTo(-1, -11);
      ctx.lineTo(0, 0);
      ctx.lineTo(-4, 15);
      ctx.lineTo(1, 5);
      ctx.closePath();
      ctx.fillStyle = 'white';
      ctx.fill();
    }
    ctx.restore();
  }
  update(time) {
    this.p.move(this.v.x, this.v.y);
    this.checkBoundary();
  }
}

export default CircleEnemy;
