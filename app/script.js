import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.119.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/controls/DragControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/math/MeshSurfaceSampler.js";
import { GUI } from "https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/libs/dat.gui.module.js";
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/loaders/OBJLoader.js";
import { PLYLoader } from "https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/loaders/PLYLoader.js";
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.7.1/src/all.js"; 


//.................................................................................................................
//SHADERS
//.................................................................................................................
//  const _VS =`
//       uniform mat4 projectionMatrix;
//       uniform mat4 viewMatrix;
//       uniform mat4 modelMatrix;
      
//       attribute vec3 position;
//       attribute float aRandom;
      
//       varying float vRandom;
      
//       void main()
//       {
//       vec4 modelPosition = modelMatrix * vec4(position,1.0);
//       // modelPosition.z +=sin(modelPosition.x * 2.0)*0.3;
//       modelPosition.z +=aRandom;
      
//       vec4 viewPosition = viewMatrix * modelPosition;
//       vec4 projectionPosition = projectionMatrix * viewPosition;
      
//       gl_Position = projectionPosition;
      
//       vRandom = aRandom;
      
//       // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
//       }`;

//  const _FS =`
//     precision mediump float;
//     varying float vRandom;
  
//       void main()
//       {
//         gl_FragColor = vec4(0.5,vRandom,0.5,vRandom);
//       }`;

const _VS =`
      uniform mat4 projectionMatrix;
      uniform mat4 viewMatrix;
      uniform mat4 modelMatrix;
      
      uniform vec2 uFrequency;
      uniform float uTime;
      
      attribute vec3 position;
      attribute vec2 uv;
      
      varying vec2 vUv;
      varying float vElevation;
      
      
      void main()
      {
      vec4 modelPosition = modelMatrix * vec4(position,1.0);
      
      float elevation = sin(modelPosition.x *uFrequency.x+uTime) *0.3;
      elevation += sin(modelPosition.y *uFrequency.y+uTime) *0.3;
      
      modelPosition.z +=elevation;
      
      // modelPosition.z += sin(modelPosition.x *uFrequency.x+uTime) *0.3;
      // modelPosition.z += sin(modelPosition.y *uFrequency.y+uTime) *0.3;
      
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectionPosition;
      
      vUv = uv; 
      vElevation = elevation;
      
      }`;

 const _FS =`
    precision mediump float;
    
    uniform vec3 uColor;
    uniform sampler2D uTexture;
    varying vec2 vUv;
    varying float vElevation;
    
      void main()
      {
        vec4 textureColor = texture2D(uTexture,vUv);
        textureColor.rgb *= vElevation*1.0+0.75;
        // gl_FragColor = vec4(uColor,1.0);
        gl_FragColor = textureColor;
      }`;


//.............................................................
const loadingManager = new THREE.LoadingManager();

// loadingManager.onStart =function(url,item,total){
//   console.log(`Started loading:${url}`)
// }
const progressBar = document.getElementById('progress-bar');

loadingManager.onProgress = function(url,loaded,total){
  progressBar.value =(loaded/total)*100;
}

const progressBarContainer =document.querySelector('.progress-bar-container');
const loadedScreen=document.querySelector('.dis');

loadingManager.onLoad =function(){
  progressBarContainer.style.display='none';
  loadedScreen.style.display ='block';
}
// loadingManager.onError = function(url){
//   console.error(`Got a problem: ${url}`)
// }




//.................................................................................................................................
//LOADS
//.................................................................................................................................
const textureLoader = new THREE.TextureLoader(loadingManager);

const shaderTexture = textureLoader.load("https://cdn.glitch.global/309d23f3-97b6-48d9-949a-fe537a9061ec/pattern.png?v=1654890694526");


// const cubeTextureLoader = new THREE.CubeTextureLoader();
// const environmentMapTexture = cubeTextureLoader.load([
//   "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2Fnx.png?v=1631112183589",
//   "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2Fny.png?v=1631112197227",
//   "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2Fnz.png?v=1631112222222",
//   "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2Fpx.png?v=1631112235367",
//   "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2Fpy.png?v=1631112252291",
//   "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2Fpz.png?v=1631112262226",
// ]);

