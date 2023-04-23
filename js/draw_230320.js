let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let xValue = 0;
let yValue = 0;

//Make data : 도형 정보를 입력
let linePts = []; 
linePts.push(new THREE.Vector2(50, 50));
linePts.push(new THREE.Vector2(150, 350));//원래는 200, 350->200

linePts.push(new THREE.Vector2(50, 250));
linePts.push(new THREE.Vector2(150, 250));//원래는 350, 350 ->150

linePts.push(new THREE.Vector2(150, 50));
linePts.push(new THREE.Vector2(150, 200));

let boxPts = [];

boxPts.push(new THREE.Vector2(100, 100));
boxPts.push(new THREE.Vector2(300, 300));


function draw_line(p0, p1) {//선분 그리기
    ctx.beginPath(); //도형을 그리겠다 선언
    ctx.moveTo(p0.x, p0.y); //선분의 시작지점
    ctx.lineTo(p1.x, p1.y); //선분의 끝지점
    ctx.stroke(); //이 메서드를 써야 선이 화면에 그려짐
}

function draw_point(p) { //교차점 표시
    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI); //arc(원점.x, 원점.y, 반지름, 시작방향(디폴트 3시방향), 각도, 방향(true:반시계, false:시계))
    ctx.fill(); //원 안을 채우려면 fill, 비우려면 stroke
}

function draw_box(minPt, maxPt) { //박스 그리기 : 드로우 라인 4번 사용
    let p0 = new THREE.Vector2(minPt.x, minPt.y);
    let p1 = new THREE.Vector2(minPt.x, maxPt.y);
    let p2 = new THREE.Vector2(maxPt.x, maxPt.y);
    let p3 = new THREE.Vector2(maxPt.x, minPt.y);
    draw_line(p0, p1);
    draw_line(p1, p2);
    draw_line(p2, p3);
    draw_line(p3, p0);
}

