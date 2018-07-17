<template>
  <div class="main">
    <canvas id="mycanvas"></canvas>
  </div>
</template>

<script>
import Vec2 from './Canvas/Vector.js';
import global from '../util/global.js';
import Player from './GameObj/Players.js';
import CircleEnemy from './GameObj/CircleEnemy.js';
import TriangleEnemy from './GameObj/TriangleEnemy.js';
import MeteoriteEnemy from './GameObj/MeteoriteEnemy.js';
import Bullet from './GameObj/Bullet.js';
import { TweenMax } from 'gsap';

export default {
  name: 'Main',
  data () {
    return {
      canvas: null,
      ctx: null,
      ww: 0,
      wh: 0,
      updateFPS: 30,
      time: 0,
      player: null,
      level: 0,
      enemys: [],
      bullets: [],
      mousePos: new Vec2(0, 0),
      mousePosDown: new Vec2(0, 0),
      mousePosUp: new Vec2(0, 0)
    };
  },
  mounted() {
    this.canvas = document.getElementById('mycanvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.circle = function(v, r) {
      this.arc(v.x, v.y, r, 0, Math.PI * 2);
    };
    this.ctx.line = function(v1, v2) {
      this.moveTo(v1.x, v1.y);
      this.lineTo(v2.x, v2.y);
    };
    this.player = new Player({ctx: this.ctx});
    this.enemys = global.Levels[this.level].enemys.map(enemy => {
      let randomAngle = Math.random() * 360;
      let x = global.maxR * 1.5 * Math.cos(randomAngle);
      let y = global.maxR * 1.5 * Math.sin(randomAngle);
      if (enemy === 'circle') {
         return new CircleEnemy({
          ctx: this.ctx,
          p: new Vec2(x, y),
          type: enemy
        });
      }
      if (enemy === 'triangle') {
         return new TriangleEnemy({
          ctx: this.ctx,
          p: new Vec2(x, y),
          type: enemy
        });
      }
      if (enemy === 'meteorite') {
         return new MeteoriteEnemy({
          ctx: this.ctx,
          p: new Vec2(x, y),
          type: enemy
        });
      }
    });
    this.initCanvas();
    this.load();
    window.addEventListener('resize', this.initCanvas);

    // 監聽滑鼠事件
    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('mouseup', this.mouseUp);
    window.addEventListener('mousedown', this.mouseDown);
    window.addEventListener('keydown', this.keydown);
  },
  methods: {
    initCanvas() {
      this.ww = this.canvas.width = window.innerWidth;
      this.wh = this.canvas.height = window.innerHeight;
    },
    gameInit() {},
    render() {
      let ctx = this.ctx;
      // 清空背景
      ctx.fillStyle = global.color.bgBlue;
      ctx.fillRect(0, 0, this.ww, this.wh);
      // --------------------------
      // ---繪製區域
      let center = this.player.p;
      ctx.save();
      ctx.translate(this.ww / 2, this.wh / 2);
      ctx.translate(-center.x, -center.y);
      this.drawLine();
      this.player.draw();
      this.enemys.forEach(enemy => {
        enemy.draw();
      });
      ctx.restore();
      // --------------------------
      // 滑鼠繪製
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.circle(this.mousePos, 3);
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      ctx.translate(this.mousePos.x, this.mousePos.y);
      ctx.strokeStyle = 'red';
      ctx.fillText(this.mousePos, 10, -10);
      ctx.line(new Vec2(-20, 0), new Vec2(20, 0));
      ctx.line(new Vec2(0, -20), new Vec2(0, 20));
      ctx.stroke();
      ctx.restore();
      // 滑鼠繪製 End
      requestAnimationFrame(this.render);
    },
    update() {
      this.time++;
      this.player.update();
      let delta = this.mousePos.sub(new Vec2(this.ww / 2, this.wh / 2)).mul(0.1);
      let deltaLen = delta.length;
      if (deltaLen > this.player.speed) {
        delta = delta.unit.mul(this.player.speed);
      }
      this.player.v = delta;

      this.enemys.forEach(enemy => {
        enemy.update();
        enemy.direction = this.player.p.sub(enemy.p).unit.angle;
        if (enemy.p.sub(this.player.p).length !== global.maxR) {
          let delta = enemy.p.sub(this.player.p);
          let newV = delta.unit.mul(global.maxR);
          TweenMax.to(enemy.p, 2, {x: newV.x, y: newV.y});
        }
        // if (Math.abs(enemy.p.sub(this.player.p).length - global.maxR) < 2) {
        //   let randomAngleV = Math.random * 720 - 360;
        //   let tangV = new Vec2(global.maxR * Math.cos(randomAngleV * Math.PI * 2), global.maxR * Math.sin(randomAngleV * Math.PI * 2));
        //   enemy.v = tangV.unit.mul(enemy.speed);
        // }
      });
    },
    load() {
      this.gameInit();
      this.initCanvas();
      requestAnimationFrame(this.render);
      setInterval(this.update, 1000 / this.updateFPS);
    },
    // 繪製格線
    drawLine() {
      let ctx = this.ctx;
      let gridWidth = 50;
      let gcount = global.width / gridWidth;
      ctx.beginPath();
      for (let i = -gcount / 2; i <= gcount / 2; i++) {
        ctx.moveTo(i * gridWidth, -global.height / 2);
        ctx.lineTo(i * gridWidth, global.height / 2);
        ctx.moveTo(-global.width / 2, i * gridWidth);
        ctx.lineTo(global.width / 2, i * gridWidth);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.stroke();
    },
    mouseMove(evt) {
      this.mousePos.set(evt.x, evt.y);
    },
    mouseUp(evt) {
      this.mousePos.set(evt.x, evt.y);
      this.mousePosUp = this.mousePos.clone();
      // console.log(this.mousePosUp);
    },
    mouseDown(evt) {
      this.mousePos.set(evt.x, evt.y);
      this.mousePosDown = this.mousePos.clone();
      // console.log(this.mousePosDown);
    },
    keydown(evt) {
      if (evt.key === 'w') {
        let args = {
          // p: initPosition,
          // v: mp.v.mul(1.5).add(mouseDelta.unit.mul(Math.random()*5 + 10)),
          // mass: 150,
          // color: mp.color,
          type: 'player'
        };
        this.bullets.push(new Bullet(args));
      }
    }
  }
};
</script>

<style lang='scss'>
@import '../style/components/main.scss';
</style>
