import * as THREE from "three";

import fragment from "./shader/fragment.glsl";

import vertex from "./shader/vertex.glsl";

import * as dat from "dat.gui";

import { gsap } from "gsap";

import OrbitControls from 'orbit-controls-es6';

import * as CANNON from 'cannon';

import sq from './sq.jpg';

console.log('Three:', THREE);

console.log('dat:', dat);

console.log('gsap:', gsap, 'timeline:', gsap.timeline());

console.log('Orbit Controls:', OrbitControls);

console.log('Cannonjs:', CANNON);

console.log('vertexShader:', vertex);

console.log('fragmentShader:', fragment);

class Sketch {

    constructor(selector) {

        this.configScene();

        this.initParameters();

        this.configRenderer();

        this.attachDOM(selector);

        this.setDimensions(window.innerWidth - 20, window.innerHeight - 20);

        this.configCamera();

        this.resize();

        this.configControls();

        this.setupPhysics();

        this.setupResize();

        this.resize();

        this.addObjects();

        this.render();
    }

    configScene() {

        this.scene = new THREE.Scene();
    }

    initParameters() {

        this.paused = false;

        this.lastTime = 0;

        this.time = 0;

        this.fixedTimestep = 1.0 / 60.0;

        this.maxSubSteps = 3;
    }

    configRenderer() {

        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.renderer.setClearColor(0xeeeeee, 1);
    }

    attachDOM(selector) {

        this.container = document.getElementById(selector);

        this.container.appendChild(this.renderer.domElement);
    }

    setDimensions(w, h) {

        this.width = window.innerWidth - 20;

        this.height = window.innerHeight - 20;
    }

    configCamera() {

        this.camera = new THREE.PerspectiveCamera(
            70,
            this.width / this.height,
            0.001,
            1000
        );

        this.camera.position.set(0, -4, 4);
    }

    configControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.autoRotate = false;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        this.controls.update();
    }

    configSettings() {

        let that = this;

        this.settings = {
            time: 0,
            amlitude: 1,
            diffAmplitude: 1,
            period1: 1,
            period2: 1,
            perlinAmplitude: 1,
            timespeed: 1,
            oneWave: 1000,
            size: 5,
            fly: function () {
                alert("fly");
            }
        };

        this.gui = new dat.GUI();

        this.gui.add(this.settings, "time", 0, 100, 0.01);

        this.gui.add(this.settings, "fly").name("Test fly");
    }

    setupResize() {

        window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {

        this.setDimensions(window.innerWidth - 20, window.innerHeight - 20);

        this.renderer.setSize(this.width, this.height);

        this.camera.aspect = this.width / this.height;

        this.camera.updateProjectionMatrix();
    }

    setupPhysics() {

        this.world = new CANNON.World();

        this.world.gravity.set(0, 0, -9);

        this.world.broadphase = new CANNON.NaiveBroadphase();

        const radius = 1;

        this.cannonBody = new CANNON.Body({
            mass: 5,
            position: new CANNON.Vec3(0, 0, 10),
            shape: new CANNON.Sphere(radius)
        });

        this.world.addBody(this.cannonBody);

        this.groundBody = new CANNON.Body({
            mass: 0
        });

        this.groundShape = new CANNON.Plane();

        this.groundBody.addShape(this.groundShape);

        this.world.addBody(this.groundBody);
    }

    addObjects() {

        let that = this;

        const geometry = new THREE.SphereGeometry(1, 32, 32);

        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        this.mesh = new THREE.Mesh(geometry, material);

        this.scene.add(this.mesh);
    }

    stop() {

        this.paused = true;
    }

    play() {

        this.paused = false;
        this.render();
    }

    render() {

        if (this.paused) {

            return;
        }

        this.time += 0.05;

        if (this.lastTime !== undefined) {

            this.world.step(this.fixedTimestep);
        }

        this.lastTime = this.time;

        this.mesh.position.copy(this.cannonBody.position);

        requestAnimationFrame(this.render.bind(this));

        this.renderer.render(this.scene, this.camera);
    }
}

class SketchBox extends Sketch {

    setupPhysics() {

        this.world = new CANNON.World();

        this.world.gravity.set(0, 0, -9);

        this.world.broadphase = new CANNON.NaiveBroadphase();

        this.cannonBody = new CANNON.Body({
            mass: 5,
            position: new CANNON.Vec3(0, 0, 10),
            shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1))
        });

        this.world.addBody(this.cannonBody);

        this.groundBody = new CANNON.Body({
            mass: 0
        });

        this.groundShape = new CANNON.Plane();

        this.groundBody.addShape(this.groundShape);

        this.world.addBody(this.groundBody);
    }

    addObjects() {

        let that = this;

        const geometry = new THREE.BoxGeometry(1, 1, 1);

        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        this.mesh = new THREE.Mesh(geometry, material);

        this.scene.add(this.mesh);
    }
}