//HEIGHTMAP
const textureHeight = textureLoader.load(
  "https://cdn.glitch.com/be7e5bc8-50e1-4158-8663-22e2ada2e05a%2Fshiraz%20topography%20Height%20Map%20(ASTER%2030m).png?v=1631298156620"
);
//KHATAI
const textureKhataiRot = textureLoader.load(
  "https://cdn.glitch.global/d054f2d2-27cb-4c0a-8610-185d84e174dc/Khatai-01.png?v=1641758169110"
);




//..............................................................
//GUI
//..............................................................
//const gui = new GUI({ closed: true, width: 400 });


//mousePosition
//..............................................................
const mouse = new THREE.Vector2()
window.addEventListener('mousemove',() =>
{                       
 mouse.x = event.clientX / sizes.width * 2 - 1;
 mouse.y = - (event.clientY / sizes.height * 2 - 1);
})


//.................................................................................................................................
//Basic Scene
//.................................................................................................................................

const scene = new THREE.Scene();
// scene.background = new THREE.Color("black");
const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.01,
  100
);
//const initialCamPos = new THREE.Vector3(0,0,0)
//camera.position.set(0,-5,0);

//Fog
scene.fog = new THREE.Fog(0x370018, 0.005, 100);
//.................................................................................................................
//Background
scene.background = new THREE.Color(0x000000);
// scene.background = environmentMapTexture







const raycaster = new THREE.Raycaster()

//clock = new THREE.Clock();
	

//..............................................................
//OVERLAY....SHADER.......................................................
const overlayGeometry = new THREE.PlaneBufferGeometry(2,2,1,1)
const overlayMaterial = new THREE.ShaderMaterial({
  transparent:true,
  depthWrite: true,
  uniforms:
  {
    uAlpha :{ value:1}
  },
  vertexShader:`
  void main()
  {
    gl_Position =vec4(position,1.0);
  }
`
 ,
  fragmentShader:`
  uniform float uAlpha;
  void main()
  {
    gl_FragColor = vec4(0.0,0.0,0.0,uAlpha);
  }
`
,
  wireframe : true
})
const overlay = new THREE.Mesh(overlayGeometry,overlayMaterial)
//scene.add(overlay)



// const loadingBarElement = document.querySelector('.loading-bar')







//..............................................................
//LoadingManager
// const loadingManager = new THREE.LoadingManager(
// // Loaded
//   () =>
//   {
//     gsap.delayedCall(0.5,()=>
//     {
//     gsap.to(overlayMaterial.uniforms.uAlpha,{duration:3,value:0})
//     gsap.to(overlayMaterial,{duration:3,depthWrite:false})
//     //gsap.to(document.getElementById("myCanvas").style,{duration:3,zIndex:"-1"});
//     loadingBarElement.classList.add('ended')
//     loadingBarElement.style.transform = ''
//     })
//   },
  
//   //progress
//   (itemUrl,itemsLoaded,itemsTotal) =>
//   {
//     const progressRatio = itemsLoaded / itemsTotal
//     loadingBarElement.style.transform = `scaleX(${progressRatio})`
//   }
//   //onLoad
  
// )







//Stats.........................................................
//let stats = new Stats;
//document.body.appendChild(stats.dom)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#myCanvas"),
  antialias: true,
  alpha: true,
  physicallyCorrectLights: true,
});
//define size of the renderer
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);

// renderer.render(scene,camera)

//Geometry....................................................................

//............................................................................
//add a font
/*const fontLoader = new THREE.FontLoader()
fontLoader.load('Arial_Bold Italic.json',
(font) =>
{
  const textGeometry = new THREE.TextBufferGeometry(
  'Hanif',
    {
    font:font,
    size:0.5,
    height:0.2,
    curveSegments:6,
    bevelEnabled :true,
    bevelThickness:0.03,
    bevelSize: 0.02,
    bevelOffset:0,
    bevelSegments:3
    }
  )
 textGeometry.center()
  const textMaterial = new THREE.MeshBasicMaterial({wireframe:true})
  const text = new THREE.Mesh(textGeometry,textMaterial)
  text.position.set(0,2,0)
  scene.add(text)
}
)*/

