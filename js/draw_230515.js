// obj 파일에서 v는 버텍스 vn은 버텍스 노말(점의 법선벡터) f는 페이스 
// 버텍스의 인덱스(몇번째v)//버텍스 노말의 인덱스(8874/(비어있는숫자)/8874)
// obj의 인덱스는 1부터 시작

var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: true });
var camera = new THREE.PerspectiveCamera(75, 1.0, 0.1, 1000);
var controls = new THREE.OrbitControls(camera, renderer.domElement);
var index = 0;

controls.enableDamping = true; // 부드러운 감속 효과 활성화
//controls.dampingFactor = 0.05;
//controls.rotateSoeed  = 5;
controls.autoRotate = true; //자동회전

function loadOBJ(url) {
  var loader = new THREE.OBJLoader();
  // instantiate a loader
  // load a resource
  loader.load(
    // resource URL
    url,
    // called when resource is loaded
    function (object) {

      scene.add(object);

    },
    // called when loading is in progresses
    function (xhr) {

      console.log((xhr.loaded / xhr.total * 100) + '% loaded');

    },
    // called when loading has errors
    function (error) {

      console.log('An error happened');

    }
  );
}

function initLight() {
  var pointLight0 = new THREE.PointLight(0xffffff);
  pointLight0.position.set(10, 0, 10);
  scene.add(pointLight0);
}

function initGeometry() {
  const axesHelper = new THREE.AxesHelper(); //x:red y:green z:blue 
  scene.add(axesHelper);
  loadOBJ("../models/weapon.obj");

}

function initRenderer() {
  camera.position.z = 5;
  controls.update();
  renderer.setClearColor("#000000");
  renderer.setSize(500, 500);
  // Append Renderer to DOM
  document.body.appendChild(renderer.domElement);
}

function init() {
  initLight();
  initGeometry();
  initRenderer();
}

// Render Loop
var render = function () {
  requestAnimationFrame(render);
  index++;
  controls.update();
  renderer.render(scene, camera);

  var light = scene.children[0];
  var angle = index * 0.01;
  var radius = 20;
  light.position.x = radius * Math.cos(angle);
  light.position.z = radius * Math.sin(angle);

  //secne.children[0].position.set(10*Math.cos(Math.PI*index/100),0,10*Math.sin(Math.PI*index/100))
};

init();
render();