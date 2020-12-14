import { Group, Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import game from 'game';
import manager from 'utils/manager';
import rockModelPath from 'assets/models/rock.gltf';

let geometry, material;

class Rock extends Group {
  constructor({ offset, scale, speed }) {
    super();

    this.position.copy(offset);
    this.scale.set(scale, scale, scale);
    this.scale.multiplyScalar(20);
    this.speed = speed;

    const rock = new Mesh(geometry, material);

    this.add(rock);

    this.update = this.update.bind(this);
  }

  update() {
    const { clock } = game.data;

    const r = Math.cos((clock.getElapsedTime() / 2) * this.speed) * Math.PI;
    this.rotation.set(r, r, r);
  }
}

class Rocks extends Group {
  constructor() {
    super();

    const modelLoader = new GLTFLoader(manager);
    modelLoader.load(rockModelPath, model => {
      model.scene.traverse(node => {
        if (node.isMesh) {
          geometry = node.geometry;
          material = node.material;
        }
      });

      game.data.rocks.forEach(data => {
        const rock = new Rock(data);

        this.add(rock);
      });
    });

    this.update = this.update.bind(this);
  }

  handleRocks() {
    const { rocks } = game.data;

    const newRocks = rocks.filter(
      ({ guid }) => !this.children.filter(rock => rock.guid === guid)[0]
    );
    if (newRocks.length > 0) {
      newRocks.forEach(({ guid, ...data }) => {
        const rock = new Rock(data);
        rock.guid = guid;

        this.add(rock);
      });
    }

    const oldRocks = this.children.filter(
      ({ guid }) => !rocks.filter(rock => rock.guid === guid)[0]
    );
    if (oldRocks.length > 0) {
      oldRocks.forEach(rock => {
        this.remove(rock);
      });
    }
  }

  update() {
    this.handleRocks();

    this.children.forEach(child => {
      if (child.update) child.update();
    });
  }
}

export default Rocks;