//3D Model Loader


//***animate geometry***
//.....................................................................................................

let tl = gsap.timeline();

/* Store each particle coordinates & color */
const vertices = [];
const colors = [];
/* The geometry of the points */
const sparklesGeometry = new THREE.BufferGeometry();
/* The material of the points */
const sparklesMaterial = new THREE.PointsMaterial({
  size: 0.25,
  alphaTest: 0.5,
  transparent: true,
  color: new THREE.Color("white"),
  alphaMap: new THREE.TextureLoader().load(
    "https://cdn.glitch.global/ad124ed0-c23e-477a-8c0a-281b186122df/1.png?v=1641830092931"
  ),
  sizeAtenuation: true,
  depthWrite: false,
  vertexColors: true, // Let Three.js knows that each point has a different color

  // const particleMaterial = new THREE.PointsMaterial()
  // particleMaterial.size = 0.5
  // particleMaterial.sizeAtenuation = true
  // particleMaterial.color = new THREE.Color('white')
  // particleMaterial.transparent = true
  // particleMaterial.alphaMap =particleTexture
  // particleMaterial.depthWrite =false
});
/* Create a Points object */
const points = new THREE.Points(sparklesGeometry, sparklesMaterial);
/* Add the points into the scene */
//scene.add(points);

let tlEslimi = gsap.timeline();
//...............................................................................................................
//Eslimi Cloud
//.........................................................................................................
// var myModelEslimi;
// const gltfLoaderEslimi = new GLTFLoader(loadingManager);
// gltfLoaderEslimi.load(
//   "https://cdn.glitch.global/c5205c1e-207c-4242-8c39-0e722dcfe87f/Eslimi(cloud)-02.glb?v=1656188423878",
//   (gltf) => {
//     myModelEslimi = gltf.scene;
//     myModelEslimi.scale.set(5, 5, 5);
    
//     myModel.position.set(0, 15,50);
//     // let material = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.25 })
//     // let mesh = new THREE.Points(gltf.children[0].geometry, material)
//     scene.add(myModelEslimi);
    
//     tlEslimi.to(gltf.scene.scale, { z:10 , duration: 150 });
    
    
    
//   }
// );

// let tlll = gsap.timeline();



//..................................................................................................................
//GENERATIVE GALLERY MODEL
//..................................................................................................................
let tlCryptoModel = gsap.timeline();
    
let mixerCrypto =null;
let myModel01Crypto=null;
const gltfLoader00Crypto = new GLTFLoader(loadingManager);
gltfLoader00Crypto.load(
  "https://cdn.glitch.global/309d23f3-97b6-48d9-949a-fe537a9061ec/Generative%20Gallery-07.glb?v=1655234301648",
  (gltf) => {
    
    myModel01Crypto = gltf.scene;
    myModel01Crypto.scale.set(1.75,1.75,1.75);
    myModel01Crypto.position.set(0, -20, -50);
    //myModel01Crypto.rotation.x = Math.PI / 2;
    
    
//     mixer = new THREE.AnimationMixer(gltf.scene);
//     for(let i=0;i<gltf.animations.length;i++){
//     const action = mixer.clipAction(gltf.animations[i]);
      
//     action.play();
//     }

    //method 02 => loading
    scene.add(myModel01Crypto);
    //***animate geometry***
    tlCryptoModel.to(gltf.scene.rotation, { y: Math.PI * 2, duration: 100 });
  }
);

let tlCrypto = gsap.timeline();

let video1 = document.getElementById("video1");
let videoTexture1 = new THREE.VideoTexture(video1);

var movieMaterial1 = new THREE.MeshBasicMaterial({
  map :videoTexture1,
  side:THREE.DoubleSide,
  toneMapped:true,
})

//create object to Display VIDEO

