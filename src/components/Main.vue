<template>
  <div class="main">
    <canvas id="mycanvas"></canvas>
    <div class="start-panel" :style="{display: start ? 'none' : ''}">
      <div class="circle-run">
        <div class="ball-scale-multiple">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="block">
        <div class="center">
          <div class="logo">
            <div class="battery-img" :style="{backgroundImage: 'url(./static/image/battery.svg)'}"></div>
            <div class="logo-img" :style="{backgroundImage: 'url(./static/image/logo.svg)'}"></div>
          </div>
          <div class="text">Radio Defense</div>
          <button class="btn" @click="GameStart">Start Game</button>
        </div>
        <div class="game-text">
          <p>
            你身負著運送能量電池的任務
            <br>
            卻遭到幾何星人的埋伏
            <br>
            請協助從他們的手中奪回能量電池
          </p>
        </div>
        <div class="circle-img" :style="{backgroundImage: 'url(./static/image/circle.svg)'}"></div>
        <div class="triangle-img" :style="{backgroundImage: 'url(./static/image/triangle.svg)'}"></div>
        <div class="meteorite-img" :style="{backgroundImage: 'url(./static/image/meteorite.svg)'}"></div>
      </div>
    </div>
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
      <div class="level-time">
        <div class="level">{{ `Wave ${level + 1}`}}</div>
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
        <div class="block" :class="pause ? 'pause' : ''">
          <div class="button stop">P</div>
          <div class="des">Pause</div>
        </div>
      </div>
    </div>
    <div class="end-panel fadeIn" :style="{display: isGameover ? 'flex' : 'none'}">
      <div class="out-block">
        <div class="block">
          <div class="left">
            <div class="battery-img" :style="{backgroundImage: 'url(./static/image/battery.svg)'}"></div>
          </div>
          <div class="right">
            <div class="little-text">你回收了</div>
            <div class="text">{{ score }}個能量電池</div>
            <button class="btn" @click="gameInit">Restart</button>
          </div>
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
import LittleMeteoriteEnemy from './GameObj/LittleMeteoriteEnemy.js';
import Bullet from './GameObj/Bullet.js';
import Prop from './GameObj/Prop.js';
import { TweenMax } from 'gsap';

