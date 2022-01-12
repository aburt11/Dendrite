
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

import { XRHandModelFactory } from 'three/examples/jsm/webxr/XRHandModelFactory.js';

import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls';



const scene = new THREE.Scene();
//const loader = new GLTFLoader();

const fbxLoader = new FBXLoader();

var clock = new THREE.Clock();

var hand1;
var hand2;
var controller1:any;
var controller2:any;
var controllerGrip1
var controllerGrip2;
var camera:any;
var controls:any;

var player:any;

var speed = 1;





//init the renderer and enable VR/XR
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.xr.enabled = true;

document.body.appendChild(renderer.domElement);
document.body.appendChild( VRButton.createButton( renderer ) );


//setup the player group
player = new THREE.Group();
player.position.set(0, 1.6, 0)


// setup the camera
camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 1.6, 0); // Set position like this y was 1.6

///init vr controls




player.add( camera );
scene.add(player);

///dolly cam for controller input

//var dollyCam = new THREE.PerspectiveCamera();

//controls = new OrbitControls( dollyCam, renderer.domElement );
//controls.target.set( 0, 1.6, 0 );

///add dolly cam
//dollyCam.add(camera);
//scene.add(dollyCam);


//controls = new OrbitControls( camera, renderer.domElement );
//controls.target.set( 0, 1.6, 0 );

controls = new FirstPersonControls(camera,renderer.domElement);
//controls.target.set( 0, 1.6, 0 );
//controls.update();



////SCENE STUFF///////


////LIGHTING///////
scene.add( new THREE.HemisphereLight( 0x808080, 0x606060 ) );

const light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 6, 0 );
light.castShadow = true;
light.shadow.camera.top = 2;
light.shadow.camera.bottom = - 2;
light.shadow.camera.right = 2;
light.shadow.camera.left = - 2;
light.shadow.mapSize.set( 4096, 4096 );
scene.add( light );

////VR CONTROLLERS////////
// Get the 1st controller
controller1 = renderer.xr.getController(0); 
scene.add( controller1 );

// Get the 2nd controller
controller2 = renderer.xr.getController(1); 
scene.add( controller2 );

player.add( controller1 );
player.add( controller2 );




////EV LISTENER FOR GAMEPAD INPUT////////////////////////////////////
controller1.addEventListener( "connected", function( event:any ){


	//  Here it is, your VR controller instance.
	//  It’s really a THREE.Object3D so you can just add it to your scene:
console.log("in event listener");
console.log(event.data.gamepad);

console.log(event.data.gamepad.axes[3]);

//right controller thumstick Y
if(event.data.gamepad.axes[3] > -0){
    console.log("thumbstick up")
    controls.target.set( player.position.x += speed, player.position.y, player.position.z );

}

if(event.data.gamepad.axes[3] < -0){
    console.log("thumbstick down")
    controls.target.set( player.position.x -= speed, player.position.y, player.position.z );

}

})

controller2.addEventListener( "connected", function( event:any ){


	//  Here it is, your VR controller instance.
	//  It’s really a THREE.Object3D so you can just add it to your scene:
console.log("in event listener");
console.log(event.data.gamepad);

console.log(event.data.gamepad.axes[3]);

//right controller thumstick Y
if(event.data.gamepad.axes[3] > -0){
    console.log("thumbstick up")
    controls.target.set( player.position.x += speed, player.position.y, player.position.z );

}

if(event.data.gamepad.axes[3] < -0){
    console.log("thumbstick down")
    controls.target.set( player.position.x -= speed, player.position.y, player.position.z );

}

})


///CONTROLLER MODELS////////////////////////////////

const controllerModelFactory = new XRControllerModelFactory();
const handModelFactory = new XRHandModelFactory();

// Hand 1
controllerGrip1 = renderer.xr.getControllerGrip( 0 );
controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
scene.add( controllerGrip1 );

hand1 = renderer.xr.getHand( 0 );
hand1.add( handModelFactory.createHandModel( hand1 ) );

scene.add( hand1 );

// Hand 2
controllerGrip2 = renderer.xr.getControllerGrip( 1 );
controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
scene.add( controllerGrip2 );

hand2 = renderer.xr.getHand( 1 );
hand2.add( handModelFactory.createHandModel( hand2 ) );
scene.add( hand2 );


//////// DEBUG CONTROLLER LINES////////////////////////////////
const geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );

const line = new THREE.Line( geometry );
line.name = 'line';
line.scale.z = 5;

controller1.add( line.clone() );
controller2.add( line.clone() );





/////FBX MAP LOADING////////////////////////////////

fbxLoader.load(
    '../assets/scenes/de_dust2.fbx',
    (object) => {
        // object.traverse(function (child) {
        //     if ((child as THREE.Mesh).isMesh) {
        //         // (child as THREE.Mesh).material = material
        //         if ((child as THREE.Mesh).material) {
        //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
        //         }
        //     }
        // })
         object.scale.set(.01, .01, .01)

        console.log('FBX MAP',object);

        scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)


//////RENDERING STUFF////////////////////////////////
renderer.setAnimationLoop( function () {

	renderer.render( scene, camera );

} );



////WINDOW RESIZE LISTENER////////////////////////////////
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}


/////MORE RENDERING STUFF/////
////////////////////////////////
function animate() {
  //  requestAnimationFrame(animate)

renderer.setAnimationLoop(render);

    controls.update()

    render()
}




function render() {

	//  Here’s VRController’s UPDATE goods right here:
	//  This one command in your animation loop is going to handle
	//  all the VR controller business you need to get done!

    let delta = clock.getDelta();

  //  console.log("VR SUPPORTED CONTROLS", VRControls.supported);


    controls.update(delta);



    camera.updateProjectionMatrix()
   renderer.render(scene, camera)
}

console.log("scene", scene);
console.log("camera", camera);
console.log("render",renderer);

animate();