let movieGeometry1 =  new THREE.PlaneGeometry( 30, 30 );
let moviePlaneScreen = new THREE.Mesh(movieGeometry1,movieMaterial1);
moviePlaneScreen.position.set(0, -20, -48)
moviePlaneScreen.rotation.x = Math.PI/2;
scene.add(moviePlaneScreen);

//tlCrypto.to(moviePlaneScreen.rotation, { y: -Math.PI*2 , duration: 100 });


//..................................................................................................
//MOSHIR MOSQUE MODEL
//..................................................................................................

let sampler = null;
let elephant = null;
let path = [];
new OBJLoader(loadingManager).load(
  "https://cdn.glitch.global/ad124ed0-c23e-477a-8c0a-281b186122df/moshir-01-1.obj?v=1641831557486",
  (obj) => {
    elephant = obj.children[0];
    elephant.material = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0x0ffffff,
      transparent: true,
      opacity: 0.2
    });

    scene.add(obj);

    
    sampler = new MeshSurfaceSampler(elephant).build();

    // renderer.setAnimationLoop(render);
  },
  // (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
  // (err) => console.error(err)
);

//.................................................................................................
//DIGITAL MIRROR MODEL
//.................................................................................................
let video = document.getElementById("video");
let videoTexture = new THREE.VideoTexture(video);

var movieMaterial = new THREE.MeshBasicMaterial({
  map :videoTexture,
  side:THREE.FrontSide,
  toneMapped:true,
})

//create object to Display VIDEO

let movieGeometry = new THREE.BoxGeometry(2,2,2);
let movieCubeScreen = new THREE.Mesh(movieGeometry,movieMaterial);
movieCubeScreen.position.set(-4, 6.75, 50)
scene.add(movieCubeScreen);

let tlBody = gsap.timeline();

// tl.to(movieCubeScreen.rotation, { y: Math.PI * 5, duration: 150 });
    
var myModelBody;
const gltfLoader000 = new GLTFLoader(loadingManager);
gltfLoader000.load(
  "https://cdn.glitch.global/27250f9d-a482-44b7-a7a8-c8db2d5100a1/HumanHeadScreen-VOXEL-02.glb?v=1653402259169",
  (gltf) => {
    myModelBody = gltf.scene;
    myModelBody.scale.set(2, 2, 2);
    myModelBody.position.set(-4, 0, 50);
    scene.add(myModelBody);

    
   // tlBody.to(gltf.scene.rotation, { y: Math.PI * 5, duration: 150 });
    
  });

//.................................................................................................
//BLACKSTONE VAULT MODEL
//.................................................................................................

var myModel;
var bltest;
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.load(
  "https://cdn.glitch.com/79942d8b-a9cc-49c4-b8c6-ef866286f617%2Fvault-09.glb?v=1632735907212",
  (gltf) => {
    myModel = gltf.scene;
    myModel.scale.set(7, 7, 7);
    myModel.position.set(2, 0, 70);
    // let material = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.25 })
    // let mesh = new THREE.Points(gltf.children[0].geometry, material)
    bltest = gltf;
    scene.add(myModel);
    
    tl.to(gltf.scene.rotation, { y: Math.PI * 5, duration: 150 });
    
  }
  
);


let tlll = gsap.timeline();

//...................................................................................................
//Bio mask model
//...................................................................................................

var myModel02;
const gltfLoader01 = new GLTFLoader(loadingManager);
gltfLoader01.load(
  "https://cdn.glitch.me/79942d8b-a9cc-49c4-b8c6-ef866286f617%2FBioMask12.glb?v=1635101010434",
  (gltf) => {
    myModel02 = gltf.scene;
    myModel02.scale.set(0.05, 0.05, 0.05);
    //myModel02.position.z = 10;
    //myModel02.position.x = 5;
    myModel02.position.set(-4, 0, 90);
    myModel02.rotation.y = Math.PI/2
    //console.log(gltf);
    //method 02 => loading
    scene.add(myModel02);

    //***animate geometry***
    tlll.to(gltf.scene.rotation, { y: Math.PI * 10, duration: 200 });
  }
);
let tll = gsap.timeline();

