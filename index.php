<!DOCTYPE html>
<html>
<head>
    <script src="assets/js/three.js"></script>
    <script src="assets/js/threex.planets.js"></script>
    <style>
        body {
            background-image: url('images/stars.jpg');
        }
        #orbits {
            width: 100%;
            height: 100%;
            position: absolute;
            background: url('images/orbits_4.png') no-repeat;
            z-index: 1;
        }
        canvas {
            z-index: 2;
            position: absolute;
        }
    </style>
</head>
<body style="margin: 0; overflow: hidden;">
<div id="orbits"></div>
<script>

    //Расчет орбиты относительно ширины и высоты экрана
    var orbits = document.getElementById('orbits');

    //Размер орбиты в полтора раза больше
    var orbitsWidth = window.innerWidth * 1.5;
    var orbitsHeight = window.innerHeight * 1.5;
    var bgSize = 'background-size: ' + orbitsWidth + 'px ' + orbitsHeight + 'px; ';

    //Положение по солнцу
    var orbitsLeft = orbitsWidth / 2;
    var orbitsTop = orbitsHeight / 2 - window.innerHeight / 2;
    var bgPosition = 'background-position: -' + orbitsLeft + 'px -' + orbitsTop + 'px; ';
    orbits.setAttribute('style', bgSize + bgPosition);

    //Анимация
    var onRenderFcts= [];

    //Сцена
    var scene = new THREE.Scene();

    //Камера орографическая (вид сверху)
    var camera = new THREE.OrthographicCamera(
        window.innerWidth / - 250,
        window.innerWidth / 250,
        window.innerHeight / 250,
        window.innerHeight / - 250,
        -1,
        1000
    );

    //Рендер
    var renderer = new THREE.WebGLRenderer({
        antialias	: true,
        alpha       : true
    });

    //Размеры (всё окно)
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    //renderer.setClearColor(0x000000, 0);
    renderer.showMapEnabled = true;

    //Солнце
    var sun = THREEx.Planets.createSun();

    //Положения солнца (от него расчитываем источники света)
    var sunX = -4.5,
        sunY = 0,
        sunZ = 0;
    sun.position.set(sunX, sunY, sunZ);
    onRenderFcts.push(function(delta, now){
        sun.rotation.y += 1/8 * delta;
        sun.rotation.x += 1/8 * delta;
    });
    scene.add(sun);

    //Свет солнца на планеты (источник внутри солнца)
    var sunLight = new THREE.PointLight(0xffffff, 1.5, 10);
    sunLight.position.set(sunX, sunY, sunZ);
    scene.add(sunLight);

    //Освещаем солнце с четырех сторон

    //Смещение четырех источников по углам
    var offset = 0.5;

    //Дистанция света (маленькая, чтобы не светить на планеты)
    var distance = 1;

    //Величина света
    var intensive = 4;
    var color = 0xffffff;

    //Первая лампа
    var sunSurfaceLight1 = new THREE.PointLight(color, intensive, distance);
    sunSurfaceLight1.position.set(sunX-offset, sunY-offset, 0.7);
    scene.add(sunSurfaceLight1);

    var sunSurfaceLight2 = new THREE.PointLight(color, intensive, distance);
    sunSurfaceLight2.position.set(sunX-offset, sunY+offset, 0.7);
    scene.add(sunSurfaceLight2);

    var sunSurfaceLight3 = new THREE.PointLight(color, intensive, distance);
    sunSurfaceLight3.position.set(sunX+offset, sunY-offset, 0.7);
    scene.add(sunSurfaceLight3);

    //Четвертая лампа
    var sunSurfaceLight4 = new THREE.PointLight(color, intensive, distance);
    sunSurfaceLight4.position.set(sunX+offset, sunY+offset, 0.7);
    scene.add(sunSurfaceLight4);

    //Меркурий
    var mercury = THREEx.Planets.createMercury();
    mercury.scale.multiplyScalar(0.15);
    mercury.position.set(-1.65, 0, 0);
    scene.add(mercury);
    onRenderFcts.push(function(delta, now){
        mercury.rotation.y += 1/16 * delta;
    });

    //Венера
    var venus = THREEx.Planets.createVenus();
    venus.scale.multiplyScalar(0.25);
    venus.position.set(-1.1, 0, 0);
    scene.add(venus);
    onRenderFcts.push(function(delta, now){
        venus.rotation.y += 1/16 * delta;
    });


    /* Земля */

    //Контейнер
    var containerEarth	= new THREE.Object3D();
    var earthX = -0.55,
        earthY = 0,
        earthZ = 0;
    containerEarth.position.set(earthX, earthY, earthZ);
    containerEarth.scale.multiplyScalar(0.3);
    scene.add(containerEarth);

    //Сама планета
    var earth = THREEx.Planets.createEarth();
    containerEarth.add(earth);
    onRenderFcts.push(function(delta, now){
        earth.rotation.y += 1/32 * delta;
    });

    //Облака
    var cloud = THREEx.Planets.createEarthCloud();
    containerEarth.add(cloud);
    onRenderFcts.push(function(delta, now){
        cloud.rotation.y += 1/8 * delta;
    });
    cloud.receiveShadow	= true;
    cloud.castShadow	= true;

    //Луна

    //Контейнер, чтобы луна имела свою независимую точку вращения
    var containerMoon = new THREE.Object3D();
    containerMoon.position.set(earthX, earthY, earthZ);
    scene.add(containerMoon);
    onRenderFcts.push(function(delta, now){
        containerMoon.rotation.z += 1/2 * delta;
    });

    //Сама луна
    var moon = THREEx.Planets.createMoon();
    moon.position.set(0.3, 0, 0);
    moon.scale.multiplyScalar(0.1);
    containerMoon.add(moon);

    //Марс
    var mars = THREEx.Planets.createMars();
    mars.scale.multiplyScalar(0.2);
    mars.position.set(0, 0, 0);
    scene.add(mars);
    onRenderFcts.push(function(delta, now){
        mars.rotation.y += 1/16 * delta;
    });
    mars.receiveShadow	= true;
    mars.castShadow	= true;

    //Юпитер (не на своей юрбите)
    var jupiter = THREEx.Planets.createJupiter();
    jupiter.scale.multiplyScalar(0.8);
    jupiter.position.set(0.6, 0, 0);
    scene.add(jupiter);
    onRenderFcts.push(function(delta, now){
        jupiter.rotation.y += 1/16 * delta;
    });
    jupiter.receiveShadow	= true;
    jupiter.castShadow	= true;

    //Сатурн
    var saturn = THREEx.Planets.createSaturn();
    saturn.scale.multiplyScalar(0.55);
    saturn.position.set(1.62, 0, 0);

    onRenderFcts.push(function(delta, now){
        saturn.rotation.y += 1/16 * delta;
    });

    //В последней версии three.js кольца вызывают ошибку
    var saturnRing = THREEx.Planets.createSaturnRing();
    saturn.add(saturnRing);
    scene.add(saturn);

    //Уран
    var uranus = THREEx.Planets.createUranus();
    uranus.scale.multiplyScalar(0.2);
    uranus.position.set(2.19, 0, 0);
    scene.add(uranus);
    onRenderFcts.push(function(delta, now){
        uranus.rotation.y += 1/16 * delta;
    });

    //Нептун
    var neptune = THREEx.Planets.createNeptune();
    neptune.scale.multiplyScalar(1/5);
    neptune.position.set(2.72, 0, 0);
    scene.add(neptune);
    onRenderFcts.push(function(delta, now){
        neptune.rotation.y += 1/16 * delta;
    });

    //Общий свет
    var light	= new THREE.AmbientLight(0x666666);
    scene.add( light );

    //Рендерим
    onRenderFcts.push(function(){
        renderer.render( scene, camera );
    });

    //Зацикливаем
    var lastTimeMsec= null;
    requestAnimationFrame(function animate(nowMsec){
        // keep looping
        requestAnimationFrame( animate );
        // measure time
        lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
        var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec	= nowMsec;
        // call each update function
        onRenderFcts.forEach(function(onRenderFct){
            onRenderFct(deltaMsec/1000, nowMsec/1000)
        })
    });
</script>
</body>
</html>