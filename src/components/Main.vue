<template>
  <div class="main">
    <canvas id="mycanvas"></canvas>
  </div>
</template>

<script>
import Vec2 from './Canvas/Vector.js';
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
    this.initCanvas();
    this.load();
    window.addEventListener('resize', this.initCanvas);

    // 監聽滑鼠事件
    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('mouseup', this.mouseUp);
    window.addEventListener('mousedown', this.mouseDown);
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
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, this.ww, this.wh);
      // --------------------------
      // ---繪製區域
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
    },
    load() {
      this.gameInit();
      this.initCanvas();
      requestAnimationFrame(this.render);
      setInterval(this.update, 1000 / this.updateFPS);
    },
    mouseMove(evt) {
      this.mousePos.set(evt.x, evt.y);
    },
    mouseUp(evt) {
      this.mousePos.set(evt.x, evt.y);
      this.mousePosUp = this.mousePos.clone();
      console.log(this.mousePosUp);
    },
    mouseDown(evt) {
      this.mousePos.set(evt.x, evt.y);
      this.mousePosDown = this.mousePos.clone();
      console.log(this.mousePosDown);
    }
  }
};
</script>

<style lang='scss'>
@import '../style/components/main.scss';
</style>
