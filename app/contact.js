import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.119.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/controls/DragControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js";

//GUI
// const gui = new dat.GUI({ closed: true, width: 400 });
// gui.hide()

// const parameters ={
//   color:0xff0000
// }

// gui.addColor(parameters,'color').onChange(() =>
// {
//   material.color.set(parameters.color)
// })




//Basic Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );
const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//const myCanvas = document.getElementById("myCanvas")
var mycanvas2 = document.getElementById("myCanvas2");

const renderer = new THREE.WebGLRenderer({ canvas: mycanvas2,alpha : true });

// renderer.setClearColor( 0xffffff, 0 );
// var renderer = new THREE.WebGLRenderer({ alpha: true });
//define size of the renderer
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

//updating the sizes of renderer ---> if resize happen
window.addEventListener("resize", () => {
  //update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //update renderer
  renderer.setSize(sizes.width, sizes.height);

  //update pixel ratio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//fulscreen
window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    mycanvas2.requestFullscreen();
    console.log("full");
  } else {
    document.exitFullscreen();
  }
});

renderer.setSize(sizes.width, sizes.height);
//set a min value for pixel ratio
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//camera.position.set(4,10,6);
// camera.lookAt(0,-3,0)

renderer.shadowMap.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;



//cubeTextureLoader

const cubeTextureLoader = new THREE.CubeTextureLoader();

// const environmentMapTexture = cubeTextureLoader.load([
  
//   "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2Fnx.png?v=1631112183589",
//   "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2Fny.png?v=1631112197227",
//   "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2Fnz.png?v=1631112222222",
//   "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2Fpx.png?v=1631112235367",
//   "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2Fpy.png?v=1631112252291",
//   "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2Fpz.png?v=1631112262226"
  
// ])



//add a texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(
  "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2FDigitalMirror%20(2).png?v=1630506453011"
);
const textureHeight = textureLoader.load(
  "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2Fshiraz%20topography%20Height%20Map%20(ASTER%2030m).png?v=1631298156620"
);
const alpha = textureLoader.load(
  "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2FwEtox.png?v=1630849719121"
);
const flower = textureLoader.load(
  "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2Fthree.js-master.png?v=1630849637432"
);


//Lights
const light1 = new THREE.AmbientLight("rgb(200,200,200)", 0.5);
scene.add(light1);
const light2 = new THREE.DirectionalLight(0xffffff, 0.01);
light2.position.set(2, 3, 4);
light2.castShadow = true;
 scene.add(light2);
const light3 = new THREE.PointLight(0xffffff, 0.5);
light3.position.x = 2;
light3.position.y = 3;
light3.position.z = 4;
scene.add(light3);

//Geometries
const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ map: flower });
const cube = new THREE.Mesh(geometry, material);
cube.userData = { URL: "https://vimeo.com/user137472407"};




cube.position.set(2, 1, 0);
cube.castShadow = true;
material.transparent = true;
material.alphaMap = alpha;
material.side = THREE.DoubleSide;
// cube.rotation.y = Math.PI / 4;

//scene.add(cube);


// const materialM = new THREE.MeshStandardMaterial();
// materialM.metalness = 0.45;
// materialM.roughness = 0.65;
// materialM.envMap = environmentMapTexture



