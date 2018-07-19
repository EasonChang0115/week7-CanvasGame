import GameObject from './GameObject';
import Vec2 from '../Canvas/Vector';
import global from '../../util/global.js';

// let enemyType = ['circle', 'triangle', 'meteorite', 'boss'];

class TriangleEnemy extends GameObject {
  constructor(args) {
    super(args);
    let def = {
      type: 'triangle',
      r: 35,
      direction: new Vec2(0, 0),
      bulletFreq: 80,
      speed: 4
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }
  draw() {
    let ctx = this.ctx;
    ctx.save();
    if (this.type === 'triangle') {
      ctx.translate(this.p.x, this.p.y);
      // 透明大三角
      let shadowRb = this.r + 8;
      ctx.save();
        ctx.beginPath();
        ctx.translate(0 + 8 * Math.cos(this.direction), 0 + 8 * Math.sin(this.direction));
        ctx.moveTo(shadowRb * Math.cos(0), shadowRb * Math.sin(0));
        ctx.lineTo(shadowRb * Math.cos(Math.PI * 2 / 3), shadowRb * Math.sin(Math.PI * 2 / 3));
        ctx.lineTo(shadowRb * Math.cos(Math.PI * 4 / 3), shadowRb * Math.sin(Math.PI * 4 / 3));
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = global.color.blue;
        ctx.fill();
      ctx.restore();
      // 不透明小三角
      ctx.beginPath();
      ctx.moveTo(this.r * Math.cos(0), this.r * Math.sin(0));
      ctx.lineTo(this.r * Math.cos(Math.PI * 2 / 3), this.r * Math.sin(Math.PI * 2 / 3));
      ctx.lineTo(this.r * Math.cos(Math.PI * 4 / 3), this.r * Math.sin(Math.PI * 4 / 3));
      ctx.fillStyle = global.color.blue;
      ctx.fill();

      // 白色小三角
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(-1, -1);
      ctx.lineTo(2, 4);
      ctx.closePath();
      ctx.fillStyle = 'white';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-3, 0);
      ctx.lineTo(-6, -3);
      ctx.lineTo(2, -6);
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
  collide(gobj) {
    return this.p.sub(gobj.p).length < this.r + gobj.r;
  }
}

export default TriangleEnemy;
