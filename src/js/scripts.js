import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import starsTexture from '../img/stars.jpg';
import sunTexture from '../img/sun.jpg';
import mercuryTexture from '../img/mercury.jpg';
import venusTexture from '../img/venus.jpg';
import earthTexture from '../img/earth.jpg';
import marsTexture from '../img/mars.jpg';
import jupiterTexture from '../img/jupiter.jpg';
import saturnTexture from '../img/saturn.jpg';
import saturnRingTexture from '../img/saturn ring.png';
import uranusTexture from '../img/uranus.jpg';
import uranusRingTexture from '../img/uranus ring.png';
import neptuneTexture from '../img/neptune.jpg';
import plutoTexture from '../img/pluto.jpg';


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100000
)
camera.position.set(-200, 100, 50)

const orbit = new OrbitControls(camera, renderer.domElement)
orbit.update()

const ambientLight = new THREE.AmbientLight(0x333333, 2)
scene.add(ambientLight)

// const axisHelper = new THREE.AxesHelper(300);
// scene.add(axisHelper)

const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
])

const textureLoader = new THREE.TextureLoader()



const sunMap = textureLoader.load(sunTexture)
sunMap.colorSpace = THREE.SRGBColorSpace;
const sunGeometry = new THREE.SphereGeometry(20, 30, 30)
const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunMap
})
const sun = new THREE.Mesh(sunGeometry, sunMaterial)
scene.add(sun)
sunMaterial.needsUpdate = true;
sunMaterial.toneMapped = false


const createPlanet = (size, texture, position, ring) => {

    const map = textureLoader.load(texture)
    map.colorSpace = THREE.SRGBColorSpace
    const geometry = new THREE.SphereGeometry(size, 30, 30)
    const material = new THREE.MeshStandardMaterial({
        map: map
    })
    const planet = new THREE.Mesh(geometry, material)
    const planetObj = new THREE.Object3D()
    planetObj.add(planet)
    scene.add(planetObj)

    if (ring) {
        const rMap = textureLoader.load(ring.texture)
        rMap.colorSpace = THREE.SRGBColorSpace
        const rGeo = new THREE.RingGeometry(
            ring.innerRad,
            ring.outerRad,
            32
        )
        const rMat = new THREE.MeshStandardMaterial({
            map: rMap,
            side: THREE.DoubleSide
        })
        const Ring = new THREE.Mesh(rGeo, rMat)
        Ring.rotation.x = ring.rotation
        planet.add(Ring)
    }

    planet.position.set(position, 0, 0)
    return { planet, planetObj }
}

// exact sun size with respect to planets
// i.e. (sun radius / planet radius)

// 284
// 114.8
// 109
// 204
// 9.7
// 11.53
// 27.19
// 28
// 604

const mercury = createPlanet(3.2, mercuryTexture, 28, 0)
const venus = createPlanet(5.8, venusTexture, 44, null)
const earth = createPlanet(6, earthTexture, 62, 0)
const mars = createPlanet(4, marsTexture, 78, 0)
const jupiter = createPlanet(12.0927, jupiterTexture, 100, 0)
const saturnRing = {
    "innerRad": 10,
    "outerRad": 13,
    "rotation": -0.6 * Math.PI,
    "texture": textureLoader.load(saturnRingTexture)
}
const saturn = createPlanet(10.6019, saturnTexture, 138, saturnRing)
const uranusRing = {
    "innerRad": 10,
    "outerRad": 12,
    "rotation": -0.8 * Math.PI,
    "texture": textureLoader.load(uranusRingTexture)
}
const uranus = createPlanet(7.079, uranusTexture, 176, uranusRing)
const neptune = createPlanet(7.71, neptuneTexture, 200, 0)
const pluto = createPlanet(2.8996, plutoTexture, 216, 0)


const pointLight = new THREE.PointLight(0xFFFFFF, 22000, 300)
scene.add(pointLight)

scene.fog = new THREE.Fog(0xffffff, 0, 7000)


const animate = () => {
    sun.rotateY(0.0004)
    mercury.planet.rotateY(0.00017)
    venus.planet.rotateY(0.0000411)
    earth.planet.rotateY(0.01)
    mars.planet.rotateY(0.009)
    saturn.planet.rotateY(0.025)
    jupiter.planet.rotateY(0.027)
    uranus.planet.rotateX(0.015)
    neptune.planet.rotateY(0.018)
    pluto.planet.rotateY(0.00167)

    mercury.planetObj.rotateY(0.04);
    venus.planetObj.rotateY(0.015);
    earth.planetObj.rotateY(0.01);
    mars.planetObj.rotateY(0.008);
    jupiter.planetObj.rotateY(0.002);
    saturn.planetObj.rotateY(0.0009);
    uranus.planetObj.rotateY(0.0004);
    neptune.planetObj.rotateY(0.0001);
    pluto.planetObj.rotateY(0.00007);

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})