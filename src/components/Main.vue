<template>
  <div class="main">
    <canvas id="mycanvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'Main',
  data () {
    return {
      canvas: null,
      ctx: null,
      ww: 0,
      wh: 0,
      updateFPS: 30,
      time: 0
    };
  },
  mounted() {
    this.canvas = document.getElementById('mycanvas');
    this.ctx = this.canvas.getContext('2d');
    this.initCanvas();
    this.load();
    window.addEventListener('resize', this.initCanvas);
  },
  methods: {
    initCanvas() {
      this.ww = this.canvas.width = window.innerWidth;
      this.wh = this.canvas.height = window.innerHeight;
    },
    gameInit() {},
    render() {
      // 清空背景
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, 0, this.ww, this.wh);
      // --------------------------
      // ---繪製區域
      // --------------------------
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
    }
  }
};
</script>

<style lang='scss'>
@import '../style/components/main.scss';
</style>
