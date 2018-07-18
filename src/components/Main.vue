<template>
  <div class="main">
    <canvas id="mycanvas"></canvas>
    <div class="panel">
      <div class="logo">
        <div class="logo-img" :style="{backgroundImage: 'url(./static/image/logo.svg)'}"></div>
        <div class="text">RADIO Defense</div>
      </div>
      <div class="life">
        <div class="energy-bar">
          <div class="inner" :style="{width: `${energy}%`}"></div>
        </div>
        <div class="hearts">
          <div class="heart" v-for="i in life" :key="i">
            <i class="fas fa-heart"></i>
          </div>
        </div>
      </div>
      <div class="score">
        <div class="battery">
          <div class="head"></div>
          <div class="body">
            <i class="fas fa-bolt"></i>
          </div>
          <div class="bottom"></div>
        </div>
        <div class="ifor">
          <span>已回收</span>
          <br>
          {{ score }} 個能量電池
        </div>
      </div>
      <div class="buttons">
        <div class="block">
          <div class="button shop">S</div>
          <div class="des">Shop</div>
        </div>
        <div class="block">
          <div class="button stop">P</div>
          <div class="des">Pause</div>
        </div>
      </div>
    </div>
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
      score: 0,
      energy: 100,
      life: 3,
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
      enemyBullets: [],
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
      let randomAngle = Math.random() * 360 * Math.PI / 180;
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
       this.bullets.forEach(bullet => {
        bullet.draw();
      });
      this.enemyBullets.forEach(bullet => {
        bullet.draw();
      });

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
        let distanceToP = enemy.p.sub(this.player.p).length;
        if (distanceToP !== global.maxR) {
          let delta = enemy.p.sub(this.player.p);
          let newV = delta.unit.mul(global.maxR);
          TweenMax.to(enemy.p, 1, {x: newV.x, y: newV.y});
        }
        if (distanceToP - global.maxR < 2) {
          let vdirection = enemy.p.sub(this.player.p).unit.angle;
          let deltaA = parseInt(vdirection * 180 / Math.PI) - enemy.speed;
          if (this.time % 100 > 70) {
            deltaA = parseInt(vdirection * 180 / Math.PI) + enemy.speed;
          }
          let newX = global.maxR * Math.cos(deltaA * Math.PI / 180);
          let newY = global.maxR * Math.sin(deltaA * Math.PI / 180);
          TweenMax.to(enemy.p, 0.15, {x: newX, y: newY});
        }
        if (enemy.type === 'circle' && this.time % 40 === 0) {
          let initPosition = enemy.p.clone();
          let initV = this.player.p.sub(enemy.p).unit.mul(enemy.speed * 4);
          console.log(initV);
          let args = {
            ctx: this.ctx,
            p: initPosition,
            v: initV,
            color: global.color.yellow,
            direction: enemy.direction,
            type: 'enemy-circle',
            isDead: false
          };
          this.enemyBullets.push(new Bullet(args));
        }
      });
      this.bullets.forEach(bullet => {
        bullet.update();
      });

      this.enemyBullets.forEach(enemyBullet => {
        enemyBullet.update();
      });
      //  偵測碰撞
      if (this.bullets.length > 0) {
        this.bullets.forEach(bullet => {
          this.enemys.forEach(enemy => {
            if (bullet.collide(enemy)) {
              bullet.isDead = true;
              enemy.isDead = true;
              this.score += 1;
            }
          });
        });
      }
      this.bullets = this.bullets.filter(bullet => !bullet.isDead);
      this.enemys = this.enemys.filter(enemy => !enemy.isDead);
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
        let initPosition = this.player.p.add(new Vec2(this.player.dotR * Math.cos(this.player.v.unit.angle), this.player.dotR * Math.sin(this.player.v.unit.angle)));
        let initV = this.player.v;
        let args = {
          ctx: this.ctx,
          p: initPosition,
          v: initV,
          color: 'white',
          type: 'player',
          isDead: false
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
