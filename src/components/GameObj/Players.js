import GameObject from './GameObject';
import global from '../../util/global.js';

class Players extends GameObject {
  constructor(args) {
    super(args);
    let def = {
      color: 'white',
      r: 75 / 2,
      defendR: 90,
      dotR: 70,
      isDead: false
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }
  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.p.x, this.p.y);
    // 繪製中間粗圓
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.lineWidth = 8;
    ctx.strokeStyle = this.color;
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 20;
    ctx.stroke();
    // 繪製虛線
    ctx.beginPath();
    for (let i = 1; i <= 360; i += 2) {
      let angle1 = i;
      let angle2 = i - 3;
      let x1 = this.dotR * Math.cos(angle1 * Math.PI / 180);
      let y1 = this.dotR * Math.sin(angle1 * Math.PI / 180);
      let x2 = this.dotR * Math.cos(angle2 * Math.PI / 180);
      let y2 = this.dotR * Math.sin(angle2 * Math.PI / 180);
      if (i % 5 === 0) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
        ctx.stroke();
      }
    }
    // 繪製最大距離的圓
    ctx.beginPath();
    ctx.arc(0, 0, global.maxR, 0, Math.PI * 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.stroke();
    // 繪製中間三條線
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.r * Math.cos(0), this.r * Math.sin(0));
    ctx.moveTo(0, 0);
    ctx.lineTo(this.r * Math.cos(Math.PI * 2 / 3), this.r * Math.sin(Math.PI * 2 / 3));
    ctx.moveTo(0, 0);
    ctx.lineTo(this.r * Math.cos(Math.PI * 4 / 3), this.r * Math.sin(Math.PI * 4 / 3));
    ctx.lineWidth = 4;
    ctx.strokeStyle = this.color;
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.restore();
    // 繪製防護盾
    ctx.save();
    ctx.rotate(this.direction + Math.PI);
    ctx.beginPath();
    ctx.arc(0, 0, this.defendR, -Math.PI / 3 / 2, Math.PI / 3 / 2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.restore();
    // 繪製砲台
    ctx.save();
    ctx.translate(this.dotR * Math.cos(this.direction), this.dotR * Math.sin(this.direction));
    ctx.rotate(this.direction + Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(-6, -18);
    ctx.lineTo(6, -18);
    ctx.lineTo(12, 0);
    ctx.lineTo(12, 18);
    ctx.lineTo(-12, 18);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
    ctx.restore();
  }
  update() {
    // this.p.move(this.v.x, this.v.y);
    this.direction = this.v.unit.angle;
    this.checkBoundary();
  }
  collide(gobj) {}
}

export default Players;
