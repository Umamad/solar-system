import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Assets imports
import starsTexture from "./img/stars.jpg";
import sunTexture from "./img/sun.jpg";
import mercuryTexture from "./img/mercury.jpg";
import venusTexture from "./img/venus.jpg";
import earthTexture from "./img/earth.jpg";
import marsTexture from "./img/mars.jpg";
import jupiterTexture from "./img/jupiter.jpg";
import saturnTexture from "./img/saturn.jpg";
import saturnRingTexture from "./img/saturn ring.png";
import uranusTexture from "./img/uranus.jpg";
import uranusRingTexture from "./img/uranus ring.png";
import neptuneTexture from "./img/neptune.jpg";
import plutoTexture from "./img/pluto.jpg";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();

const pointLight = new THREE.PointLight(0xffffff, 10000, 1000);
scene.add(pointLight);

const textureLoader = new THREE.TextureLoader();

// Sun
const sunGeometry = new THREE.SphereGeometry(16, 30, 30);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

/**
 * Creates planet and planet object
 * @param {number} size Size of planet
 * @param {THREE.Texture} texture Texture of planet
 * @param {number} position Planet distance from sun
 * @param {{innerRadius: number, outerRadius: number, texture: THREE.Texture} | undefined} ring Detail of planet ring
 * @returns {{ mesh: THREE.Mesh, object: THREE.Object3D<THREE.Object3DEventMap> }} planet and group object
 */
function createPlanet(size, texture, position, ring) {
  const planetGeometry = new THREE.SphereGeometry(size, 30, 30);
  const planetMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planet.position.setX(position);
  const planetObject = new THREE.Object3D();
  planetObject.add(planet);

  if (ring) {
    const planetRingGeometry = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const planetRingMaterial = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const planetRing = new THREE.Mesh(planetRingGeometry, planetRingMaterial);
    planetRing.position.setX(position);
    planetRing.rotateX(-0.5 * Math.PI);
    planetObject.add(planetRing);
  }

  scene.add(planetObject);

  return {
    mesh: planet,
    object: planetObject,
  };
}

const mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(5.8, venusTexture, 44);
const earth = createPlanet(6, earthTexture, 62);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);
const saturn = createPlanet(10, saturnTexture, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture,
});
const uranus = createPlanet(7, uranusTexture, 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusRingTexture,
});
const neptune = createPlanet(7, neptuneTexture, 200);
const pluto = createPlanet(2.8, plutoTexture, 216);

function animate() {
  // Self Rotation
  sun.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);
  pluto.mesh.rotateY(0.008);

  // Rotation around sun
  mercury.object.rotateY(0.04);
  venus.object.rotateY(0.015);
  earth.object.rotateY(0.01);
  mars.object.rotateY(0.008);
  jupiter.object.rotateY(0.002);
  saturn.object.rotateY(0.0009);
  uranus.object.rotateY(0.0004);
  neptune.object.rotateY(0.0001);
  pluto.object.rotateY(0.00007);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