//..................................................................................................................
//MIRRORS MODEL
//..................................................................................................................

let mixer =null;
let myModel01=null;
const gltfLoader00 = new GLTFLoader(loadingManager);
gltfLoader00.load(
  "https://cdn.glitch.global/27250f9d-a482-44b7-a7a8-c8db2d5100a1/mirrors07%2B_animation-14.glb?v=1645521981015",
  (gltf) => {
    
    myModel01 = gltf.scene;
    myModel01.scale.set(4, 4,4);
    myModel01.position.set(0, 4, 110);
    myModel01.rotation.x = Math.PI / 2;
    
    
    mixer = new THREE.AnimationMixer(gltf.scene);
    for(let i=0;i<gltf.animations.length;i++){
    const action = mixer.clipAction(gltf.animations[i]);
      
    action.play();
    }

    //method 02 => loading
    scene.add(myModel01);
    //***animate geometry***
    tll.to(gltf.scene.rotation, { z: Math.PI , duration: 200 });


  }
);

let tllll = gsap.timeline();

//..................................................................................................................
//MOQARNAS MODEL
//..................................................................................................................

var myModel03;
const gltfLoader02 = new GLTFLoader(loadingManager);
gltfLoader00.load(
  "https://cdn.glitch.me/79942d8b-a9cc-49c4-b8c6-ef866286f617%2FNODE2017.glb?v=1635454163935",
  (gltf) => {
    myModel03 = gltf.scene;
    myModel03.scale.set(1, 1, 1);
    myModel03.position.set(0, 4, 130);
    //myModel03.rotation.x = Math.PI ;

    //method 02 => loading
    scene.add(myModel03);
    //***animate geometry***
    tllll.to(gltf.scene.rotation, { z: Math.PI * 10, duration: 200 });
  }
);


/*
//---------------------------------------GEOMETRY INSIDE THREE.JS----------------------------------------------------
*/

//...................................................................................................................
//GEOUND PLANE
//...................................................................................................................

const planeGeometry = new THREE.PlaneBufferGeometry(100, 200, 100, 200);
const material1 = new THREE.MeshStandardMaterial({ map: textureHeight });
const plane = new THREE.Mesh(planeGeometry, material1);
plane.position.y = -1;
plane.rotation.x = -Math.PI / 2;
material1.displacementMap = textureHeight;
material1.displacementScale = 3;
material1.wireframe = true;
material1.point = true;
// material1.normalMap = .....
scene.add(plane);

//.....................................................................................................................
//sampleCubeToTestRaycasting...........................................................................................
//.....................................................................................................................

const boxGeometryex = new THREE.BoxGeometry(10,10,10,10);
const material1ex = new THREE.MeshStandardMaterial();
const planeex = new THREE.Mesh(boxGeometryex, material1ex);
planeex.position.z =10
//scene.add(planeex);
// //raycater............................................................................................................

// const raycaster = new THREE.Raycaster()
// const rayOrigin = new THREE.Vector3(0,0,15);
// const rayDirection = new THREE.Vector3(0,0,-1);
// rayDirection.normalize();
// raycaster.set(rayOrigin,rayDirection);
// const intersect = raycaster.intersectObject(planeex); 
// console.log(intersect)

//.....................................................................................................................
//khataiParticle
//.....................................................................................................................

const particleTexture = textureLoader.load(
  "https://cdn.glitch.global/d054f2d2-27cb-4c0a-8610-185d84e174dc/Khatai-01.png?v=1641758169110"
);

const particleMaterial = new THREE.PointsMaterial();



//.....................................................................................................................
//Torus
//.....................................................................................................................

const particleMaterial2 = new THREE.PointsMaterial();
particleMaterial.size = 1;
particleMaterial.sizeAtenuation = true;
particleMaterial.color = new THREE.Color("white");
particleMaterial.transparent = true;
particleMaterial.alphaMap = particleTexture;

