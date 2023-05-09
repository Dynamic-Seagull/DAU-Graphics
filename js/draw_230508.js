var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: true });
var camera = new THREE.PerspectiveCamera(75, 1.0, 0.1, 1000);

function initLight() {
    var pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(10,10,10);
    pointLight.castShadow = true;
    scene.add(pointLight);//씬에 추가
}

function initRenderer() {
    camera.position.z = 15; //카메라위치
    renderer.setClearColor("#ffffff"); //컬러
    renderer.setSize(500, 500);
    
    // Append Renderer to DOM
    document.body.appendChild(renderer.domElement);
}
function initGeometry() {
    // const axesHelper = new THREE.AxesHelper(); //x:red y:green z:blue 
    // scene.add(axesHelper);

    

    var material0 = new THREE.MeshLambertMaterial({ color: "#ff00ff" }); //material0.color.setHex(Math.random()*0xffffff)
    var geometryCube = new THREE.BoxGeometry(1, 1, 1);//가로,높이,깊이
    //var geometryCube = new THREE.SphereGeometry(1, 10, 10);//구 //마테리얼에 와이어프레임 True로 하는게 디버깅하기 편함
    //var geometryCube = new THREE.ConeGeometry(1, 5, 5);

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {//메쉬 수 조절
            var cube = new THREE.Mesh(geometryCube, material0);
            //돌때마다 다른 큐브색
            var material0 = new THREE.MeshLambertMaterial({ color: "#ff00ff" }); 
            material0.color.setHex(Math.random()*0xffffff);
            if(i%2==0)
            {
                material0.wireframe = TRUE;
            }
            //Translation
            cube.translateX(-9.0 + 2.0 * i);//큐브 위치 조정
            cube.translateY(-9.0 + 2.0 * j);
            // Add cube to Scene
            scene.add(cube);//씬에 추가
        }
    }
}

function init() {
    initLight();//점 광원 (point light)
    initRenderer();
    initGeometry();
}

// Render Loop
var render = function () {
    requestAnimationFrame(render);//장면 갱신
    for (var i = 1; i < scene.children.length; i++) {//박스 로테이션 조절
        scene.children[i].rotation.x += 0.01;//데이터를 만들면 scene의 children에 들어감(콘솔창에서 확인 가능)
        //math.ramdom으로 도는 각도 제각각으로 만들기
    }
    renderer.render(scene, camera);

};

init();
render();