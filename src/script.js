import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import Typed from 'typed.js'

// TYPED
var typed = new Typed('.typed-element', 
    {
        strings: [
          "ForestFire Engineering",
          "Cycling",
          "Software Development",
          "Piano",
          "Design",
          "Artificial Intelligence",
          "Adventure"
        ],
        typeSpeed: 60,
        backSpeed: 50,
        loop:true,
      }
  );


// THREEJS




// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Materials

    const textureLoader = new THREE.TextureLoader()

    // const sunTexture = textureLoader.load('./textures/NormalMap.png')
    // const earthNormalMap = textureLoader.load('./textures/earthMap.png')

    // const sunMaterial = new THREE.MeshStandardMaterial()
    // sunMaterial.metalness = 0.7
    // sunMaterial.roughness = 0.2
    // sunMaterial.normalMap = sunTexture;
    // sunMaterial.color = new THREE.Color(0xffffff)

    // const earthMaterial = new THREE.MeshStandardMaterial()
    // earthMaterial.normalMap = earthNormalMap;

    const basicMaterial = new THREE.MeshBasicMaterial()

// Sun
    // const sunGeometry = new THREE.SphereBufferGeometry( .4, 64, 64 );
    // const sun = new THREE.Mesh(sunGeometry, sunMaterial)
    const sun = createEarth(.4, 64)
    scene.add(sun)


// Earth
function createEarth(radius, segments) {
    return new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, segments),
        new THREE.MeshPhongMaterial({
            map:         textureLoader.load('./images/2_no_clouds_4k.jpg'),
            bumpMap:     textureLoader.load('./images/elev_bump_4k.jpg'),
            bumpScale:   0.005,
            specularMap: textureLoader.load('/.images/water_4k.png'),
            specular:    new THREE.Color('grey')								
        })
    );
}

function createPlanet(radius, segments, planet) {
    return new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, segments),
        new THREE.MeshPhongMaterial({map:textureLoader.load(`./images/2k_${planet}.jpg`)})
    );
}

    const earth = createPlanet(.1, 64, 'moon')
    earth.position.set(0,0,-1); // offset from center
    var earthContainer = new THREE.Object3D();
    earthContainer.add(earth)
    scene.add(earthContainer)


    // Mars
    const mars = createPlanet(.2, 64, 'mars')
    mars.position.set(2,3,-4);
    scene.add(mars)

    // TORUS
    const geometry2 = new THREE.TorusGeometry( 1.5, .05, 16, 100, );
    const torus = new THREE.Mesh(geometry2, basicMaterial)
    scene.add(torus)


    // STARS

    const pointsMaterial = new THREE.PointsMaterial(
        {
            transparent: true,
            size:0.005,
            color:'white',
        }
    )


    const particlesGeometry = new THREE.BufferGeometry;
    const particlesCnt = 5000;

    const posArray = new Float32Array(particlesCnt * 3)

    for (let i = 0; i < posArray.length; i++) {
        posArray[i] = (Math.random() -0.5) * 5
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    const particlesMesh = new THREE.Points(particlesGeometry, pointsMaterial)
    scene.add(particlesMesh)


// Light1

scene.add(new THREE.AmbientLight(0x777777));

const pointLight = new THREE.PointLight(0xff0000, 0.1)
pointLight.position.set(-1,1,-.5)
pointLight.intensity = 0
scene.add(pointLight)

const light1 = gui.addFolder('Light 1')
light1.add(pointLight.position, 'x').min(-3).max(3).step(0.01) 
light1.add(pointLight.position, 'y').min(-3).max(3).step(0.01) 
light1.add(pointLight.position, 'z').min(-3).max(3).step(0.01) 
light1.add(pointLight, 'intensity').min(-3).max(3).step(0.01) 

const pointLightHelper1 = new THREE.PointLightHelper(pointLight, 1)
scene.add(pointLightHelper1)

// Light2

const pointLight2 = new THREE.PointLight(0x76ff76, 0.1)
pointLight2.position.set(1,1,-.5)
pointLight2.intensity = 0
scene.add(pointLight2)

const light2 = gui.addFolder('Light 2')
light2.add(pointLight2.position, 'x').min(-3).max(3).step(0.01) 
light2.add(pointLight2.position, 'y').min(-3).max(3).step(0.01) 
light2.add(pointLight2.position, 'z').min(-3).max(3).step(0.01) 
light2.add(pointLight2, 'intensity').min(-3).max(3).step(0.01)

const light2Color = {
    color: 0xff0000
}

light2.addColor(light2Color, 'color').onChange(
    ()=>{
        pointLight2.color.set(light2Color.color)
    }
)

const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1)
scene.add(pointLightHelper)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2.5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */


