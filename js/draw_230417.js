//베지어.js 라이브러리 참고
//커브랑 커브가 만나는 점은? -> 커브 식 두개를 정리해서 해를 구하면 됨
//but 그래픽스에서는 라인으로 커브를 표현하므로 라인과 라인의 인터섹션을 찾으면 됨

let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let ctrlPts = [];
let isClicked = false;
let clickIdx = -1;
let AboveIdx = -1;

ctrlPts.push(new THREE.Vector2(100, 400));//컨트롤포인트 4개
ctrlPts.push(new THREE.Vector2(150, 300));//추가 포인트
ctrlPts.push(new THREE.Vector2(200, 200));
ctrlPts.push(new THREE.Vector2(250, 200));//추가 포인트
ctrlPts.push(new THREE.Vector2(300, 200));
ctrlPts.push(new THREE.Vector2(350, 300));//추가 포인트
ctrlPts.push(new THREE.Vector2(400, 400));





//드로우포인트와 드로우 라인으로 제작
function draw_point(p, color) {//컬러 적용가능
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
  ctx.fill();
}

function draw_line(p0, p1, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.stroke();
}

function draw_bezier(ctrlPts) {//베지어 곡선

  for (let i = 0; i < ctrlPts.length - 1; i++)
    draw_line(ctrlPts[i], ctrlPts[i + 1], "#000000");

  for (let i = 0; i < ctrlPts.length; i++)
    draw_point(ctrlPts[i], "#000000");

  let bezierPts = [];//곡선 그리기
  let resolution = 40;//개?수
  for (let i = 0; i <= resolution; i++) {//t는 0부터 1
    let t = i / resolution;
    bezierPts.push(bezier_curve(ctrlPts, t));
  }
  for (let i = 0; i < bezierPts.length - 1; i++)
    draw_line(bezierPts[i], bezierPts[i + 1], "#cc00cc");

}

//bezier functions
function Berstein_polynomial(n, i, t) {
  let binomial_coefficient = factorial(n) / (factorial(i) * factorial(n - i));
  let mid = Math.pow(t, i);
  let back = Math.pow(1 - t, n - i);
  return binomial_coefficient * mid * back;
}
function factorial(n) {
  if (n == 1 || n == 0)
    return 1;
  return n * factorial(n - 1);
}
function bezier_curve(ctrlPts, t) {
  let result_point = new THREE.Vector2(0, 0);
  for (let i = 0; i < ctrlPts.length; i++) {
    result_point.x += ctrlPts[i].x * Berstein_polynomial(ctrlPts.length - 1, i, t);
    result_point.y += ctrlPts[i].y * Berstein_polynomial(ctrlPts.length - 1, i, t);
  }
  return result_point;
}

//animation functions
function getMousePos(c, e) {
  var rect = c.getBoundingClientRect();
  return new THREE.Vector2(Math.round(e.clientX - rect.left), Math.round(e.clientY - rect.top));

}


//이벤트 리스너 - 마우스 상호작용
//클릭이벤트 - 눌렀다 떼었을때 작용
c.addEventListener("mousemove", function (e) {
  var mousePos = getMousePos(c, e);
  if (isClicked) {
    ctrlPts[clickIdx].x = mousePos.x;
    ctrlPts[clickIdx].y = mousePos.y;
  }
}, false);

c.addEventListener("mousedown", function (e) {
  var mousePos = getMousePos(c, e);
  isClicked = false;
  clickIdx = -1;

  for (let i = 0; i < ctrlPts.length; i++) {
    if (mousePos.distanceTo(ctrlPts[i]) < 10) {
      isClicked = true;
      clickIdx = i;
    }
  }
  console.log(isClicked + " " + clickIdx);
}, false);

c.addEventListener("mouseup", function (e) {
  isClicked = false;
  clickIdx = -1;
})

function clear() {
  ctx.clearRect(0, 0, c.width, c.height);
}
function draw_image() {
  draw_bezier(ctrlPts);
}
function update() {
  clear();
  draw_image();
  requestAnimationFrame(update);
}
update();