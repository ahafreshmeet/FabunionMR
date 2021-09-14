import './style.css'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Mesh } from 'three'
import { Vector3 } from 'three'

// /**
//  * Spector JS
//  */
// const SPECTOR = require('spectorjs')
// const spector = new SPECTOR.Spector()
// spector.displayUI()

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()


// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTexture = textureLoader.load('09121.jpg')
bakedTexture.flipY = false
const baked2Texture = textureLoader.load('111.jpg')
baked2Texture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding
baked2Texture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
const baked2Material = new THREE.MeshBasicMaterial({ map: baked2Texture })

/**
 * Model
 */
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0x99BBFF })
const poleL2ightMaterial = new THREE.MeshBasicMaterial({ color: 0x99BBFF })
gltfLoader.load(
    '0912.glb',
    (gltf) =>
    {
        gltf.scene.traverse((child)=>{child.material = bakedMaterial})
        
        
        


        scene.add(gltf.scene)
    }
)

gltfLoader.load(
    '11111led.glb',
    (gltf) =>
    {gltf.scene.traverse((child)=>{child.material = baked2Material})
        const li = gltf.scene.children.find((child) =>
        {return child.name ==='Cylinder'})
        console.log(li)
        const mesh008 = gltf.scene.children.find((child) =>
        {return child.name ==='Mesh008'})
        gui.add(mesh008.position, 'x').min(- 3).max(3).step(0.01).name('x')
        gui.add(mesh008.position, 'z').min(- 3).max(3).step(0.01).name('y')
        gui.add(mesh008.rotation, 'y').min(- Math.PI * 1).max(Math.PI * 1).step(0.01).name('rotateZ')
        console.log(mesh008)
       
        scene.add(gltf.scene)
    }
)
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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -40
camera.position.y = 30
camera.position.z = -40


scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()