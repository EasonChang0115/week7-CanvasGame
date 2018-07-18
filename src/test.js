console.clear();

// 工具函數(包裝繪圖函數 更方便使用)
// PI轉換
let PI = n => n === undefined ? Math.PI : n * Math.PI;
//判斷arguments的參數個數來回傳向量物件
let getVec2 = (args) => {
  if(args.length === 1) {
    return args[0];
  }else if(args.length === 2) {
    return new Vec2(args[0], args[1]);
  }
}
// 因為要用到args所以不適合用箭頭函數 
let moveTo = function() {
  let v = getVec2(arguments)
  ctx.moveTo(v.x, v.y);
}
let lineTo = function() {
  let v = getVec2(arguments)
  ctx.lineTo(v.x, v.y);
}
let translate = function(){
  let v = getVec2(arguments)
  ctx.translate(v.x,v.y)
}
let arc = function() {
  ctx.arc.apply(ctx, arguments);
}
let rotate = angle => {
  if(angle !== 0) {
    ctx.rotate(angle);
  }
}
let beginPath = () => {ctx.beginPath()};
let closePath = () => {ctx.closePath()};
let setFill = color => {ctx.fillStyle = color};
let setStroke = color => {ctx.strokeStyle = color};
let fill = color => {
  if(color) {
    setFill(color);
  }
  ctx.fill();
}
let stroke = color => {
  if(color) {
    setStroke(color);
  }
  ctx.stroke();
}
let save = func => {
  ctx.save();
  func();
  ctx.restore();
}

