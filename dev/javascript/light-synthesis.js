/**!
 * File light-synthesis.js
 */

var canvasWrapper = document.getElementById('canvas-3d-wrapper');
var canvasWidth = canvasWrapper.clientWidth;
var canvasHeight = canvasWrapper.clientHeight;
/*
var loader = new THREE.FileLoader();
loader.load( 'data/json/app.json', function ( text ) {

		var player = new APP.Player();
		player.load( JSON.parse( text ) );
		player.setSize( canvasWidth, canvasHeight );
		player.play();

		canvasWrapper.appendChild( player.dom );


} );
*/
var camera, scene, renderer;
var lights = [];
var lightsPositions = [
	[ 3, 3.4, -23], [ -7, 3.4, -23],
	[ 3, 3.4, -16.6], [ -7, 3.4, -16.6],
	[ 3, 3.4, -9.7], [ -7, 3.4, -9,7],
	[ 3, 3.4, -3.2], [ -7, 3.4, -3.2],
	[ 3, 3.4, 3.2], [ -7, 3.4, 3.2],
	[ 3, 3.4, 9.7],	[ -7, 3.4, 9,7]];
init();
animate();

function init() {

		camera = new THREE.PerspectiveCamera( 45, canvasWidth / canvasHeight, 1, 2000 );
		camera.position.set( 1.48, 1, 12 );

		// scene
		scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0xffffff, 0.5, 40);

		for( var i = 0; i < lightsPositions.length; i++) {

			lights[i] = new THREE.PointLight( 0xffffff, Math.random(0, .5), 0 );
			lights[i].position.set( lightsPositions[i][0], lightsPositions[i][1], lightsPositions[i][2]);
			scene.add( lights[i] );
		}

		// BEGIN Clara.io JSON loader code
		var objectLoader = new THREE.ObjectLoader();

		objectLoader.load("data/json/room-model.json", function ( object ) {
				//object.scale.set(5, 5, 5);
				object.receiveShadow = true;
				object.castShadow = true;
				scene.add( object );
		} );
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( canvasWidth, canvasHeight );
		canvasWrapper.appendChild( renderer.domElement );

		window.addEventListener( 'resize', function () {
				renderer.setSize( canvasWidth, canvasHeight );
		} );
}

function animate() {
		for(var i = 0; i < lights.length; i++ ){
			lights[i].power = Math.random(0, 1);
		}
		requestAnimationFrame( animate );
		render();
}
function render() {
		//camera.lookAt( scene.position );
		renderer.render( scene, camera );
}