document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth /2;
const windowY = window.innerHeight /2;


function onDocumentMouseMove(event){
    mouseX = (event.clientX - windowX)
    mouseY = (event.clientY - windowY)
}


window.addEventListener('scroll', updateSphere)

function updateSphere(event){
    
    if(this.oldScroll > this.scrollY){
        mars.position.y += window.scrollY * .003
        camera.position.z -= window.scrollY * .0005
    } else {
        mars.position.y -= window.scrollY * .003
        camera.position.z += window.scrollY * .0005
    }
    this.oldScroll = this.scrollY;
}


const clock = new THREE.Clock()
torus.rotation.x = -1

const tick = () =>
{

    targetX = mouseX * .001
    targetY = mouseY * .001

    const elapsedTime = clock.getElapsedTime()

    // On Mouse Move
    mars.rotation.y += .7*(targetX - mars.rotation.y)
    mars.rotation.x += .7*(targetY - mars.rotation.x)
    mars.position.z += .7*(targetY - mars.rotation.x)
    
    // Update objects
    sun.rotation.y = .5 * elapsedTime
    

    earth.rotation.y += 0.01; // rotate around its own axis
    earth.rotation.y = .5 * elapsedTime
    earthContainer.rotation.y += 0.01; // rotate around center    
    

    torus.rotation.y = -.3 * elapsedTime
    
    mars.rotation.y = .7 * elapsedTime

    particlesMesh.rotation.y = -.1* elapsedTime
    if (mouseX > 0){
        particlesMesh.rotation.x = -mouseY * (elapsedTime * .00008)
        particlesMesh.rotation.y = -mouseX * (elapsedTime * .00008)
    }
        

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


var changePlanet = document.getElementById('changePlanetButton');

changePlanet.onclick = function(){
    let planets = ['moon', 'mars', 'neptune']
    var planet = planets[Math.floor(Math.random() * planets.length)];
    earth.material.map = textureLoader.load(`./images/2k_${planet}.jpg`)
}

// // Created by Bjorn Sandvik - thematicmapping.org

// 	var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
// 	camera.position.z = 1.5;

// 	var renderer = new THREE.WebGLRenderer();
// 	renderer.setSize(width, height);

// => MAYBE LIGHT
// 	scene.add(new THREE.AmbientLight(0x333333));

// 	var light = new THREE.DirectionalLight(0xffffff, 1);
// 	light.position.set(5,3,5);
// 	scene.add(light);

// => HOW TO OTHER ELEMENTS
//     var sphere = createSphere(radius, segments);
// 	sphere.rotation.y = rotation; 
// 	scene.add(sphere)

// => HOW TO OTHER ELEMENTS
//     var clouds = createClouds(radius, segments);
// 	clouds.rotation.y = rotation;
// 	scene.add(clouds)

// 	var stars = createStars(90, 64);
// 	scene.add(stars);

// 	var controls = new THREE.TrackballControls(camera);

// 	webglEl.appendChild(renderer.domElement);

// 	render();

// 	function render() {
// 		controls.update();
// 		sphere.rotation.y += 0.0005;
// 		clouds.rotation.y += 0.0005;		
// 		requestAnimationFrame(render);
// 		renderer.render(scene, camera);
// 	}

// 	function createSphere(radius, segments) {
// 		return new THREE.Mesh(
// 			new THREE.SphereGeometry(radius, segments, segments),
// 			new THREE.MeshPhongMaterial({
// 				map:         THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
// 				bumpMap:     THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
// 				bumpScale:   0.005,
// 				specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
// 				specular:    new THREE.Color('grey')								
// 			})
// 		);
// 	}

// 	function createClouds(radius, segments) {
// 		return new THREE.Mesh(
// 			new THREE.SphereGeometry(radius + 0.003, segments, segments),			
// 			new THREE.MeshPhongMaterial({
// 				map:         THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
// 				transparent: true
// 			})
// 		);		
// 	}

// => INTERESSANTE
// 	function createStars(radius, segments) {
// 		return new THREE.Mesh(
// 			new THREE.SphereGeometry(radius, segments, segments), 
// 			new THREE.MeshBasicMaterial({
// 				map:  THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'), 
// 				side: THREE.BackSide
// 			})
// 		);
// 	}

// }());