// static 位於原型類別物件上 不用new就可以呼叫
// 計算屬性的延伸 類似於預先定義好的工具 可直接用Vec2.ZERO 他會回傳新的以定義好的Vec2物件
// 裡面是做一個new所以不用new
// 向量class
class Vec2 {
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
  set(x,y){
    this.x = x;
    this.y = y;
  }
  move(x,y){
    this.x += x;
    this.y += y;
  }
  add(v){
    return new Vec2(this.x + v.x, this.y + v.y);
  }
  sub(v){
    return new Vec2(this.x - v.x, this.y - v.y);
  }
  mul(s){
    return new Vec2(this.x * s, this.y * s);
  }
  clone(){
    return new Vec2(this.x, this.y);
  }
  toString(){
    return `(${this.x}, ${this.y})`;
  }
  equal(v){
    return this.x === v.x && this.y === v.y;
  }
  get length(){
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  set length(nv){
    let temp = this.unit.nul(nv);
    this.set(temp.x, temp.y);
  }
  get angle(){
    return Math.atan2(this.y,this.x);
  }
  get unit(){
    return this.mul(1/this.length);
  }
  static get ZERO() {
    return new Vec2(0, 0);
  }
  static get UP() {
    return new Vec2(0, -1);
  }
  static get DOWN() {
    return new Vec2(0, 1);
  }
  static get LEFT() {
    return new Vec2(-1, 0);
  }
  static get RIGHT() {
    return new Vec2(1, 0);
  }
  static DIR(str) {
    if(!str){
      return Vec2.ZERO;
    }
    let type = ('' + str).toUpperCase();
    return Vec2[type];
  }
  static DIR_ANGLE(str) {
    switch(str) {
        case "right": 
          return 0;
        case "left":
          return PI();
        case "up":
          return PI(-0.5);
        case "down":
          return PI(0.5);
    }
    return 0;
  }
}

// 環境變數
let updateFPS = 30;
let showMouse = true;
let time = 0;

//控制 dat.gui
let controls = {
  value: 0
}
let gui = new dat.GUI();
gui.add(controls,'value',-2,2).step(0.001).onChange(function(value){
  //do something
});

//初始化canvas 
let canvas = document.getElementById('mycanvas');
let ctx = canvas.getContext('2d');
ctx.circle = function(v,r){
  this.arc(v.x, v.y, r, 0, Math.PI * 2);
}
ctx.line = function(v1,v2){
  this.moveTo(v1.x, v1.y);
  this.lineTo(v2.x, v2.y);
}
ww = canvas.width = window.innerWidth;
wh = canvas.height = window.innerHeight;

// 畫面格子比例最小值
let WSPAN = Math.min(ww, wh) / 25;

// 棋盤座標轉換為繪圖座標 但是因為座標原格子的左上角 所以加上格子的寬度的一半 移置中央
function GETPOS(){
  let sourceV = getVec2(arguments);
  return sourceV.mul(WSPAN).add(new Vec2(WSPAN/2, WSPAN/2));
}

//地圖class
class Map {
  constructor(){
    this.mapData = [
      "ooooooooooooooooooo",
      "o        o        o",
      "o oo ooo o ooo oo o",
      "o+               +o",
      "o oo o ooooo o oo o",
      "o    o   o   o    o", 
      "oooo ooo o ooo oooo",
      "xxxo o       o oxxx",
      "oooo o oo oo o oooo", 
      "       oxxxo       ",
      "oooo o ooooo o oooo",
      "xxxo o   x   o oxxx",
      "oooo ooo o ooo oooo",
      "o    o   o   o    o",
      "o oo o ooooo o oo o",
      "o+               +o",
      "o oo ooo o ooo oo o",
      "o        o        o",
      "ooooooooooooooooooo",
    ]
    this.init();
  }
  init() {
    this.pacman = new Pacman({
      gridP: new Vec2(9, 11)
    });
    this.ghosts = [];
    for(var i = 0; i < 4; i++) {
      this.ghosts.push(new Ghost({
        gridP: new Vec2(9 + i % 3 - 1, 9),
        color: ['red', '#ffa928', '#16ebff', '#ff87ab'][i]
      }))
    }
    TweenMax.to(this.pacman, 0.2, {
      deg: 0,
      ease: Linear.easeNone,
      repeat: -1,
      yoyo: true
    })
    this.foods = [];
    for(var i = 0; i < 20; i++) {
      for(var o = 0; o < 20; o++) {
        let foodType = this.isFood(i, o);
        if (foodType) {
          let food = new Food({
            gridP: new Vec2(i, o),
            super: foodType.super
          })
          this.foods.push(food);
        }
      }
    }
  }
  isFood(i, o) {
    let type = this.getWallContent(i, o);
    if (type === '+' || type === ' ') {
      return {
        super: type == "+"
      }
    }
    return false;
  }
  draw() {
    for(var i = 0; i < 19; i++){
      for(var o = 0; o < 19; o++){
        save(()=>{
          translate(GETPOS(i, o));
          setStroke('rgba(255,255,255,0.2)');
          ctx.strokeRect(-WSPAN/2, -WSPAN/2, WSPAN, WSPAN);
          
          let wallType = this.getWalls(i, o);
          setStroke('blue');
          ctx.lineWidth = WSPAN / 5;
          ctx.shadowColor = 'rgba(30,30,255)';
          ctx.shadowBlur = 30;
          
          let typecode = ['up','down','left','right'].map(d=>wallType[d]?1:0).join("");
          if(wallType.none) {
            typecode = '';
          }
          // setFill('white');
          // ctx.fillText(typecode, 0, 0);
          let countSide = (typecode.match(/1/g) || []).length; 
          
          let wallSpan = WSPAN / 4.5;
          let wallLen = WSPAN / 2;
          
          if(typecode === "1100" || typecode === '0011'){
            save(()=>{
              if(typecode === '0011') rotate(PI(0.5))
              beginPath();
              moveTo(wallSpan, -wallLen);
              lineTo(wallSpan, wallLen);
              moveTo(-wallSpan, -wallLen);
              lineTo(-wallSpan, wallLen);
              stroke();
            })
          } else if (countSide === 2) {
            let angles = {
              '1010': 0,
              '1001': 0.5,
              '0101': 1,
              '0110': -0.5
            }
            save(()=>{
              rotate(PI(angles[typecode]));
              
              beginPath();
              arc(-wallLen, -wallLen, wallLen + wallSpan, 0, PI(0.5));
              stroke();

              beginPath();
              arc(-wallLen, -wallLen, wallLen - wallSpan, 0, PI(0.5));
              stroke();
            })
          }
          if(countSide === 1) {
            let angles = {
              '1000': 0,
              '0001': 0.5,
              '0100': 1,
              '0010': -0.5
            }
            save(()=>{
              rotate(PI(angles[typecode]))
              beginPath()
              arc(0, 0,wallSpan,0,PI());
              stroke();

              beginPath();
              moveTo(wallSpan, -wallLen);
              lineTo(wallSpan, 0);
              moveTo(-wallSpan, -wallLen);
              lineTo(-wallSpan, 0);
              stroke();
            })
          }
          if(countSide === 3) {
            let angles = {
              '1011': 0,
              '1101': 0.5,
              '0111': 1,
              '1110': -0.5
            }
            save(()=>{
              rotate(PI(angles[typecode]))
              beginPath();
              arc(-wallLen, -wallLen, wallLen - wallSpan, 0, PI(0.5));
              stroke();

              beginPath();
              arc(wallLen, -wallLen, wallLen - wallSpan, PI(0.5), PI(1));
              stroke();
              
              beginPath();
              moveTo(-wallLen, wallSpan);
              lineTo(wallLen, wallSpan);
              stroke();
            })
          }
        })
      }
    }
  }
  // 以x,y坐標系轉到地圖上 (因為地圖列第一個是取cloumn所以要記得反轉)
  getWallContent(o, i){
    return this.mapData[i] && this.mapData[i][o];
  }
  // 判斷地圖(i, o)位置是否為牆壁
  isWall(i, o) {
    let type = this.getWallContent(i, o);
    return type === 'o';
  }
  // 取得地圖(i, o)位置周圍是否有牆壁
  getWalls(i, o) {
    return {
      up: this.isWall(i, o - 1),
      down: this.isWall(i, o + 1),
      left: this.isWall(i - 1, o),
      right: this.isWall(i + 1, o),
      none: !this.isWall(i, o),
    }
  }
}

//遊戲物件class
class GameObject{
  constructor(args) {
    let def = {
      p: Vec2.ZERO, //實際上繪製的座標
      gridP: Vec2.ZERO, //格子點的座標
    }
    Object.assign(def, args);
    Object.assign(this, def);
    this.p = GETPOS(this.gridP);//格點位置轉為繪製的位置
  }
  collide(gobj){
    return this.p.sub(gobj.p).length < WSPAN;
  }
}

//玩家物件class
class Player extends GameObject {
  constructor(args) {
    super(args)
    let def = {
      nextDirection: null,
      currentDirection: null,
      isMoving: false,
      speed: 40,
    }
    Object.assign(def, args);
    Object.assign(this, def);
  }
  draw() {
    beginPath();
    circle(this.p,5);
    fill('white');
  }
  get directionAngle() {
    return Vec2.DIR_ANGLE(this.currentDirection);
  }
  moveStep() {
    // 紀錄現在位置 和 方向
    let i0 = this.gridP.x;
    let o0 = this.gridP.y;
    let oldDirection = this.currentDirection;
    
    // 判斷周圍是否為牆壁
    let haveWall = map.getWalls(this.gridP.x, this.gridP.y);
    let avail = ['up', 'down', 'left', 'right'].filter(d => !haveWall[d]);
    
    if (!haveWall[this.nextDirection] && this.nextDirection) {
      this.currentDirection = this.nextDirection;
    }
    
    this.gridP = this.gridP.add(Vec2.DIR(this.currentDirection));
    let isWall = map.isWall(this.gridP.x, this.gridP.y);
    if (!isWall) {
      this.isMoving = true;
      let moveStepTime = 10 / this.speed;
      
      if (this.gridP.x <= -1 && this.currentDirection === 'left') {
        this.gridP.x = 18;
        moveStepTime = 0;
      }
      
      if (this.gridP.x >= 19 && this.currentDirection === 'right') {
        this.gridP.x = 0;
        moveStepTime = 0;
      }
      
      TweenMax.to(this.p, moveStepTime, {
        ...GETPOS(this.gridP),
        ease: Linear.easeNone,
        onComplete: () => {
          this.isMoving = false;
          this.moveStep();
        }
      })
    } else {
      this.gridP.set(i0, o0);
      this.currentDirection = oldDirection;
    }
  }
}

// 小精靈
class Pacman extends Player{
  constructor(args) {
    super(args)
    let def = {
      r: WSPAN/2,
      deg: Math.PI/4,
      deadDeg: 0,
      isDead: false,
      speed: 60
    }
    Object.assign(def, args);
    Object.assign(this, def);
  }
  draw() {
    let useDeg = PI(0.25);
    useDeg = this.deg;
    if(this.isDead) {
      useDeg = this.deadDeg;
    }
     save(()=>{
       translate(this.p);
       rotate(this.directionAngle);
       beginPath(); // 課程中 忘記加上 導致會影響到下個繪製的物體
       moveTo(Vec2.ZERO);
       rotate(useDeg);
       lineTo(this.r, 0);
       arc(0, 0, this.r, 0, PI(2) - useDeg * 2);
       fill('yellow');
       closePath();
     })
  }
  die() {
    if(!this.isDead) {
      this.isDead = true;
      TweenMax.killAll();
      this.deadDeg = 0;
      TweenMax.to(this, 1.5, {
        deadDeg: PI(),
        ease: Linear.easeNone,
        delay: 1
      })
    }
  }
}

// 鬼
class Ghost extends Player{
  constructor(args) {
    super(args)
    let def = {
      r: WSPAN/2,
      color: 'red',
      isEatable: false,
      isDead: false,
      deg: Math.PI/4,
      isEatableCounter: 0,
      traceGoCondition: [{
        name: 'left', condition: target => this.gridP.x > target.x
      },{
        name: 'right', condition: target => this.gridP.x < target.x
      },{
        name: 'up', condition: target => this.gridP.y > target.y
      },{
        name: 'down', condition: target => this.gridP.y < target.y
      }]
    }
    Object.assign(def, args);
    Object.assign(this, def);
  }
  draw() {
     save(()=>{
       translate(this.p);
       
       if (!this.isDead) {
          beginPath();
          arc(0, 0, this.r, PI(), 0);
          lineTo(this.r, this.r);

          let tt = parseInt(time / 3);
          let ttSpan = this.r * 2 / 7;
          let ttHeight = this.r / 3;

          for(let i = 0; i < 7; i++) {
          lineTo(this.r * 0.9 - ttSpan * i, ((i+tt) % 2 - 1) * ttHeight + this.r);
          }
          let eatableColor = this.isEatableCounter > 3 || (time % 10 < 5) ? '#1f37ef' : '#ffffff';
          lineTo(-this.r, this.r);
          closePath();
          fill(!this.isEatable ? this.color : eatableColor);
       }
       
       // 若鬼不能被吃 就不會顯示眼球
       let hasEye = !this.isEatable;
       let eyeR = this.r / 3;
       let innerEyeR = eyeR / 2;
       
       beginPath();
       arc(-this.r / 2.5, -eyeR, eyeR, 0, PI(2));
       arc(this.r / 2.5, -eyeR, eyeR, 0, PI(2));
       fill('white');
       
       if (hasEye) {
          save(() => {
           let innerEyePan = Vec2.DIR(this.currentDirection).mul(innerEyeR);
           translate(innerEyePan);
           beginPath();
           arc(-this.r / 2.5, -eyeR, innerEyeR, 0, PI(2));
           arc(this.r / 2.5, -eyeR, innerEyeR, 0, PI(2));
           fill('black');
         })
       }
      
     })
  }
  update() {
    this.speed = 38;
    if (this.isEatable) this.speed = 25;
    if (this.isDead) this.speed = 100;
    if (this.isDead && this.gridP.equal(new Vec2(9, 9))) {
      this.reLive();
    }
  }
  setEatable (t) {
    this.isEatableCounter = t;
    if (!this.isEatable) {
      this.isEatable = true;
      let func = (()=>{
        this.isEatableCounter--;
        if (this.isEatableCounter <= 0) {
          this.isEatable = false;
        } else {
          setTimeout(func,1000)
        }
      })
      func();
    }
  }
  getNextDirection(map, pacman) {
    let currentTarget = this.isDead ? (new Vec2(9, 9)) : pacman.gridP;
    let go = !this.isEatable || this.isDead;
    let traceGo = this.traceGoCondition.filter(obj => {
      let cond = obj.condition(currentTarget);
      return go ? cond : !cond;
    }).map(obj => obj.name);
    // 取得當下周圍是否為牆面
    let haveWall = map.getWalls(this.gridP.x, this.gridP.y);
    // 留下可以走的方向及不走回頭路的方向 
    // 不走回頭路的方式: 用 要前進的方向單位向量 去加上 目前前進的方向的單位向量 長度若不等於0 代表不回頭
    let traceGoAndCanGo = traceGo
                          .filter(d => !haveWall[d])
                          .filter(d => Vec2.DIR(d).add(Vec2.DIR(this.currentDirection)).length !== 0);
    // 若以上皆不能走 則隨機走一個可以走的路
    let availGo = ['left', 'right', 'up', 'down'].filter(d => !haveWall[d]);
    if (availGo.length === 2) {
      if((haveWall.up && haveWall.down) || (haveWall.left && haveWall.rigth)) {
        return this.currentDirection;
      }
    }
    
    // 若想走的路徑沒有東西 則就走可以走的路
    let finalPossibaleSets = traceGoAndCanGo.length === 0 ? availGo : traceGoAndCanGo;
    
    // top是當都沒地方可以走 一律往上走
    let finalDescision = finalPossibaleSets[parseInt(Math.random() * finalPossibaleSets.length)] || 'top';
    
    return finalDescision;
  }
  die() {
    this.isDead = true;
  }
  reLive() {
    this.isDead = false;
    thi.isEatable = false;
  }
}

// 食物
class Food extends GameObject {
  constructor(args) {
    super(args)
    let def = {
      eaten: false,
      super: false
    }
    Object.assign(def, args);
    Object.assign(this, def);
  }
  draw() {
   if(!this.eaten){
     save(() => {
       translate(this.p);
       setFill('#f99595');
       if (this.super) {
         if (time % 10 < 5) {
           beginPath();
           arc(0, 0, WSPAN / 5, 0, PI(2));
           fill("white");
         }
       } else {
         let r = WSPAN / 10; 
         ctx.fillRect(-r, -r, r*2, r*2);
       }
     })
   }
  }
}

function initCanvas(){
  ww = canvas.width = window.innerWidth;
  wh = canvas.height = window.innerHeight;
}

var map = null;
//遊戲初始化
function init(){
  map = new Map();
}
//更新遊戲邏輯
function update(){
  time++;
  map.ghosts.forEach(ghost => {
    ghost.update();
    ghost.nextDirection = ghost.getNextDirection(map, map.pacman);
    if (!ghost.isMoving) {
      ghost.moveStep();
    }
    // 小精靈跟鬼的碰撞
    if (!ghost.isDead && !map.pacman.isDead && ghost.collide(map.pacman)) {
      if(!ghost.isEatable) {
        map.pacman.die();
        setTimeout(()=>{
          map.init()
        }, 4000);
      } else {
        ghost.die();
      }
    }
  });
  // 食物的碰撞
  let currentFood = map.foods.find(food => {
    return food.gridP.sub(map.pacman.gridP).length <= 3 && food.p.sub(map.pacman.p).length <= WSPAN / 2;
  })
  if (currentFood && !currentFood.eaten) {
    currentFood.eaten = true;
    if (currentFood.super) {
      map.ghosts.forEach(ghost => {
        ghost.setEatable(10);
      })
    }
  }
}
//更新畫面
function render(){
  //清空背景
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, ww, wh);
  
