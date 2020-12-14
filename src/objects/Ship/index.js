import { Group, Mesh, BoxBufferGeometry, MeshBasicMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import LaserLight from './LaserLight';
import Crosshair from './Crosshair';
import game from 'game';
import manager from 'utils/manager';
import shipMaterial from './shipMaterial';
import shipModelPath from 'assets/models/ship.gltf';

class Ship extends Group {
  constructor() {
    super();

    this.worldPosition = new Vector3();
    this.worldDirection = new Vector3();
    this.lasers = [];

    this.laserLight = new LaserLight();
    this.add(this.laserLight);

    this.crosshair = new Crosshair();
    this.add(this.crosshair);

    const modelLoader = new GLTFLoader(manager);
    modelLoader.load(shipModelPath, model => {
      model.scene.rotation.set(0, Math.PI, 0);

      model.scene.traverse(node => {
        if (node.isMesh) {
          node.material = shipMaterial[node.name];
        }
      });

      this.add(model.scene);
    });

    this.update = this.update.bind(this);
  }

  handleLasers() {
    const { lasers } = game.data;

    const newLasers = lasers.filter((laser, index) => !this.lasers[index]);
    if (newLasers.length === 0) return;

    const laserGeometry = new BoxBufferGeometry(1, 1, 40);
    const laserMaterial = new MeshBasicMaterial({ color: 'lightgreen' });

    newLasers.forEach(() => {
      const laser = new Group();

      const laserLeft = new Mesh(laserGeometry, laserMaterial);
      laserLeft.position.set(-2.8, 0, -0.8);
      laser.add(laserLeft);

      const laserRight = new Mesh(laserGeometry, laserMaterial);
      laserRight.position.set(2.8, 0, -0.8);
      laser.add(laserRight);

      this.add(laser);

      this.lasers.push(laser);
    });
  }

  update() {
    this.handleLasers();

    const session = game.renderer.xr.getSession();

    if (session) {
      this.rotation.set(0, 0, 0);
      this.position.set(0, -0.8, 20);
    } else {
      this.rotation.z += (game.data.mouse.x / 500 - this.rotation.z) * 0.1;
      this.rotation.x += (-game.data.mouse.y / 1200 - this.rotation.x) * 0.1;
      this.rotation.y += (-game.data.mouse.x / 1200 - this.rotation.y) * 0.1;

      this.position.x += (game.data.mouse.x / 10 - this.position.x) * 0.1;
      this.position.y += (-game.data.mouse.y / 10 - this.position.y) * 0.1;
    }

    this.lasers.forEach(laser => {
      laser.position.z -= 20;
    });

    this.getWorldPosition(this.worldPosition);
    this.getWorldDirection(this.worldDirection);
    game.data.ray.origin.copy(this.worldPosition);
    game.data.ray.direction.copy(this.worldDirection.negate());

    this.laserLight.update();
    this.crosshair.update();
  }
}

export default Ship;
