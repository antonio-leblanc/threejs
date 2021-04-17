import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

//loaging
const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load('./textures/NormalMap.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const geometry = new THREE.SphereBufferGeometry( .4, 64, 64 );

// Materials - Skin

// const material = new THREE.MeshBasicMaterial()
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2

material.normalMap = normalTexture;

material.color = new THREE.Color(0xffffff)

// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)


// OTHER Material
// Objects
const geometry2 = new THREE.TorusGeometry( 1.2, .15, 16, 100 );

// Materials - Skin

// const material = new THREE.MeshBasicMaterial()
const material2 = new THREE.MeshStandardMaterial()
material2.metalness = 0.7
material2.roughness = 0.2

material2.normalMap = normalTexture;

material2.color = new THREE.Color(0xffffff)

// Mesh
const torus = new THREE.Mesh(geometry2,material2)
scene.add(torus)


// Light1

const pointLight = new THREE.PointLight(0xff0000, 0.1)
pointLight.position.set(-1,1,-3)
pointLight.intensity = 2
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
pointLight2.position.set(1,1,-3)
pointLight2.intensity = 2
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
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

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
    sphere.position.y = window.scrollY * .001
}

const clock = new THREE.Clock()

const tick = () =>
{

    targetX = mouseX * .001
    targetY = mouseY * .001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    sphere.rotation.y += .5*(targetX - sphere.rotation.y)
    sphere.rotation.x += .5*(targetY - sphere.rotation.x)
    sphere.position.z += .5*(targetY - sphere.rotation.x)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()



// // Created by Bjorn Sandvik - thematicmapping.org
// (function () {

// 	var webglEl = document.getElementById('webgl2');

// 	if (!Detector.webgl) {
// 		Detector.addGetWebGLMessage(webglEl);
// 		return;
// 	}

// 	var width  = window.innerWidth,
// 		height = window.innerHeight;

// 	// Earth params
// 	var radius   = 0.5,
// 		segments = 32,
// 		rotation = 6;  

// 	var scene = new THREE.Scene();

// 	var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
// 	camera.position.z = 1.5;

// 	var renderer = new THREE.WebGLRenderer();
// 	renderer.setSize(width, height);

// 	scene.add(new THREE.AmbientLight(0x333333));

// 	var light = new THREE.DirectionalLight(0xffffff, 1);
// 	light.position.set(5,3,5);
// 	scene.add(light);

//     var sphere = createSphere(radius, segments);
// 	sphere.rotation.y = rotation; 
// 	scene.add(sphere)

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