const geometry = new THREE.PlaneBufferGeometry(8,8,32,32);

const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);

for(let i=0;i<count;i++){
  randoms[i] = Math.random();
}
geometry.setAttribute('aRandom',new THREE.BufferAttribute(randoms,1));

 //geometrydoubleSide: true
//const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
// const material = new THREE.MeshStandardMaterial({
//   map: particleTexture,
//   transparent:true,
//   alphaMap: particleTexture,
//   depthWrite : false,
//   side :  THREE.DoubleSide
// });
const material = new THREE.RawShaderMaterial({
  vertexShader:_VS,
  fragmentShader:_FS,
  //wireframe:true,
  side:THREE.DoubleSide,
  transparent:true,
  uniforms:
  {
    uFrequency:{ value:new THREE.Vector2(2,1)},
    uTime : { value:0},
    uColor : {value:new THREE.Color('purple')},
    uTexture : {value:shaderTexture}
  }
});

// gui.add(material.uniforms.uFrequency.value,'x').min(0).max(20).step(0.001).name('frequencyX');
// gui.add(material.uniforms.uFrequency.value,'y').min(0).max(20).step(0.001).name('frequencyY');
const turos = new THREE.Mesh(geometry, material);
//const particle1 = new THREE.Points(geometry, material);
//scene.add(turos);

//.................................................................................................................
//galaxy
//.................................................................................................................


/*
Geometry
*/
const parameters = {};
parameters.count = 20000;
parameters.size = 0.4;
parameters.radius = 150;
parameters.branches = 6;
parameters.spin = 0.5;
parameters.randomness = 0.2;
parameters.randomnessPower = 4;
parameters.insideColor = "#ff6030";
parameters.outsideColor = "#1b3984";

let galaxyGeometry = null;
let galaxyMaterial = null;
let galaxyPoints = null;

const generateGalaxy = () =>
  //FAT ARROW ---->>> type of function
  {
    /*
  Destroy prev galaxy
  */
    if (galaxyPoints !== null) {
      galaxyGeometry.dispose();
      galaxyMaterial.dispose();
      scene.remove(galaxyPoints);
    }

    galaxyGeometry = new THREE.BufferGeometry();

    const positions = new Float32Array(parameters.count * 3);
    //----------------------------------
    const colors = new Float32Array(parameters.count * 3);
    //----------------------------------
    // const sizes = new Float32Array(parameters.count * 3);
    // const initialSize = new THREE.Color(parameters.size);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;

      //position
      const radius = Math.random() * parameters.radius;
      const branchAngle =
        ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
      const spinAngle = radius * parameters.spin;
      //randomness
      const randomX =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomY =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomZ =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);

      positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = 0 + randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      //colors

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / parameters.radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
      
      
      //size
      
      // const mixedSize = initialSize.clone();
      // mixedSize.lerp(5,radius/parameters.radius);
      // sizes[i3   ] = mixedSize.x
      // sizes[i3 +1] = mixedSize.y
      // sizes[i3 +2] = mixedSize.z
      //console.log(sizes[i])
    }
    //attribute...............................................
    
    //Position
    galaxyGeometry.setAttribute("position",new THREE.BufferAttribute(positions, 3));
    
    //color
    galaxyGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    
    //size
    //galaxyGeometry.setAttribute("scale",new THREE.BufferAttribute(sizes,3));
    
    
    
    
    /*
  Material
  */
    galaxyMaterial = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      transparent : true,
      alphaMap : particleTexture,
      depthWrite : false,
      color:colors,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    /*
  Points
  */
    galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
    scene.add(galaxyPoints);
  };
//................................................................................................
generateGalaxy();

