import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import GUI from 'lil-gui'
// import typefaceFont from '/textures/fonts/Thunder Black_Regular.json?url'
// console.log(typefaceFont)
/**
 * Base
 */
// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/9.jpg')
const matcapTexture1 = textureLoader.load('/textures/matcaps/11.jpg')
console.log(matcapTexture1)

const fontLoader = new FontLoader()

fontLoader.load(
    '/textures/fonts/Thunder Light_Regular.json',
    (font)=>
    {
        const textGeometry = new TextGeometry(
            'PDF CHATBOT',
            {
                font,
                size: 0.5,
                height: 0.2,
                curveSegments: 3,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.01,
                bevelOffset: 0,
                bevelSegments: 4
            }
        ) 
        // textGeometry.computeBoundingBox()
        // console.log(textGeometry.boundingBox)
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - 0.01) * 0.5,
        //     - (textGeometry.boundingBox.max.y - 0.01) * 0.5,
        //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5
        // )
        textGeometry.center()
        // const textMaterial = new THREE.MeshBasicMaterial({color:'#FDD023'})
        const textMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
        // const textMaterial = new THREE.MeshNormalMaterial()
        // textMaterial.wireframe = true
        const text = new THREE.Mesh(textGeometry,textMaterial)
        scene.add(text)

        console.time('donuts')
        const donutGeometry = new THREE.TorusGeometry(0.3,0.2,20,45)
        const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture1})

        for(let i = 0; i < 150; i++)
        {
            const donut = new THREE.Mesh(donutGeometry,donutMaterial)

            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            donut.scale.x = scale
            donut.scale.y = scale
            donut.scale.z = scale

            scene.add(donut)
        }

        console.timeEnd('donuts')

    }
)
// cant use object for load like texture

// const Axeshelper = new THREE.AxesHelper()
// scene.add(Axeshelper)

/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

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

function sleep(miliseconds) {
    var currentTime = new Date().getTime();
 
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
 }

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let z = camera.position.z
const zfin = 1
function animate(){
    z-=0.1
    if(z>zfin)
        camera.position.z = z
    else
        canvas.remove()
    renderer.render(scene,camera)
}

window.addEventListener('keydown',(event)=>{
    console.log(event.key)
    if(event.key === 'Enter')
    {
        z = camera.position.z
        renderer.setAnimationLoop(animate)
    }
})


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