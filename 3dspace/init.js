/**
 * Created by Alexandr on 02.06.2015.
 */
"use strict";
(function () {

    if (!Detector.webgl) Detector.addGetWebGLMessage();

    var intensity = 6;

    var MARGIN = 0;
    var SCREEN_HEIGHT = window.innerHeight - MARGIN * 2;
    var SCREEN_WIDTH = window.innerWidth;

    var container, camera, controls, scene, space, texture,
        renderer, transport, dirLight, fps, sphere;

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

    var asteroidsObjs = [];

    var clock = new THREE.Clock();

    document.addEventListener("DOMContentLoaded", function () {
        container = document.getElementById("space");
        fps = document.getElementById("counter");
        init();
    });

    var dna = {
        lang: {
            help: [
                "ок, понятно",
                "Ручка управления тягой корабля<br>(удерживайте для движения).",
                "Для изменения курса корабля<br>сдвиньте ручку от середины<br>к краям.",
                "Скрыть/показать эту подсказку."
            ]
        }
    };

    function addControl() {

        var $control = $("<div id='fly_control'></div>");

        $control.css({
            position: "fixed",
            bottom: "50px",
            right: "50px",
            width: "150px",
            height: "150px",
            "border": "1px solid white",
            "border-radius": "100%",
            "-webkit-touch-callout": "none",
            "-webkit-user-select": "none",
            "-moz-user-select": "none",
            "-ms-user-select": "none",
            "user-select": "none"
        });

        $("<div class='round'></div>").css({
            width: "87px",
            height: "87px",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: "auto",
            "border-radius": "100%",
            "background-image": "url(images/galaxy/knob.png)",
            cursor: "pointer",
            "z-index": 1
        }).appendTo($control);

        var $help = $("<div class=\"help\" style=\'font-size: 16px;position: relative;\'>\n    <div style=\'position: absolute;top: -35px;left: 17px;background-color: transparent;color: white;border-radius: 3px;border: 1px solid white;cursor: pointer;text-align: center;font-size: 16px;width: 115px;height: 24px;line-height: 24px;\'>??, ???????</div>\n    <div style=\"position: absolute;width: 250px;top: -35px;left: -245px;\">\n        ????? ?????????? ????? ???????<br>(??????????? ??? ????????).\n    </div>\n    <div style=\"position: absolute;left: -245px;width: 250px;top: 45px;\">\n        ??? ????????? ????? ???????<br>???????? ????? ?? ????????<br>? ?????.\n    </div>\n    <div style=\"position: absolute;width: 250px;left: -245px;top: 125px;\">\n        ??????\\???????? ??? ?????????\n    </div>\n    <div style=\'position: absolute;width: 150px;height: 180px;background: url(images/galaxy/help-lines.png) no-repeat;top: -6px;left: -30px;\'></div>\n    <div class=\"js-dna-help\" style=\"cursor:pointer;border: 1px solid;font-size: 18px;border-radius: 100%;text-align: center;line-height: 24px;width: 24px;height: 24px;top: 150px;left: 125px;position: absolute;\">?</div>\n</div>");

        for (var i = 0; i < 4; i++) {
            $help.find("div").eq(i).html(dna["lang"]["help"][i]);
        }

        $control.append($help);

        $("body").append($control);

        $help.find("div").eq(0).click(function () {
            $help.find("div").hide().end().find(".js-dna-help").show();
        });

        $help.find(".js-dna-help").click(function () {
            $help.find("div").toggle().end().find(".js-dna-help").show();
        });
    }


    function init() {

        camera = new THREE.PerspectiveCamera(25, SCREEN_WIDTH / SCREEN_HEIGHT, 50, 1e7);
        camera.position.z = 500;
        camera.position.y = 0;
        window.cam = camera;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x04041F, 0.000011);

        addControl();
        controls = new THREE.FlyControls(camera);
        controls.init();

        controls.movementSpeed = 10000;
        controls.domElement = container;
        controls.rollSpeed = Math.PI / 24;
        controls.autoForward = false;
        controls.dragToLook = false;

        dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(1, 1, 1).normalize();
        scene.add(dirLight);

        var light = new THREE.AmbientLight(0x808080); // soft white light
        scene.add(light);

        var collada = new THREE.ColladaLoader();
        collada.options.convertUpAxis = true;

        collada.load("ark.dae", function (collada) {
            console.log(collada);
            transport = collada.scene;
            ///transport.scale.set(10, 10, 10);
            transport.scale.x = transport.scale.y = transport.scale.z = 10;
            transport.rotation.y = Math.PI / 1.5;

            transport.traverse(function (child) {

                console.log(child);

                if (child instanceof THREE.SkinnedMesh) {

                    var animation = new THREE.Animation(child, child.geometry.animation);
                    animation.play();

                }

            });
            transport.updateMatrix();
            scene.add(transport);

        });

        var geometry = new THREE.SphereGeometry(25000, 32, 32);
        geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
        texture = THREE.ImageUtils.loadTexture("textures/space7.jpg");
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.repeat.x = 8;
        texture.repeat.y = 7;


        var material = new THREE.MeshBasicMaterial({
            map: texture
        });

        sphere = new THREE.Mesh(geometry, material);
        sphere.rotation.y = -0.5;
        sphere.rotation.x = -0.5;
        sphere.position.z = 2000;
        sphere.position.y = 0;

        scene.add(sphere);

        renderer = new THREE.WebGLRenderer({canvas: container, antialias: false, alpha: false});
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window["devicePixelRatio"]);
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        renderer.sortObjects = false;

        render();

        window.addEventListener('resize', onWindowResize, false);

    }

    function onWindowResize() {

        SCREEN_HEIGHT = window.innerHeight;
        SCREEN_WIDTH = window.innerWidth;

        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();

    }

    var blinkingTime = 0;
    var contact = false;

    function render() {

        var delta = clock.getDelta();

        THREE.AnimationHandler.update(delta);

        if (!contact && camera.position.length() <= 300) {
            contact = true;
            render2();
            return;
        }

        requestAnimationFrame(render);

        controls.update(delta);

        var x = camera.position.x;
        var y = camera.position.y;
        sphere.position.x = x;
        sphere.position.y = y;

        controls.movementSpeed = Math.max(camera.position.length() * 0.1, 10);

        blinkingTime += delta;

        if (blinkingTime >= 0.5) {
            fps.innerText = Math.round(1 / delta);
            blinkingTime = 0;
        }

        renderer.render(scene, camera);

    }

    var render2 = function () {

        sphere.rotation.y += 0.001;
        transport.rotation.y += 0.001;

        renderer.render(scene, camera);

        requestAnimationFrame(render2);

    };


})();