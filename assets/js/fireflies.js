const ANIMATION_ROTATION = 0.025;
const GROW_TO = 50;
const GROW_FROM = 0.1;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.lookAt(0,0,0);
camera.position.set( 0, 0, 100 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var growing = true;
const colours = [
	0xFF0000,
    0x00FF00,
    0x0000FF,
	0xFFFF00,
	0xFF00FF,
	0x00FF00,
	0x00FFFF
];
const fireflyMaterials = [];
colours.forEach(function(colour)
{
	fireflyMaterials.push(
		new THREE.PointsMaterial({color: colour, 
			size:3, 
			map: new THREE.ImageUtils.loadTexture( 'assets/images/glow.png' ),
			blending: THREE.AdditiveBlending   
		  })
	);
});

const points = [];

for(x = -1; x < 2; x ++)
	for(y = -1; y < 2; y ++)
		for(z = -1; z < 2; z ++)
			for (scale = 1; scale  <= 10; scale+=2)
				points.push(new THREE.Vector3(x*scale,y*scale,z*scale));

const fireflyGeometry = new THREE.BufferGeometry().setFromPoints(points);
const fireflyObjects = [];
var currentRotation = 0;
fireflyMaterials.forEach(function(fireflyMaterial)
{
	const pointsObject = new THREE.Points(fireflyGeometry, fireflyMaterial);
	pointsObject.rotateX(currentRotation);
	currentRotation+=360/colours.length;
	fireflyObjects.push(pointsObject);
	scene.add(pointsObject);
});

renderer.render(scene,camera);
renderer.setAnimationLoop(() => {
	fireflyObjects.forEach(function(fireflies){
		if (growing)
		{
			fireflies.scale.add(new THREE.Vector3(0.1,0.1,0.1));
			fireflies.rotateZ(ANIMATION_ROTATION);
			fireflies.rotateX(ANIMATION_ROTATION);
			if(fireflies.scale.x >= GROW_TO)
				growing = false;
		}
		else
		{
			fireflies.scale.add(new THREE.Vector3(-0.1,-0.1,-0.1));
			fireflies.rotateZ(0-ANIMATION_ROTATION);
			fireflies.rotateY(0-ANIMATION_ROTATION);
			if(fireflies.scale.x <= GROW_FROM)
				growing = true;
		}
	});
	renderer.setSize( window.innerWidth, window.innerHeight );
	const aspect = window.innerWidth/window.innerHeight;
	if (aspect != camera.aspect)
	{
		camera.aspect = aspect;
		camera.updateProjectionMatrix();
	}
	renderer.render(scene, camera);
});