export default {
  name: 'Main',
  data () {
    return {
      score: 0,
      energy: 100,
      life: 3,
      pause: false,
      isGameover: false,
      start: false,
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
      props: [],
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
    gameInit() {
      this.score = 0;
      this.energy = 100;
      this.life = 3;
      this.isGameover = false;
      this.start = false;
      this.pause = false;
      this.level = 0;
      this.enemys = [];
    },
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
      this.props.forEach(prop => {
        prop.draw();
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
      if (this.pause) return;
      if (this.isGameover) return;
      if (!this.start) return;
      this.time++;
      this.player.update();
      // 處理玩家方向
      let delta = this.mousePos.sub(new Vec2(this.ww / 2, this.wh / 2)).mul(0.1);
      let deltaLen = delta.length;
      if (deltaLen > this.player.speed) {
        delta = delta.unit.mul(this.player.speed);
      }
      this.player.v = delta;

      // 處理敵人更新
      this.enemys.forEach((enemy, index) => {
        enemy.update();
        enemy.direction = enemy.p.sub(this.player.p).unit.angle;
        if (enemy.type !== 'meteorite' && enemy.type !== 'littlemeteorite') {
          let distanceToP = enemy.p.sub(this.player.p).length;
          if (distanceToP !== global.maxR) {
            let delta = enemy.p.sub(this.player.p);
            let newV = delta.unit.mul(global.maxR);
            TweenMax.to(enemy.p, 1, {x: newV.x, y: newV.y});
          }
          // 隨機移動位置
          if (distanceToP - global.maxR < 2) {
            let vdirection = enemy.p.sub(this.player.p).unit.angle;
            let deltaA = parseInt(vdirection * 180 / Math.PI) - enemy.speed * index / 3 - enemy.speed;
            if (this.time % (100 * (index + 1) / 2) > 60) {
              deltaA = parseInt(vdirection * 180 / Math.PI) + enemy.speed + enemy.speed / 3 * index;
            }
            let newX = global.maxR * Math.cos(deltaA * Math.PI / 180);
            let newY = global.maxR * Math.sin(deltaA * Math.PI / 180);
            TweenMax.to(enemy.p, 0.15, {x: newX, y: newY});
          }
        } else if (enemy.type === 'meteorite') {
          let delta = this.player.p.sub(enemy.p);
          let newV = delta.unit.mul(enemy.speed);
          // TweenMax.to(enemy.p, index * 2.5 + 10, {x: newV.x, y: newV.y});
          enemy.v = newV;
        }
        // 圓形敵人發射子彈
        if (enemy.type === 'circle' && this.time % (enemy.bulletFreq + (index * enemy.bulletFreq * 0.5)) === 0) {
          let initPosition = enemy.p.clone();
          let initV = this.player.p.sub(enemy.p).unit.mul(enemy.speed * 4);
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
        // 三角形敵人發射子彈
        if (enemy.type === 'triangle' && this.time % (enemy.bulletFreq + (index * enemy.bulletFreq * 0.5)) === 0) {
          let initPosition = enemy.p.clone();
          let initV = this.player.p.sub(enemy.p).unit.mul(enemy.speed * 4);
          let args = {
            ctx: this.ctx,
            p: initPosition,
            v: initV,
            color: global.color.blue,
            direction: enemy.direction,
            type: 'enemy-traingle',
            isDead: false
          };
          this.enemyBullets.push(new Bullet(args));
        }
        if (enemy.collide(this.player)) {
          enemy.isDead = true;
          this.lifeHurt(50);
        }
      });
      // 處理玩家子彈更新
      this.bullets.forEach(bullet => {
        bullet.update();
      });
      // 處理敵人子彈更新
      this.enemyBullets.forEach(enemyBullet => {
        enemyBullet.update();
      });
      // 偵測玩家子彈碰撞
      if (this.bullets.length > 0) {
        this.bullets.forEach(bullet => {
          this.enemys.forEach(enemy => {
            if (bullet.collide(enemy)) {
              bullet.isDead = true;
              enemy.isDead = true;
              if (enemy.type === 'meteorite') {
                let newV = enemy.v;
                let newMeteorite1 = new LittleMeteoriteEnemy({
                  ctx: this.ctx,
                  p: enemy.p.clone(),
                  v: newV.clone()
                });
                let newMeteorite2 = new LittleMeteoriteEnemy({
                  ctx: this.ctx,
                  p: enemy.p.clone(),
                  v: newV.clone()
                });
                this.enemys.push(newMeteorite1);
                this.enemys.push(newMeteorite2);
                TweenMax.to(newMeteorite1.p, 1, {x: enemy.p.x + Math.random() * 150, y: enemy.p.y + Math.random() * 260});
                TweenMax.to(newMeteorite2.p, 1, {x: enemy.p.x + Math.random() * 150, y: enemy.p.y + Math.random() * 260});
              }
              this.score += 1;
            }
          });
        });
      }
      // 敵人子彈是否打到防護罩 && 是否打到玩家
      if (this.enemyBullets.length > 0) {
        this.enemyBullets.forEach(enemyBullet => {
          // 敵人子彈是否打到防護罩
          let enemyBulletDeg = enemyBullet.direction * 180 / Math.PI >= 0 ? enemyBullet.direction * 180 / Math.PI : enemyBullet.direction * 180 / Math.PI + 360;
          let defendDegS = this.player.direction * 180 / Math.PI + this.player.defendDeg;
          defendDegS = defendDegS > 0 ? defendDegS : defendDegS + 360;
          let deltaS = 0;
          if (Math.abs(enemyBulletDeg - defendDegS) > 180) {
            deltaS = 360 - Math.abs(enemyBulletDeg - defendDegS);
          } else {
            deltaS = Math.abs(enemyBulletDeg - defendDegS);
          }
          let defendDegE = defendDegS + this.player.defendArc;
          defendDegE = defendDegE % 360;
          let deltaE = 0;
          if (Math.abs(enemyBulletDeg - defendDegE) > 180) {
            deltaE = 360 - Math.abs(enemyBulletDeg - defendDegE);
          } else {
            deltaE = Math.abs(enemyBulletDeg - defendDegE);
          }
          let enemyBulletDis = enemyBullet.p.sub(this.player.p).length;
          if ((deltaS + deltaE) <= this.player.defendArc && !enemyBullet.isDead && enemyBulletDis < this.player.defendR) {
            enemyBullet.isDead = true;
          }
          if (enemyBullet.type === 'enemy-traingle' && Math.random() < 0.1) {
            let angle = Math.PI * 2 * Math.random();
            let len = enemyBullet.speed;
            let newV = new Vec2(Math.cos(angle) * len, Math.sin(angle) * len);
            enemyBullet.v = newV;
          }
          // 是否打到玩家
          if (enemyBullet.collide(this.player)) {
            enemyBullet.isDead = true;
            this.lifeHurt(25);
          }
        });
      }
      // 隨機新增道具
      if (Math.random() * 350 < 1) {
        this.addProps();
      }
      // 處理道具更新
      this.props.forEach(prop => {
        prop.update();
      });
      this.props.forEach(prop => {
        if (prop.collide(this.player)) {
          prop.isDead = true;
          if (prop.type === 'heart' && this.life < 3) {
            this.life += 1;
          }
          if (prop.type === 'defend' && !this.player.bonus.some(b => b === 'defend')) {
            this.player.bonus.push('defend');
            let newDefendDeg = 20;
            let newDefendArc = 320;
            TweenMax.to(this.player, 1.5, {defendDeg: newDefendDeg, defendArc: newDefendArc});
            // 計時10秒
            let time = setTimeout(() => {
              this.player.bonus = this.player.bonus.filter(b => b !== 'defend');
              TweenMax.to(this.player, 1.5, {defendDeg: 135, defendArc: 90});
              clearTimeout(time);
            }, 10000);
          }
        }
      });
      // 玩家血量和能量控制
      if (this.energy < 100 && this.time % 30 === 0) {
        this.energy += 5;
      }
      if (this.energy === 0 && this.life > 0) {
        this.energy = 100;
        this.life -= 1;
      }
      if (this.energy === 0 && this.life === 0) {
        this.isGameover = true;
      }
      // 若無敵人 則更換關卡
      if (this.enemys.length === 0) {
        this.bullets = [];
        this.enemyBullets = [];
        if (this.level === (global.Levels.length - 1)) {
          this.level = 0;
        } else {
          this.level += 1;
        }
        this.generateEnemys(this.level);
      }
      this.enemyBullets = this.enemyBullets.filter(enemyBullet => !enemyBullet.isDead);
      this.bullets = this.bullets.filter(bullet => !bullet.isDead);
      this.enemys = this.enemys.filter(enemy => !enemy.isDead);
      this.props = this.props.filter(prop => !prop.isDead);
    },
    load() {
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
    generateEnemys(level) {
      this.enemys = global.Levels[level].enemys.map(enemy => {
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
        let initV = this.player.v.mul(2.5);
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
      if (evt.key === 'p') {
        this.pause = !this.pause;
      }
    },
    lifeHurt(demage) {
      let newEnergy = this.energy - demage;
      if (newEnergy < 0) {
        this.energy = 0;
      } else {
        this.energy = newEnergy;
      }
    },
    GameStart() {
      this.start = true;
      this.generateEnemys(this.level);
    },
    addProps() {
      let randomAngle = Math.random() * 360 * Math.PI / 180;
      let x = global.maxR * 1.5 * Math.cos(randomAngle);
      let y = global.maxR * 1.5 * Math.sin(randomAngle);
      let type = global.Props[parseInt(Math.random() * global.Props.length)];
      let delta = this.player.p.sub(new Vec2(x, y));
      let newV = delta.unit.mul(1.5);
      this.props.push(new Prop({
        ctx: this.ctx,
        p: new Vec2(x, y),
        v: newV,
        type: type
      }));
    }
  }
};
</script>

<style lang='scss'>
@import '../style/components/main.scss';
</style>
