import "./style.css";
import * as THREE from "three";
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//import * as dat from "dat.gui";
import testVertexShader from "./shaders/vertex.glsl";
import testFragmentShader from "./shaders/fragment.glsl";

// Debug
//const gui = new dat.GUI();

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

class CustomSinCurve extends THREE.Curve {
  constructor(scale = 1) {
    super();

    this.scale = scale;
  }

  getPoint(t, optionalTarget = new THREE.Vector3()) {
    t = Math.PI * 1000.0 * t * -0.168;
    const tx = Math.cos(2 * Math.PI * t);
    const ty = Math.sin(2 * Math.PI * t);
    const tz = 0;

    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
  }
}

const path = new CustomSinCurve(10);
const geometry = new THREE.TubeGeometry(path, 200, 2, 100, false);

const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 1.0 },
    reverb: { value: 1.0 },
  },
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  side: THREE.DoubleSide,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, 0, 25);
scene.add(camera);

// Controls
//const controls = new OrbitControls(camera, canvas);
//controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
const sound = new THREE.Audio(listener);

let isPlaying = false;

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load("audio/audio.mp3", function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);

  window.addEventListener("click", () => {
    if (isPlaying == false) {
      sound.play();
      isPlaying = true;
    } else if (isPlaying == true) {
      sound.pause();
      isPlaying = false;
    }
  });
});

const analyser = new THREE.AudioAnalyser(sound, 32);

const clock = new THREE.Clock();

const tick = () => {
  //controls.update();

  const elapsedTime = clock.getElapsedTime();
  material.uniforms.time.value = elapsedTime;
  const data = analyser.getAverageFrequency();
  material.uniforms.reverb.value = data;
  mesh.position.z = data * 0.05;

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