// //Add parameters to gui
// gui
//   .add(parameters, "count")
//   .min(100)
//   .max(1000000)
//   .step(100)
//   .onFinishChange(generateGalaxy);
// gui
//   .add(parameters, "size")
//   .min(0.001)
//   .max(1)
//   .step(0.001)
//   .onFinishChange(generateGalaxy);
// gui
//   .add(parameters, "radius")
//   .min(0.01)
//   .max(200)
//   .step(0.01)
//   .onFinishChange(generateGalaxy);
// gui
//   .add(parameters, "branches")
//   .min(2)
//   .max(20)
//   .step(1)
//   .onFinishChange(generateGalaxy);
// gui
//   .add(parameters, "spin")
//   .min(-5)
//   .max(5)
//   .step(0.001)
//   .onFinishChange(generateGalaxy);
// gui
//   .add(parameters, "randomness")
//   .min(0)
//   .max(2)
//   .step(0.001)
//   .onFinishChange(generateGalaxy);
// gui
//   .add(parameters, "randomnessPower")
//   .min(0)
//   .max(10)
//   .step(0.001)
//   .onFinishChange(generateGalaxy);
// gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
// gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);



/*
//------------------------------------------------Lights-----------------------------------------------------------
*/

const light1 = new THREE.AmbientLight("rgb(200,200,200)", 0.5);
const light3 = new THREE.PointLight(0xffffff, 0.5);
light3.position.set(20, 20, 20);
const light4 = new THREE.DirectionalLight(0xffffff, 1);
scene.add(light1, light3, light4);

/*
//----------------------------------------------ADD HELPER---------------------------------------------------------
*/

//PointLightHelper
const lightHelper = new THREE.PointLightHelper(light1);
//grid Helper
const grid = new THREE.GridHelper(200, 50);
//Axis Helper
const axes = new THREE.AxesHelper(100, 100, 100);
//scene.add(lightHelper, grid, axes);

const dir = new THREE.Vector3( 1, 2, 0 );

//normalize the direction vector (convert to vector of length 1)
dir.normalize();

const origin = new THREE.Vector3( 0, 0, 0 );
const length = 1;
const hex = 0xffff00;

const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
//scene.add( arrowHelper );



//.................................................................................................................
//orbitControls view
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping =true
//scene.add(orbitControls);

//.................................................................................................................

//????????????????????????????????????????????????????????????
//the problem is when screen resized texts and model proportion assignment collapsed
//..................................................................................................................
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

//rotate camera with mouse
//..............................................................................................................
const cursor ={
  x:0,
  y:0
}

window.addEventListener("mousemove",(event) =>{
  cursor.x = event.clientX/sizes.width - 0.5
  cursor.y = (event.clientY/sizes.height )-0.2
  
})





//.................................................................................................................
// Scroll Animation
//.................................................................................................................

function moveCamera() {
  const t = document.body.getBoundingClientRect().top + window.scrollY * 0.0001;

  //turos animation
  // turos.rotation.x += 0.02;
  // turos.rotation.y += 0.01;
  // turos.rotation.z += 0.03;

// Heightmap Animation.............................................................................................
  let hMap = Math.sin(t * -0.002);
  material1.displacementScale = t * -0.01 * hMap;
  // if(material1.displacementScale>10){
  //   material1.displacementScale = t * 0.003
  // }
  // jeff.rotation.y += 0.01;
  // jeff.rotation.z += 0.01;
 

//   camera.position.y = -10;
  camera.position.z =  t * - 0.02 + -25;
  //camera.position.x =  t * - 0.0001;
  camera.position.y = t *  -0.1 - 12;
 if(camera.position.y>=4.5){
  camera.position.y =  4.5;
  
  }
  
  //camera.rotation.y =  t * -1 ;

  //camera.rotation.y = t * 0.00000001;
}

document.body.onscroll = moveCamera;
moveCamera();

//const myCanvas = document.getElementById("myCanvas")
var mycanvas = document.getElementById("myCanvas");

// const renderer = new THREE.WebGLRenderer({ canvas: mycanvas });

// //define size of the renderer
// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight
// };


//...................................................................................................................
//fulscreen
//...................................................................................................................

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    mycanvas.requestFullscreen();
    //console.log("full");
  } else {
    document.exitFullscreen();
  }
});

renderer.setSize(sizes.width, sizes.height);
//set a min value for pixel ratio
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;









