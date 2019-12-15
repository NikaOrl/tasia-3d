import { fragmentParams, vertex, vertexParams } from './shaders.js';

window.onload = function() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  var canvas = document.getElementById('canvas');

  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);

  var ball = {
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,

    positionX: 0,
    positionY: 0,
    positionZ: 0,
  };

  var gui = new dat.GUI();
  gui
    .add(ball, 'rotationX')
    .min(0)
    .max(9.5)
    .step(0.001);
  gui
    .add(ball, 'rotationY')
    .min(0)
    .max(9.5)
    .step(0.001);
  gui
    .add(ball, 'rotationZ')
    .min(0)
    .max(9.5)
    .step(0.001);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Vrodee toje dlya teney nado
  renderer.shadowMapEnabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 5000);
  camera.position.set(0, 150, 1000);
  camera.lookAt(0, 0, 0);
  //   const color = 0xffffff;
  //   const intensity = 3;

  // Это настроить не получилось
  //   var light = new THREE.DirectionalLight(color, intensity);
  //   light.position.set(50, 180, 190);
  //   light.target.position.set(0, 20, 5);

  // Точечный свет
  const light = new THREE.PointLight(0xffffff, 2, 600);
  light.position.set(0, 200, 100);
  light.shadow.camera.near = 100;
  light.shadow.camera.far = 1000;
  light.shadow.camera.left = -500;
  light.shadow.camera.bottom = -500;
  light.shadow.camera.right = 500;
  light.shadow.camera.top = 500;
  light.shadow.bias = -0.005; // reduces self-shadowing on double-sided objects
  light.castShadow = true; // default false
  scene.add(light);

  // Общий свет
  var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  //eto chtob ponyat' kuda svetit
  var helper = new THREE.CameraHelper(light.shadow.camera);
  scene.add(helper);

  //eto rukoyatka pistoleta
  var geometry = new THREE.BoxGeometry(70, 200, 50, 2, 2, 2);
  const loader = new THREE.TextureLoader();
  const material = new THREE.MeshLambertMaterial({
    map: loader.load('js/L.jpg'),
  });
  material.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <shadowmap_pars_fragment>', fragmentParams);
    shader.vertexShader = shader.vertexShader.replace('#include <shadowmap_pars_vertex>', vertexParams);
    shader.vertexShader = shader.vertexShader.replace('#include <shadowmap_vertex>', vertex);
  };
  var mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true; //default is false
  mesh.receiveShadow = false; //default

  //eto KUDA padaet ten' za pistolet (orange)
  var geometry3 = new THREE.PlaneGeometry(1000, 1000);
  var material3 = new THREE.MeshPhongMaterial({ color: 0xff7f50 });
  var mesh3 = new THREE.Mesh(geometry3, material3);
  mesh3.castShadow = false; //default is false
  mesh3.receiveShadow = true; //default
  scene.add(mesh3);
  mesh3.position.set(0, 10, -200);

  //eto toje  KUDA padaet ten' tok pod postoletom (rijaya)
  var geometry4 = new THREE.BoxGeometry(500, 1, 500, 2, 2, 2);
  var material4 = new THREE.MeshLambertMaterial({ color: 0xa0522d });
  var mesh4 = new THREE.Mesh(geometry4, material4);
  mesh4.castShadow = false; //default is false
  mesh4.receiveShadow = true; //default
  scene.add(mesh4);
  mesh4.position.set(0, -100, 0);

  //dulo pistoleta
  var geometry1 = new THREE.SphereBufferGeometry(18, 18, 18);
  geometry1.scale(4, 2, 1.5);
  var material1 = new THREE.MeshPhongMaterial({ map: loader.load('js/M.jpg') });
  material1.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <shadowmap_pars_fragment>', fragmentParams);
    shader.vertexShader = shader.vertexShader.replace('#include <shadowmap_pars_vertex>', vertexParams);
    shader.vertexShader = shader.vertexShader.replace('#include <shadowmap_vertex>', vertex);
  };
  var mesh1 = new THREE.Mesh(geometry1, material1);
  mesh1.castShadow = true; //default is false
  mesh1.receiveShadow = false; //default
  mesh1.position.y = 55;
  mesh1.position.x = 130;
  mesh1.position.z = 0;

  scene.add(mesh1);

  var group = new THREE.Group();
  group.add(mesh);
  group.add(mesh1);
  group.castShadow = true; //default is false
  group.receiveShadow = false; //default
  scene.add(group);

  function loop() {
    group.rotation.x = ball.rotationX;
    group.rotation.y = ball.rotationY;
    group.rotation.z = ball.rotationZ;

    renderer.render(scene, camera);
    requestAnimationFrame(function() {
      loop();
    });
  }
  loop();
};