function draw_circle(ctr, radius) { //원 그리기
    ctx.beginPath();
    ctx.arc(ctr.x, ctr.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

// 여기까지가 그림 그리기 위한 도구

function draw_image() { //그림을 화면에 출력
    ctx.strokeStyle = "blue";
    draw_line(linePts[0], linePts[1]);
    ctx.strokeStyle = "red";
    draw_line(linePts[2], linePts[3]);
    ctx.strokeStyle = "gray";
    draw_line(linePts[4], linePts[5]);
    ctx.strokeStyle = "green";
    draw_box(boxPts[0], boxPts[1])
    ctx.strokeStyle = "black";
    draw_circle(new THREE.Vector2(230 + xValue, 230 + yValue), 110);
    intersectionCheck();//교점체크
}

function line_line_intersection(p0, p1, p2, p3) {//두 라인의 양끝점 4개로 판별
    // y=ax+b : 직선의 방정식
    // a:기울기 : y증가량 / x증가량
    // y=a0x+b0  y=a1x+b1 : y절편
    let a0 = (p1.y - p0.y) / (p1.x - p0.x);//기울기
    let b0 = p0.y - a0 * p0.x; //y절편

    let a1 = (p3.y - p2.y) / (p3.x - p2.x);
    let b1 = p2.y - a1 * p2.x;

    //직선의 교점? 
    //x좌표 : a0x+b0=a1x+b1 --> (a0-a1)x = b1-b0 --> x=(b1-b0)/(a0-a1)
    //y좌표 : y=a0*(교점x좌표)+b0
    let intersectionX = (b1 - b0) / (a0 - a1);
    let intersectionY = a0 * intersectionX + b0;
    
    if (p0.x > intersectionX || p1.x < intersectionX)
        return;
    if (p2.x > intersectionX || p3.x < intersectionX)
        return;
    if (p0.y > intersectionY || p1.y < intersectionY)
        return;
    if (p2.y > intersectionY || p3.y < intersectionY)
        return;
    
    let intersectionPt = new THREE.Vector2(intersectionX, intersectionY);
    draw_point(intersectionPt);
}

function line_box_intersection(lineP0, lineP1, boxMinPt, boxMaxPt) {
    //boxMinPt.x, boxMinPt.y / boxMinPt.x, boxMaxPt.y : 위쪽 가로, 기울기 0, y절편 boxMaxPt.y
    //boxMinPt.x, boxMaxPt.y / boxMaxPt.x, boxMaxPt.y : 오른쪽 세로, x절편 boxMaxPt.x
    //boxMaxPt.x, boxMaxPt.y / boxMinPt.x, boxMaxPt.y : 아래쪽 가로, 기울기 0, y절편 boxMinPt.y
    //boxMinPt.x, boxMaxPt.y / boxMinPt.x, boxMinPt.y : 왼쪽 세로, x절편 boxMinPt.x
    //직선의 방정식 : y=a0x+b0 , x = (y-b0)/a0 
    if((lineP1.x - lineP0.x)==0){
        let a0 = lineP0.x; b0 = 0;
        if(lineP0.x < boxMinPt.x && lineP0.x > boxMaxPt.x){
            let point = new THREE.Vector2(a0, boxMax.y);
            draw_point(point);};
    }
    let a0 = (lineP1.y - lineP0.y) / (lineP1.x - lineP0.x); //x축에 평행하지 않을때 기울기
    let b0 = lineP0.y - a0 * lineP0.x; //y절편
    
    /*교점이 될 수 있는 좌표 : (boxMinPt.x , a0*boxMinPt.x+b0) (boxMaxPt.x , a0*boxMaxPt.x+b0) 
                                ((boxMinPt.y-b0)/a0 , boxMinPt.y) ((boxMaxPt.y-b0)/a0 , boxMaxPt.y)
    값들이 지정범위 안에 있으면 교점*/
    let its1 = new THREE.Vector2(boxMinPt.x , a0*boxMinPt.x+b0);//좌측 세로변
    let its2 = new THREE.Vector2(boxMaxPt.x , a0*boxMaxPt.x+b0);//우측 세로변
    let its3 = new THREE.Vector2((boxMinPt.y-b0)/a0 , boxMinPt.y);//위쪽 가로변
    let its4 = new THREE.Vector2((boxMaxPt.y-b0)/a0 , boxMaxPt.y);//아래 가로변

    if(its1.y < boxMaxPt.y && its1.y > boxMinPt.y ) draw_point(its1); //its1.y가 lineP0.y와 lineP1.y의 사이에 있는가?
    if(its2.y < boxMaxPt.y && its2.y > boxMinPt.y ) draw_point(its2);
    if(its3.x < boxMaxPt.x && its3.x > boxMinPt.x ) draw_point(its3);
    if(its4.x < boxMaxPt.x && its4.x > boxMinPt.x ) draw_point(its4);
}

function line_circle_intersection(lineP0, lineP1, circleCtr, circleRadius) {//라인의 끝점 두개, 원의 중심, 반지름
    //원의 방정식 : (x-a)^2 + (y-b)^2 = r^2
    //box의 min,max 지점에 해당하는 원의 지점이 있는가 -> x또는 y값을 대입했을때 지정범위 안에 있는가
    //원점에서부터 r의 거리에 있는 점 중에 x
    
}

function box_circle_intersection(boxMinPt, boxMaxPt, circleCtr, circleRadius) {
    
}

function intersectionCheck(){//교점 체크
    line_line_intersection(linePts[0], linePts[1], linePts[2], linePts[3]);
    line_box_intersection(linePts[0], linePts[1], boxPts[0], boxPts[1]); //라인이 두개라서 체크도 두개씩 (인덱스 바꿔서)
    line_box_intersection(linePts[2], linePts[3], boxPts[0], boxPts[1]);
    line_box_intersection(linePts[4], linePts[5], boxPts[0], boxPts[1]);
    //line_circle_intersection(linePts[0], linePts[1], new THREE.Vector2(230 + xValue, 230 + yValue), 110);//같은이유로 두개씩
    //line_circle_intersection(linePts[2], linePts[3], new THREE.Vector2(230 + xValue, 230 + yValue), 110);
    //box_circle_intersection(boxPts[0], boxPts[1], new THREE.Vector2(230 + xValue, 230 + yValue), 110);
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
}

//Animation Callback
function clear(){
    ctx.clearRect(0, 0, c.width, c.height);
}
function update(){
    clear();//화면리셋
    draw_image();//도형그리기
    requestAnimationFrame(update);
}
update();
document.addEventListener('keydown', keyDown);