class SketchFallingCards extends SketchBox {

    setupPhysics() {

        this.world = new CANNON.World();

        this.world.gravity.set(0, 0, -9);

        this.world.broadphase = new CANNON.NaiveBroadphase();

        this.cannonBody = new CANNON.Body({
            mass: 5,
            position: new CANNON.Vec3(0, 0, 10),
            shape: new CANNON.Box(new CANNON.Vec3(.5, .01, .5))
        });

        this.world.addBody(this.cannonBody);

        this.groundBody = new CANNON.Body({
            mass: 0
        });

        this.groundShape = new CANNON.Plane();

        this.groundBody.addShape(this.groundShape);

        this.world.addBody(this.groundBody);
    }

    addObjects() {

        let that = this;

        const geometry = new THREE.BoxGeometry(1, .1, 1);

        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        this.mesh = new THREE.Mesh(geometry, material);

        this.scene.add(this.mesh);

        const surfaceGeometry = new THREE.PlaneBufferGeometry(5, 20, 32);

        const surfaceMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x0000ff, side: THREE.DoubleSide });

        this.plane = new THREE.Mesh(surfaceGeometry, surfaceMaterial);

        this.scene.add(this.plane);
    }

    render() {

        if (this.paused) {

            return;
        }

        this.time += 0.05;

        if (this.lastTime !== undefined) {

            this.world.step(this.fixedTimestep);
        }

        this.lastTime = this.time;

        this.mesh.position.copy(this.cannonBody.position);

        this.mesh.quaternion.copy(this.cannonBody.quaternion);

        requestAnimationFrame(this.render.bind(this));

        this.renderer.render(this.scene, this.camera);
    }
}

class SketchFallingTogether extends SketchFallingCards {

    setupPhysics() {

        this.world = new CANNON.World();

        this.world.gravity.set(0, 0, -9);

        this.world.broadphase = new CANNON.NaiveBroadphase();

        this.cannonBody = new CANNON.Body({
            mass: 0.01,
            position: new CANNON.Vec3(0, 0, 10),
            shape: new CANNON.Box(new CANNON.Vec3(.5, .01, .5))
        });

        this.world.addBody(this.cannonBody);

        this.cannonBody2 = new CANNON.Body({
            mass: 0.01,
            position: new CANNON.Vec3(0, 0, 12),
            shape: new CANNON.Box(new CANNON.Vec3(.5, .05, .5))
        });

        this.world.addBody(this.cannonBody2);

        this.createMatrix();

        const hfShape = new CANNON.Heightfield(this.matrix, {
            elementSize: 5
        });

        const hfBody = new CANNON.Body({ mass: 0 });

        hfBody.addShape(hfShape);

        this.world.addBody(hfBody);

        this.groundBody = new CANNON.Body({
            mass: 0
        });

        this.groundShape = new CANNON.Plane();

        this.groundBody.addShape(this.groundShape);

        this.world.addBody(this.groundBody);
    }

    createMatrix() {

        this.matrix = [];

        const sizeX = 20;

        const sizeY = 20;

        for (let i = 0; i < sizeX; i++) {

            this.matrix.push([]);

            for (let j = 0; j < sizeY; j++) {

                this.matrix[i].push(Math.random());
            }
        }
    }

    addObjects() {

        let that = this;

        const geometry = new THREE.BoxGeometry(1, .1, 1);

        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        this.mesh = new THREE.Mesh(geometry, material);

        this.scene.add(this.mesh);

        const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });

        this.mesh2 = new THREE.Mesh(geometry, material2);

        this.scene.add(this.mesh2);

        const surfaceGeometry = new THREE.PlaneBufferGeometry(5, 20, 32);

        const surfaceMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x0000ff, side: THREE.DoubleSide });

        this.plane = new THREE.Mesh(surfaceGeometry, surfaceMaterial);

        this.scene.add(this.plane);
    }

    render() {

        if (this.paused) {

            return;
        }

        this.time += 0.05;

        if (this.lastTime !== undefined) {

            this.world.step(this.fixedTimestep);
        }

        this.lastTime = this.time;

        this.mesh.position.copy(this.cannonBody.position);

        this.mesh.quaternion.copy(this.cannonBody.quaternion);

        this.mesh2.position.copy(this.cannonBody2.position);

        this.mesh2.quaternion.copy(this.cannonBody2.quaternion);

        requestAnimationFrame(this.render.bind(this));

        this.renderer.render(this.scene, this.camera);
    }
}

class SketchManyCards extends SketchFallingTogether {

