/**!
 * File light-synthesis.js
 */

var canvasWrapper = document.getElementById('canvas-3d-wrapper');
var canvasWidth = canvasWrapper.clientWidth;
var canvasHeight = canvasWrapper.clientHeight;

var loader = new THREE.FileLoader();
loader.load( 'data/app.json', function ( text ) {

		var player = new APP.Player();
		player.load( JSON.parse( text ) );
		player.setSize( canvasWidth, canvasHeight );
		player.play();

		canvasWrapper.appendChild( player.dom );
		window.addEventListener( 'resize', function () {
				player.setSize( window.innerWidth, window.innerHeight );
		} );
} );
