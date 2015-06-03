/**
 * Created by Alexandr on 02.06.2015.
 */
"use strict";
(function() {



    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    var radius = 6371;
    var rotationSpeed = 0.02;

    var MARGIN = 0;
    var SCREEN_HEIGHT = window.innerHeight - MARGIN * 2;
    var SCREEN_WIDTH  = window.innerWidth;

    var container, camera, controls, scene,
        renderer, cube, transport, dirLight;

    var d, dPlanet = new THREE.Vector3();

    var clock = new THREE.Clock();

    document.addEventListener("DOMContentLoaded", function() {
        container = document.getElementById("space");
        init();
        animate();
    });

    function init() {

        camera = new THREE.PerspectiveCamera( 25, SCREEN_WIDTH / SCREEN_HEIGHT, 50, 1e7 );
        camera.position.z = 100;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );

        controls = new THREE.FlyControls( camera );

        controls.movementSpeed = 10;
        controls.domElement = container;
        controls.rollSpeed = Math.PI / 24;
        controls.autoForward = false;
        controls.dragToLook = false;

        dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( 0, 1, 1 ).normalize();
        scene.add( dirLight );

        var light = new THREE.AmbientLight( 0x404040 ); // soft white light
        scene.add( light );



        var collada = new THREE.ColladaLoader();
        collada.options.convertUpAxis = true;

        collada.load("203 big transport.dae", function( collada ) {
            console.log(collada);
            transport = collada.scene;
            scene.add( transport );
        });

        // instantiate a loader
        /*var loader = new THREE.JSONLoader();

        // load a resource
        loader.load(
            // resource URL
            '203 big transport.json',
            // Function when resource is loaded
            function ( geometry, material ) {
                console.log(material);
                material = new THREE.MeshNormalMaterial( { overdraw: true } );
                transport = new THREE.Mesh( geometry, material );
                scene.add( transport );
            }
        );*/


        /*var geometry = new THREE.BoxGeometry( radius, radius, radius );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
        cube = new THREE.Mesh( geometry, material );
        scene.add( cube );*/

        // stars

        var i, r = radius, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];

        for ( i = 0; i < 250; i ++ ) {

            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 2 - 1;
            vertex.y = Math.random() * 2 - 1;
            vertex.z = Math.random() * 2 - 1;
            vertex.multiplyScalar( r );

            starsGeometry[ 0 ].vertices.push( vertex );

        }

        for ( i = 0; i < 1500; i ++ ) {

            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 2 - 1;
            vertex.y = Math.random() * 2 - 1;
            vertex.z = Math.random() * 2 - 1;
            vertex.multiplyScalar( r );

            starsGeometry[ 1 ].vertices.push( vertex );

        }

        var stars;
        var starsMaterials = [
            new THREE.PointCloudMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
            new THREE.PointCloudMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
            new THREE.PointCloudMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
            new THREE.PointCloudMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
            new THREE.PointCloudMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
            new THREE.PointCloudMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
        ];

        for ( i = 10; i < 30; i ++ ) {

            stars = new THREE.PointCloud( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );

            stars.rotation.x = Math.random() * 6;
            stars.rotation.y = Math.random() * 6;
            stars.rotation.z = Math.random() * 6;

            var s = i * 10;
            stars.scale.set( s, s, s );

            stars.matrixAutoUpdate = false;
            stars.updateMatrix();

            scene.add( stars );

        }

        renderer = new THREE.WebGLRenderer({canvas: container});
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        renderer.sortObjects = false;

        window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize( event ) {

        SCREEN_HEIGHT = window.innerHeight;
        SCREEN_WIDTH  = window.innerWidth;

        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();

    }

    function animate() {

        requestAnimationFrame( animate );

        render();

    }

    function render() {

        // rotate the planet and clouds

        var delta = clock.getDelta();

        //transport.rotation.y += rotationSpeed * delta;
        transport.rotation.y += rotationSpeed * 10 * delta;

        // slow down as we approach the surface

        /*dPlanet = camera.position.length();

        d = ( dPlanet - radius * 1.01 );

        controls.movementSpeed = 0.33 * d;*/
        controls.update( delta );

        renderer.render( scene, camera );

    }


})();