  //--------------------------
  //---繪製區域
  
  save(()=>{
    translate(new Vec2(ww/2 - WSPAN * 10, wh/2 - WSPAN * 10));
    map.draw();
    map.foods.forEach(food=>food.draw());
    map.ghosts.forEach(ghost=>ghost.draw());
    map.pacman.draw();
    
    setFill('white');
    let score = map.foods.filter(f => f.eaten).length * 10;
    ctx.font = '20px Ariel'
    ctx.fillText("Score: " + score, 0, -10);
  })

  //--------------------------
  
  // 滑鼠
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.circle(mousePos,3);
  ctx.fill();
  
  ctx.save();
  ctx.beginPath();
  ctx.translate(mousePos.x,mousePos.y);
  ctx.strokeStyle = 'red';
  ctx.fillText(mousePos,10,-10);
  ctx.line(new Vec2(-20,0),new Vec2(20,0));
  ctx.line(new Vec2(0,-20),new Vec2(0,20));
  ctx.stroke();
  ctx.restore();
  
  requestAnimationFrame(render);
}
//一開始載入畫面後 需執行的函數
function loaded(){
  init();
  initCanvas();
  requestAnimationFrame(render);
  setInterval(update,1000/updateFPS);
}
window.addEventListener('load',loaded);
window.addEventListener('resize',initCanvas);



//滑鼠事件
var mousePos = new Vec2(0, 0);
var mousePosDown = new Vec2(0, 0);
var mousePosUp = new Vec2(0, 0);

window.addEventListener('mousemove',mousemove);
window.addEventListener('mouseup',mouseup);
window.addEventListener('mousedown',mousedown);
function mousemove(evt){
  mousePos.set(evt.x, evt.y);
}
function mouseup(evt){
  mousePos.set(evt.x, evt.y);
  mousePosUp = mousePos.clone();
  // console.log(mousePosUp);
}
function mousedown(evt){
  mousePos.set(evt.x, evt.y);
  mousePosDown = mousePos.clone();
  // console.log(mousePosDown);
}

window.addEventListener('keydown', function(evt){
  if(!map.pacman.isDead) {
    map.pacman.nextDirection = evt.key.replace('Arrow', '').toLowerCase();
    if(!map.pacman.isMoving) {
      map.pacman.moveStep();
    }
  }
})