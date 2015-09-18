/**
 * Created by Alexandr on 02.06.2015.
 */
"use strict";

if (!Detector.webgl) Detector.addGetWebGLMessage();

var intensity = 6;

var MARGIN = 0;
var SCREEN_HEIGHT = window.innerHeight - MARGIN * 2;
var SCREEN_WIDTH = window.innerWidth;

var container, camera, controls, scene, space, texture, helper,
    renderer, transport, dirLight, fps, sphere, zerg, group;

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

    camera = new THREE.PerspectiveCamera(25, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1e7);
    //camera.position.z = 10000;
    camera.position.y = 16;
    camera.lookAt(new THREE.Vector3(0,0,0));

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x03020F, 0.0005);

    //addControl();
    controls = new THREE.FlyControls(camera);
    controls.init();

    controls.movementSpeed = 2000;
    controls.domElement = container;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = false;

    dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(1, 1, 2).normalize();
    scene.add(dirLight);

    var light = new THREE.AmbientLight(0x808080); // soft white light
    scene.add(light);

    group = new THREE.Group();
    scene.add(group);

    var zergmaterial = new THREE.ShaderMaterial({
        uniforms: {
            texture: {type: 't', value: THREE.ImageUtils.loadTexture('zerg.png')}
        },
        skinning: true,
        needsUpdate: true,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent
    });


    var material1 = new THREE.MeshPhongMaterial({
        normalMap: THREE.ImageUtils.loadTexture('zerg.png'),
        skinning: true
    });


    var loader = new THREE.JSONLoader();
    loader.load("231.json", function (geometry) {

        geometry.computeVertexNormals();
        zerg = new THREE.SkinnedMesh(geometry,  material1);
        window.zerg = zerg;
        console.log(zerg);

        window.animation = new THREE.Animation(zerg, geometry.animations[0]);
        animation.play();
        animation.timeScale = 1;

        helper = new THREE.SkeletonHelper(zerg);
        helper.material.lineWidth = 3;
        scene.add(helper);
        helper.visible = true;

        zerg.scale.x = zerg.scale.y = zerg.scale.z = 0.5;
        scene.add(zerg);
        start();
    });

    var geometry = new THREE.SphereGeometry(25000, 32, 32);
    geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
    texture = THREE.ImageUtils.loadTexture("textures/space7.jpg");
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.repeat.x = 8;
    texture.repeat.y = 7;

    var material = new THREE.MeshBasicMaterial({
        map: texture,
        fog: false
    });

    sphere = new THREE.Mesh(geometry, material);
    sphere.rotation.y = -0.5;
    sphere.rotation.x = -0.5;

    scene.add(sphere);

    // stars

   /* var i, r = 600, starsGeometry = [new THREE.Geometry(), new THREE.Geometry()];

    for (i = 0; i < 250; i++) {

        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random();
        vertex.multiplyScalar(r);

        starsGeometry[0].vertices.push(vertex);

    }

    for (i = 0; i < 1500; i++) {

        vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random();
        vertex.multiplyScalar(r);

        starsGeometry[1].vertices.push(vertex);

    }

    var stars;
    var starsMaterials = [
        new THREE.Points({color: 0x555555, size: 2, sizeAttenuation: false, fog: false}),
        new THREE.Points({color: 0x555555, size: 1, sizeAttenuation: false, fog: false}),
        new THREE.Points({color: 0x333333, size: 2, sizeAttenuation: false, fog: false}),
        new THREE.Points({color: 0x3a3a3a, size: 1, sizeAttenuation: false, fog: false}),
        new THREE.Points({color: 0x1a1a1a, size: 2, sizeAttenuation: false, fog: false}),
        new THREE.Points({color: 0x1a1a1a, size: 1, sizeAttenuation: false, fog: false})
    ];

    for (i = 10; i < 300; i++) {

        stars = new THREE.Points(starsGeometry[i % 2], starsMaterials[i % 6]);

        stars.rotation.x = Math.random() * 6;
        stars.rotation.y = Math.random() * 6;
        stars.rotation.z = Math.random() * 6;

        var s = i / 2;
        stars.scale.set(s, s, s);

        stars.matrixAutoUpdate = false;
        stars.updateMatrix();

        scene.add(stars);

    }*/

    renderer = new THREE.WebGLRenderer({canvas: container, antialias: false, alpha: false});
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window["devicePixelRatio"]);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.sortObjects = false;
    start();

    window.addEventListener('resize', onWindowResize, false);

}

var obj = 0;
function start() {
    obj++;
    if (obj === 2) {
        render();
    }
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
var random = -1;
var raise = true;

function render() {

    var delta = clock.getDelta();


    helper.update();

    //var length = camera.position.length();

    THREE.AnimationHandler.update(delta);

   /* if (!contact && length <= 200) {
        contact = true;
        var center = new THREE.Vector3(0, 0, 0);
        camera.lookAt(center);
        render2();
        return;
    }*/

    controls.update(delta);

    if (zerg) {
        //zerg.updateAnimation(delta);
        //zerg.rotation.y += 0.01;
        //zerg.rotation.x += 0.02;
        //movingTo(length - camera.position.length());
    }

    var x = camera.position.x;
    var y = camera.position.y;
    var z = camera.position.z;
    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = z;

    controls.movementSpeed = Math.max(camera.position.length() * 0.1, 10);

    blinkingTime += delta;

    if (blinkingTime >= 0.5) {
        fps.innerText = Math.round(1 / delta);
        blinkingTime = 0;
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);

}

var render2 = function () {

    scene.rotation.y += 0.001;

    movingTo(length - camera.position.length());

    THREE.AnimationHandler.update(clock.getDelta());

    renderer.render(scene, camera);

    requestAnimationFrame(render2);

};

/*

 .translateOnAxis (axis, distance)

 Перемешеает объект по направлению вектора axis, на расстояние distance (вестор должен быть нормализован)

 .lookAt ( vector )

 Поворачивает объект в сторону точки
 var vector = new THREE.Vector3(x, y, z);
 object.lookAt(vector), где x, y, z координаты точки куда нужно повернуть

 .sub(v) вычитание векторов

 vector.sub(vector2) = vector - vector2

 .subVectors ( a, b ) вычитание векторов

 var vector = new THREE.Vector3();
 vector.subVectors(zerg.position, newVector)

 Sets this vector to a - b.

 */


var pointTo = new THREE.Vector3();

var x, y, z, distance, finish = false;

var minD = 100;
var maxD = 300;
var speed = 0.3;
var d = 100;

function movingTo() {

    var scale = 2 / (3 - Math.cos(clock.elapsedTime));

    if (!finish && zerg.position.z <= 0) {
        finish = true;
        z = 0;
    }

    if (finish) {
        z += Math.sin(clock.elapsedTime / 5) / 15;
    } else {
        if (d > maxD || d < minD) {
            speed *= -1;
        }
        d += speed;
        z = camera.position.length() - d;
        if (z >= zerg.position.z) {
            z = zerg.position.z;
        }
    }

    x = 50 * scale * Math.cos(clock.elapsedTime / 4) + 22;
    y = 50 * scale * Math.sin(clock.elapsedTime / 2) / 2;

    pointTo.set(x, y, z);
    zerg.lookAt(pointTo);
    zerg.position.copy(pointTo);
}
