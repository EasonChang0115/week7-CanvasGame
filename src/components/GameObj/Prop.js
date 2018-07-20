import GameObject from './GameObject';

class Prop extends GameObject {
  constructor(args) {
    super(args);
    let def = {
      type: '',
      r: 35
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }
  draw() {
    let ctx = this.ctx;
    ctx.save();
    ctx.translate(this.p.x, this.p.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.save();
    ctx.translate(0 - this.r, 0 - this.r);
    if (this.type === 'heart') {
      let img = new Image();
      img.src = '../../../static/image/heart.png';
      ctx.drawImage(img, 0, 0, this.r * 2, this.r * 2);
    }
    if (this.type === 'defend') {
      let img = new Image();
      img.src = '../../../static/image/defend.png';
      ctx.drawImage(img, 0, 0, this.r * 2, this.r * 2);
    }
    ctx.restore();
    ctx.restore();
  }
  update() {
    this.p.move(this.v.x, this.v.y);
    this.checkBoundary();
  }
}

export default Prop;