const clock = new THREE.Clock();
let previousTime = 0;
//.............................................................................................
//Everything inside this function can be a animation
function animate() {
  //...........................................................................................
  //loadingScreen
//   if(RESOURCES_LOADED == false){
//     requestAnimationFrame(animate);
//     window.addEventListener("resize", () => {
//   //update sizes 
//   sizes.width = window.innerWidth;
//   sizes.height = window.innerHeight;

//   //update camera
//   loadingScreen.camera1.aspect = sizes.width / sizes.height;
//   loadingScreen.camera1.updateProjectionMatrix();
//   // const renderer = new THREE.WebGLRenderer({
//   //   canvas: document.querySelector("#loading"),
//   //   antialias: true,
//   //   alpha: true,
//   //   physicallyCorrectLights: true,
//   // });
      
      
      
//   //update renderer
//   renderer.setSize(sizes.width, sizes.height);

//   //update pixel ratio
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });
//     renderer.render(loadingScreen.scene1,loadingScreen.camera1);
//     console.log("screenLoading")
//     return;
//   }
//.......................................................................................................
//raycaster from camera..................................................................................
        // raycaster.setFromCamera(mouse,camera)
        // const objectsToTest =[planeex] 
        // const intersects = raycaster.intersectObjects(objectsToTest,true);
    //console.log(myModel01)
  
//   for ( let i = 0; i < intersects.length; i ++ ) {

// 		intersects[ i ].object.material.color.set( 0xff0000 );

// 	}

    
    //const rayOrigin = new THREE.Vector3(-2.5,2,100);
   // const rayDirection = new THREE.Vector3(0,0,-1);
    //rayDirection.normalize();
    //raycaster.set(rayOrigin,rayDirection);
    //const objectsToTest =[myModel01] 
    //const intersect = raycaster.intersectObject(myModel01,true); 
  
  
  //console.log(intersects)
  
  //
        // for(const object of objectsToTest)
        // {
        // object.material.color.set('#ff0000')   
        // }
        // for(const intersect of intersects)
        //   {
        //     intersect.object.material.color.set('#0000ff')
        //   }

  
  // for(const object of intersect)
  //   {
  //     object.position.set(0,30,0) 
  //     console.log(object)
  //   }
    // for(const intersects of intersect)
    //   {
    //     intersects.object.material.color.set('#0000ff')
    //   }
  
  
  
  
    //console.log(intersect)
  
  // raycaster.setFromCamera(mouse,camera)
  // const objectsToTest = [myModel01];
  // const intersects =raycaster.intersectObjects(objectsToTest);
  // console.log(intersects)
  
  
  //frameRate
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime;
  previousTime =elapsedTime;
  
  
   //Update material
  material.uniforms.uTime.value = elapsedTime;
  
  
  //UpdateMixer
  
  if(mixer !== null){
    mixer.update(deltaTime/5)
  }
  
  
  
  
  
  
  
  //--------------------------------------CHANGE CAMERA POSITION WITH MOUSE POSITION-------------------------------------------
   if (!document.fullscreenElement) {
   //update camera
   camera.position.x =  cursor.x * 30;
   //camera.position.y =  cursor.y * 30 - 20;
   //camera.lookAt(cursor.x * 30,cursor.y * 10,0)
   //camera.position.x =Math.sin(cursor.x * Math.PI)
   // camera.position.z =Math.cos(cursor.x * Math.PI) 
   
  }
  
  
  requestAnimationFrame(animate);
  
//add point to scanned model
  // if (vertices.length < 1000000) {
  //   addPoint();
  // }
  
  videoTexture.needsUpdate = true;

  //particle.rotation.y += 0.001;
  //turos.rotation.x += 0.003;
  
  orbitControls.update();


 // movieCubeScreen.rotation.y += 0.01;
  //myModelBody.rotation.y += 0.01;

 const lookCentre =new THREE.Vector3(0,-13,-40)
//camera.rotation.x = PI/2;
 camera.lookAt(lookCentre);

  
  renderer.render(scene, camera);
  
}
animate();
 