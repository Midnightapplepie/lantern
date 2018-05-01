var scene = new THREE.Scene();
// scene.background = new THREE.Color( 0xf0f0f0 );
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.addEventListener('resize', () => {
    var w = window.innerWidth;
    var h = window.innerHeight;

    renderer.setSize(w , h);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
})

var controls = new THREE.OrbitControls(camera, renderer.domElement);

// scene.add( new THREE.AmbientLight( 0xffffff, 0.3 ) );
// var light = new THREE.DirectionalLight( 0xffffff, 0.35 );
// light.position.set( 100, 1000, 1 ).normalize();
// scene.add( light );

var centerLightStr = 1.5;
var centerLightDist = 1.5;
var sideLightStr = 6;
var sideLightDist = 2;
var sideLightDecay = 1.5;

centerLight = new THREE.PointLight(0xFFE808, centerLightStr, centerLightDist);
centerLight.position.y = -1;
scene.add( centerLight );
var lightHelper = new THREE.PointLightHelper(centerLight, 0.1);
scene.add(lightHelper);

frontlight = new THREE.PointLight(0xFFE808, sideLightStr, sideLightDist, sideLightDecay);
frontlight.position.y =  -1.7;
frontlight.position.z =  1.5;
scene.add( frontlight );
var lightHelper2 = new THREE.PointLightHelper(frontlight, 0.1);
scene.add(lightHelper2);

leftlight = new THREE.PointLight(0xFFE808, sideLightStr, sideLightDist, sideLightDecay);
leftlight.position.y =  -1.7;
leftlight.position.x =  1.5;
scene.add( leftlight );
var lightHelper3 = new THREE.PointLightHelper(leftlight, 0.1);
scene.add(lightHelper3);

rightlight = new THREE.PointLight(0xFFE808, sideLightStr, sideLightDist, sideLightDecay);
rightlight.position.y =  -1.7;
rightlight.position.x =  -1.5;
scene.add( rightlight );
var lightHelper4 = new THREE.PointLightHelper(rightlight, 0.1);
scene.add(lightHelper4);

backlight = new THREE.PointLight(0xFFE808, sideLightStr, sideLightDist, sideLightDecay);
backlight.position.y =  -1.7;
backlight.position.z =  -1.5;
scene.add( backlight );
var lightHelper5 = new THREE.PointLightHelper(backlight, 0.1);
scene.add(lightHelper5);


var ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.7);
scene.add(ambientLight);

ambientLight.position.z = 100;
ambientLight.position.y = 100;

var assignUvs = (geometry) => {
    var uvsBody = [];
    uvsBody.push( new THREE.Vector2(0.0,0))
    uvsBody.push( new THREE.Vector2(1.0,0.0))
    uvsBody.push( new THREE.Vector2(1,1))
    uvsBody.push( new THREE.Vector2(0.0, 1))

    let times = geometry.faces.length/2;
    while(times > 0) {
        geometry.faceVertexUvs[0].push([uvsBody[0],uvsBody[1],uvsBody[2]]);
        geometry.faceVertexUvs[0].push([uvsBody[0],uvsBody[2],uvsBody[3]]);
        times--;
    }
}

var lantern = ()=>{
    let geometry = new THREE.Geometry();
    geometry.vertices.push(
       new THREE.Vector3( 0,1.5, 0),
	   new THREE.Vector3( -1,  1, 1 ),
	   new THREE.Vector3( -0.7, -1, 0.7),
	   new THREE.Vector3(  0.7, -1, 0.7),
       new THREE.Vector3( 1,1, 1),
       //
       new THREE.Vector3(  0.7, -1, -0.7),
       new THREE.Vector3( 1,1, -1),
       //
       new THREE.Vector3(  -0.7, -1, -0.7),
       new THREE.Vector3( -1,1, -1),
       //
    );
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    console.log(geometry);

    geometry.faces.push(new THREE.Face3(1,2,3));
    geometry.faces.push(new THREE.Face3(1,3,4));
    //
    geometry.faces.push(new THREE.Face3(4,3,5));
    geometry.faces.push(new THREE.Face3(4,5,6));
    //
    geometry.faces.push(new THREE.Face3(6,5,7));
    geometry.faces.push(new THREE.Face3(6,7,8));
    //
    geometry.faces.push(new THREE.Face3(8,7,2));
    geometry.faces.push(new THREE.Face3(8,2,1));
    //
    geometry.faces.push(new THREE.Face3(0,1,4));
    geometry.faces.push(new THREE.Face3(0,4,6));
    geometry.faces.push(new THREE.Face3(0,6,8));
    geometry.faces.push(new THREE.Face3(0,8,1));

    // geometry = new THREE.IcosahedronGeometry(1, 0);
    assignUvs(geometry);
    geometry.computeBoundingSphere();

    //required for lighting
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    //create material with texture image:
    // load a texture, set wrap mode to repeat
    var texture = new THREE.TextureLoader().load( "./paper.png" );
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set( 4, 4 );

    var faceMaterials = new Array(12).fill(new THREE.MeshLambertMaterial(
        {
            map: texture,
            side: THREE.DoubleSide,
            transparent:true,
            opacity:1
        }));

    // var material = new THREE.MeshFaceMaterial(faceMaterials);

    var cube = new THREE.Mesh( geometry, faceMaterials);
    var wireFrameHelper = new THREE.WireframeHelper(cube, 0x000000);
    // scene.add(wireFrameHelper);

    // wireFrameHelper.rotate.y += 0.5;
    // cube.rotation.y += 0.5;

    return cube;
}

var cube = lantern()
scene.add( cube );

camera.position.z = 5;

var zMove= -0.01;
var yMove = 0.01;
var xMove = 0.01;

var animateLights = (higher) => {

    let sideLights = [leftlight, rightlight, frontlight, backlight];
    if(higher) {
        centerLight.intensity = 1.5;
        centerLight.distance = 1.5;
        sideLights.forEach((l) => {
            l.intensity = 6;
            l.distance = 2;
            l.decay = 1.5
        })
    } else {
        sideLights.forEach((l) => {
            centerLight.intensity = 1.2;
            centerLight.distance = 1.5;
            l.intensity = 5;
            l.distance = 2;
            l.decay = 2;
        })
    }
}

function animate() {
    // if(false){
    //     centerLight.intensity = 1.5;
    //     centerLight.distance = 1.5;
    //     sideLightStr = 6;
    //     sideLightDist = 2;
    //     sideLightDecay = 1.5;
    //     lower =true;
    // }else {
    //     centerLightStr = 1.2;
    //     centerLightDist = 1.5;
    //     sideLightStr = 5;
    //     sideLightDist = 2;
    //     sideLightDecay = 2;
    //     lower=false;
    // };
	requestAnimationFrame( animate );
    let obj = [cube, centerLight, frontlight, backlight, leftlight, rightlight];
    obj.forEach((o) => {
        o.position.x += xMove;
        o.position.y += yMove;
        o.position.z += zMove;
    })
    animateLights(Math.random() > 0.2, );
	renderer.render( scene, camera );
}
animate();