    setupPhysics() {

        this.world = new CANNON.World();

        this.world.gravity.set(0, 0, -2);

        this.world.broadphase = new CANNON.NaiveBroadphase();

        this.physicsObjects = [];

        this.number = 10;

        for (let i = 0; i < this.number; i++) {

            const body = new CANNON.Body({
                mass: 0.01,
                position: new CANNON.Vec3(10 * (Math.random() - 0.5), 10 * (Math.random() - 0.5), 4 + 4 * Math.random()),
                shape: new CANNON.Box(new CANNON.Vec3(.5, .01, .5))
            });

            body.angularVelocity.set(Math.random(), 2 * Math.random(), 0);

            this.physicsObjects.push(body);

            this.world.addBody(body);
        }

        this.createMatrix();

        const hfShape = new CANNON.Heightfield(this.matrix, {
            elementSize: 5
        });

        const hfBody = new CANNON.Body({ mass: 0 });

        hfBody.addShape(hfShape);

        this.world.addBody(hfBody);

        this.groundBody = new CANNON.Body({
            mass: 0
        });

        this.groundShape = new CANNON.Plane();

        this.groundBody.addShape(this.groundShape);

        this.world.addBody(this.groundBody);
    }

    createMatrix() {

        this.matrix = [];

        const sizeX = 20;

        const sizeY = 20;

        for (let i = 0; i < sizeX; i++) {

            this.matrix.push([]);

            for (let j = 0; j < sizeY; j++) {

                this.matrix[i].push(Math.random() / 10);
            }
        }
    }

    addObjects() {

        let that = this;

        this.objects = [];

        this.physicsObjects.forEach(obj => {

            const geometry = new THREE.PlaneBufferGeometry(1, 1);

            geometry.rotateX(Math.PI / 2);

            const material = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });

            const mesh = new THREE.Mesh(geometry, material);

            this.objects.push(mesh);

            this.scene.add(mesh);
        });

        const surfaceGeometry = new THREE.PlaneBufferGeometry(5, 20, 32);

        const surfaceMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x0000ff, side: THREE.DoubleSide });

        this.plane = new THREE.Mesh(surfaceGeometry, surfaceMaterial);

        this.scene.add(this.plane);
    }

    render() {

        if (this.paused) {

            return;
        }

        this.time += 0.05;

        if (this.lastTime !== undefined) {

            this.world.step(this.fixedTimestep);
        }

        this.lastTime = this.time;

        this.physicsObjects.forEach((obj, i) => {

            this.objects[i].position.copy(obj.position);

            this.objects[i].quaternion.copy(obj.quaternion);
        });

        requestAnimationFrame(this.render.bind(this));

        this.renderer.render(this.scene, this.camera);
    }
}

class SketchTrollCards extends SketchManyCards {

    configScene() {

        this.scene = new THREE.Scene();

        this.scene.background = new THREE.Color(0x000000);
    }

    setupPhysics() {

        this.world = new CANNON.World();

        this.world.gravity.set(0, 0, -2);

        this.world.broadphase = new CANNON.NaiveBroadphase();

        this.physicsObjects = [];

        this.number = Math.round(30 * Math.random());

        for (let i = 0; i < this.number; i++) {

            const body = new CANNON.Body({
                mass: 0.01,
                position: new CANNON.Vec3(10 * (Math.random() - 0.5), 10 * (Math.random() - 0.5), 4 + 4 * Math.random()),
                shape: new CANNON.Box(new CANNON.Vec3(.5, .01, .5))
            });

            body.angularVelocity.set(Math.random(), 2 * Math.random(), 0);

            this.physicsObjects.push(body);

            this.world.addBody(body);
        }

        this.createMatrix();

        const hfShape = new CANNON.Heightfield(this.matrix, {
            elementSize: 5
        });

        const hfBody = new CANNON.Body({ mass: 0 });

        hfBody.addShape(hfShape);

        this.world.addBody(hfBody);

        this.groundBody = new CANNON.Body({
            mass: 0
        });

        this.groundShape = new CANNON.Plane();

        this.groundBody.addShape(this.groundShape);

        this.world.addBody(this.groundBody);
    }

    addObjects() {

        let that = this;

        this.objects = [];

        this.physicsObjects.forEach(obj => {

            const geometry = new THREE.PlaneBufferGeometry(1, 1);

            geometry.rotateX(Math.PI / 2);

            const material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                map: new THREE.TextureLoader().load(sq)
            });

            const mesh = new THREE.Mesh(geometry, material);

            this.objects.push(mesh);

            this.scene.add(mesh);
        });

        const surfaceGeometry = new THREE.PlaneBufferGeometry(5, 20, 32);

        const surfaceMaterial = new THREE.MeshBasicMaterial({ wireframe: false, color: 0x000000, side: THREE.DoubleSide, opacity: 0, transparent: true });

        this.plane = new THREE.Mesh(surfaceGeometry, surfaceMaterial);

        this.scene.add(this.plane);
    }
}

const sketch = new Sketch("container");

const sketch2 = new SketchBox("containerBox");

const sketch3 = new SketchFallingCards("containerCard");

const sketch4 = new SketchFallingTogether("containerTwoCards");

const sketch5 = new SketchManyCards("containerSetCards");

const sketch6 = new SketchTrollCards("containerTrollCards");