// const geometryM1 = new THREE.BoxBufferGeometry(1, 1, 1);
// // const material = new THREE.MeshStandardMaterial({color:0xfffff});
// const cube1 = new THREE.Mesh(geometryM1, materialM);
// cube1.position.set(-4, 1, 0);
// cube1.castShadow = true;
//scene.add(cube1);


  const objLoader = new OBJLoader();
  objLoader.load(
    "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2FMyHead.obj?v=1631305362875",
    obj => {
      //add gui Color
      const parameters = {
        color: 0xff0000,
        spin: () => {
          console.log("boo0o0o");
        }
      };

     

      let material = new THREE.PointsMaterial({
        color: parameters.color,
        size: 0.01
      });
      const mesh = new THREE.Points(obj.children[0].geometry, material);

      mesh.position.set(0, -5, 0);
      mesh.scale.set(5,5,5)
      scene.add(mesh);

      // add gui(mesh.position,'y',0,5,0.01)
  

      //   }
      // }
 


//Adding Plane
const planeGeometry = new THREE.PlaneGeometry(100,100, 100, 100);
const material1 = new THREE.MeshStandardMaterial({ map: textureHeight });
material1.displacementMap = textureHeight;
material1.displacementScale = 5;
// material1.normalMap = .....

const plane = new THREE.Mesh(planeGeometry, material1);
//plane.position.y=-0.5
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
// scene.add(plane);

//Adding PlaneScreen
const planeScreen00 = new THREE.PlaneGeometry(2, 2);
const materialScreen00 = new THREE.MeshStandardMaterial("rgb(255, 0, 0)");
const planeScreen = new THREE.Mesh(planeScreen00, materialScreen00);
//plane.position.y=-0.5
//planeScreen.rotation.y = -Math.PI/2;
//plane.receiveShadow=true;
//scene.add(planeScreen)

//an array to store all 3d objects
let objects = [];

//setting button states
let removeState = false;
let objName;

//orbitControls view
const orbitControls = new OrbitControls(camera, renderer.domElement);
// scene.add(orbitControls);
//dragControl

  if (removeState) {
    objects.splice(event.object.name, 1);
    scene.remove(event.object);
    for (let i = 0; i < objects.length; i++) {
      objects[i].name = i;
    }
  }
      
      
      
//............................................................................
//add a font
// const fontLoader = new THREE.FontLoader()
// fontLoader.load('Arial_Bold Italic.json',
// (font) =>
// { const textGeometry2=new THREE.TextBufferGeometry(
//   'THREE.JS',{
//     font:font,
//     size:0.5,
//     height:0.2,
//     curveSegments:6,
//     bevelEnabled :true,
//     bevelThickness:0.03,
//     bevelSize: 0.02,
//     bevelOffset:0,
//     bevelSegments:3
//   }
// )
//   const textGeometry = new THREE.TextBufferGeometry(
//   'Hanif',
//     {
//     font:font,
//     size:0.3,
//     height:0.2,
//     curveSegments:6,
//     bevelEnabled :true,
//     bevelThickness:0.03,
//     bevelSize: 0.02,
//     bevelOffset:0,
//     bevelSegments:3
//     }
//   )
//  textGeometry.center()
//  textGeometry2.center()
//   const textMaterial = new THREE.MeshNormalMaterial(/*{wireframe:true}*/)
//   const text = new THREE.Mesh(textGeometry,textMaterial)
//   const text2 = new THREE.Mesh(textGeometry2,textMaterial)
//   text.position.set(2,2,0)
//   scene.add(text,text2)
// }
// )

const cursor ={
  x:0,
  y:0
}

window.addEventListener("mousemove",(event) =>{
  cursor.x = event.clientX/sizes.width - 0.5
  cursor.y = (event.clientY/sizes.height )-0.2
  
})





//Everything inside this function can be a animation
function animate() {
  requestAnimationFrame(animate);


//   cube.rotation.y -= 0.01;
//   cube1.rotation.y += 0.01;
  mesh.rotation.y += 0.01
  //planeScreen.rotation.y +=0.01;
  //cube.rotation.y+=0.01;
  //cube.position.y=Math.abs(Math.sin(cube.rotation.y))
  //cube.rotation.z+=0.01;
  // renderer.render(scene, camera);
   if (!document.fullscreenElement) {
   //update camera
   camera.position.x =  cursor.x * 10;
   camera.position.y =  cursor.y * 10-1 ;
   camera.position.z =  +5;
   }
  camera.lookAt(0, -4, 0);

  // scene.background = environmentMapTexture
  
  renderer.render(scene,camera)
//   render();
  
  
  
  
//   function render(){
    
//     requestAnimationFrame(render)
//   }
}
animate();

         }
  );