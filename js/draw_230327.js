let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let xValue = 50;
let yValue = 200;

let boxPts = [];
let colors = [];

boxPts.push(new THREE.Vector2(150, 150));
boxPts.push(new THREE.Vector2(350, 350));
colors.push("green");

boxPts.push(new THREE.Vector2(xValue, yValue));
boxPts.push(new THREE.Vector2(xValue + 50, yValue + 50));
colors.push("red");

boxPts.push(new THREE.Vector2(40, 40));//blue
boxPts.push(new THREE.Vector2(140, 140));
colors.push("blue");

boxPts.push(new THREE.Vector2(250, 100));//yellow
boxPts.push(new THREE.Vector2(450, 250));
colors.push("yellow");

boxPts.push(new THREE.Vector2(200, 200));//cyan
boxPts.push(new THREE.Vector2(300, 300));
colors.push("cyan");

boxPts.push(new THREE.Vector2(50, 320));//purple
boxPts.push(new THREE.Vector2(250, 450));
colors.push("purple");

function draw_box(minPt, maxPt, isFill) {
  ctx.beginPath();
  ctx.rect(minPt.x, minPt.y, maxPt.x - minPt.x, maxPt.y - minPt.y);
  if (isFill)
    ctx.fill();
  else
    ctx.stroke();
}

function isCollision(boxMin, boxMax, colorIndex) {//박스 충돌 개별감지
  let isFill = false;
  if (box_box_collision(boxMin, boxMax, boxPts[2], boxPts[3]))
    isFill = true;
  ctx.strokeStyle = colorIndex
  ctx.fillStyle = colorIndex
  draw_box(boxMin, boxMax, isFill)
  ctx.strokeStyle = "red"
  ctx.fillStyle = "red"
  draw_box(boxPts[2], boxPts[3], isFill)
}

function draw_image() {//그림 출력
  isCollision(boxPts[0], boxPts[1], colors[0]);//green
  isCollision(boxPts[4], boxPts[5], colors[2]);//blue
  isCollision(boxPts[6], boxPts[7], colors[3]);//yellow
  isCollision(boxPts[8], boxPts[9], colors[4]);//cyan
  isCollision(boxPts[10], boxPts[11], colors[5]);//purple
}

function box_box_collision(pMin, pMax, qMin, qMax) {
  if(pMax.x>qMin.x && pMin.x<qMax.x && pMax.y>qMin.y && pMin.y<qMax.y ) return true;
}


//Keyboard Input
function keyDown(e) {
  if (e.key === 'ArrowRight' || e.key === 'Right') {
    xValue += 5;
  } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
    xValue -= 5;
  } else if (e.key === 'ArrowUp' || e.key === 'Up') {
    yValue -= 5;
  } else if (e.key === 'ArrowDown' || e.key === 'Down') {
    yValue += 5;
  }

  boxPts[2].x = xValue;
  boxPts[3].x = xValue + 50;
  boxPts[2].y = yValue;
  boxPts[3].y = yValue + 50;
}

//Animation Callback
function clear() {
  ctx.clearRect(0, 0, c.width, c.height);
}
function update() {
  clear();
  draw_image();
  requestAnimationFrame(update);
}
update();
document.addEventListener('keydown', keyDown);