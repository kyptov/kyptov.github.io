/**
 * Created by Alexandr on 02.06.2015.
 */
"use strict";
(function() {

    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    var radius = 6371;
    var rotationSpeed = 0.02;
    var intensity = 6;

    var MARGIN = 0;
    var SCREEN_HEIGHT = window.innerHeight - MARGIN * 2;
    var SCREEN_WIDTH  = window.innerWidth;

    var container, camera, controls, scene, space,
        rescueLight1, rescueLight2, rescueLight3,
        renderer, stars, transport, dirLight, fps;

    var asteroidsList = [
        "meshes/asteroid.0",
        "meshes/asteroid.1",
        "meshes/asteroid.2",
        "meshes/asteroid.3",
        "meshes/asteroid.4",
        "meshes/asteroid.5",
        "meshes/asteroid.6",
        "meshes/asteroid.7",
        "meshes/asteroid.8",
        "meshes/asteroid.9"
    ];

    var stone = THREE.ImageUtils.loadTexture( "textures/stone.jpg" );

    var asteroidsObjs = [];

    var d, dPlanet = new THREE.Vector3();

    var clock = new THREE.Clock();

    document.addEventListener("DOMContentLoaded", function() {
        container = document.getElementById("space");
        fps = document.getElementById("counter");
        init();
        animate();
    });

    function loadModel(name) {
        var loader = new THREE.OBJLoader();
        loader.load(name, function(object) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshPhongMaterial({color: 0xcccccc});
                    child.geometry.computeFaceNormals();
                    child.geometry.computeVertexNormals();
                    child.geometry.computeBoundingBox();
                }
            });

            object.position.z = (Math.random() - 2) * 100 + 100;
            object.position.x = (Math.random() - 2) * 100 + 100;

            asteroidsObjs.push(object);

            scene.add( object );

            if (asteroidsObjs.length === 8) {
                addAsters();
            }
        });
    }

    function addAsters() {
        var z = {
            max: 100,
            min: -100
        };
        var x = {
            max: 100,
            min: -100
        };
        for (var i = 0; i < 100; i++) {
            var aster = asteroidsObjs[i % 8].clone();
            asteroidsObjs.push(aster);
            aster.position.z = Math.random() * (z.max - z.min) + z.min;
            aster.position.x = Math.random() * (x.max - x.min) + x.min;
            aster.position.y = -20;
            aster.speed = (2 * Math.random() - 1) * 0.01;
            scene.add(aster);
        }
    }

    function init() {

        camera = new THREE.PerspectiveCamera( 25, SCREEN_WIDTH / SCREEN_HEIGHT, 50, 1e7 );
        camera.position.z = 20000;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2( 0x000000, 0.0000025 );
        scene.fog.color.setHSL( 0.51, 0.4, 0.01 );

        controls = new THREE.FlyControls( camera );

        controls.movementSpeed = 1000;
        controls.domElement = container;
        controls.rollSpeed = Math.PI / 24;
        controls.autoForward = false;
        controls.dragToLook = false;

        dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        dirLight.position.set( 1, 1, 1 ).normalize();
        scene.add( dirLight );

        var light = new THREE.AmbientLight( 0x808080 ); // soft white light
        scene.add( light );

        rescueLight1 = new THREE.PointLight( 0x6EECED, intensity, 5 );
        rescueLight1.position.set( 1.36, 0.63, -0.1 );
        rescueLight1.scale.set( 0.1, 0.1, 0.1 );

        rescueLight2 = rescueLight1.clone();
        rescueLight2.position.x = -1.36;

        rescueLight3 = new THREE.PointLight( 0x6EECED, 1, 40 );
        rescueLight3.position.set( 0, -0.8, -2.8 );

        var collada = new THREE.ColladaLoader();
        collada.options.convertUpAxis = true;

        collada.load("ark.dae", function( collada ) {
            console.log(collada);
            transport = collada.scene;
            transport.scale.set( 10, 10, 10 );
            transport.add( rescueLight1 );
            transport.add( rescueLight2 );
            transport.add( rescueLight3 );
            scene.add( transport );
        });

        var geometry = new THREE.SphereGeometry( 500, 100, 100 );
        geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );

        var material = new THREE.MeshBasicMaterial( {
            map: THREE.ImageUtils.loadTexture( 'textures/space.jpg' )
        } );

        space = new THREE.Mesh( geometry, material );

        scene.add( space );


        //asteroids

        for (i = 0; i < asteroidsList.length; i++) {
            loadModel(asteroidsList[i]);
        }


        // stars

        var i, r = 1000, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];

        for ( i = 0; i < 250; i ++ ) {

            vertex = new THREE.Vector3();
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

        var star;
        stars = new THREE.Object3D();
        scene.add( stars );
        var starsMaterials = [
            new THREE.PointCloudMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
            new THREE.PointCloudMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
            new THREE.PointCloudMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
            new THREE.PointCloudMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
            new THREE.PointCloudMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
            new THREE.PointCloudMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
        ];

        for ( i = 5; i < 300; i ++ ) {

            star = new THREE.PointCloud( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );

            star.rotation.x = Math.random() * 6;
            star.rotation.y = Math.random() * 6;
            star.rotation.z = Math.random() * 6;

            //var s = i;
            star.scale.set( i, i, i );

            star.matrixAutoUpdate = false;
            star.updateMatrix();

            stars.add( star );

        }

        renderer = new THREE.WebGLRenderer({canvas: container});
        renderer.setPixelRatio( window["devicePixelRatio"] );
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        renderer.sortObjects = false;

        window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize() {

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


    var blinkingTime = 0;
    var raise = true;
    var contact = false;

    function render() {

        // rotate the planet and clouds

        var delta = clock.getDelta();

        stars.rotation.y += 0.0001;

        if (!contact && camera.position.length() <= 200) {
            alert("contact");
        }

        controls.movementSpeed = (Math.max(camera.position.length(), 150) - 150) * 0.1;

        controls.update( delta );

        renderer.render( scene, camera );

        blinkingTime += delta;

        if (rescueLight1.intensity >= 20) {
            raise = false;
        } else if (rescueLight1.intensity <= 0) {
            raise = true;
        }

        if (raise) {
            rescueLight1.intensity += 0.2;
            rescueLight2.intensity += 0.2;
            //rescueLight3.intensity += delta * 0.4;
        } else {
            rescueLight1.intensity -= 0.2;
            rescueLight2.intensity -= 0.2;
            //rescueLight3.intensity -= delta * 0.4;
        }

        if (blinkingTime >= 0.5) {
            fps.innerText = Math.round(1 / delta);
            blinkingTime = 0;
        }

        for (var i = 0, length = asteroidsObjs.length; i < length; i++) {
            asteroidsObjs[i].rotation.x += asteroidsObjs[i].speed;
            asteroidsObjs[i].rotation.y += asteroidsObjs[i].speed;
            asteroidsObjs[i].rotation.z += asteroidsObjs[i].speed;
        }

        if (typeof transport === "undefined") {
            return;
        }

        transport.rotation.y += 0.001;


        // slow down as we approach the surface

        /*dPlanet = camera.position.length();

        d = ( dPlanet - radius * 1.01 );

        controls.movementSpeed = 0.33 * d;*/


    }


})();