import {
  Vector3,
  Group,
  DodecahedronBufferGeometry,
  MeshBasicMaterial,
  InstancedMesh,
} from 'three';
import game from 'game';
import playAudio from 'utils/playAudio';
import explosion from 'assets/audio/explosion.mp3';

/**
 * Make explosion particles
 */
function make(color, speed) {
  return {
    color,
    data: new Array(20)
      .fill()
      .map(() => [
        new Vector3(),
        new Vector3(
          -1 + Math.random() * 2,
          -1 + Math.random() * 2,
          -1 + Math.random() * 2
        )
          .normalize()
          .multiplyScalar(speed * 0.75),
      ]),
  };
}

class Explosion extends Group {
  constructor({ position, scale }) {
    super();

    this.position.copy(position);
    this.scale.set(scale, scale, scale);

    this.init();
    playAudio(new Audio(explosion), 0.5);

    this.update = this.update.bind(this);
  }

  init() {
    this.particles = [make('white', 0.8), make('orange', 0.6)];

    this.particles.forEach(({ color, data }) => {
      const particleGeometry = new DodecahedronBufferGeometry(10, 0);
      const particleMaterial = new MeshBasicMaterial({
        color,
        fog: false,
        transparent: true,
      });

      const particleMesh = new InstancedMesh(
        particleGeometry,
        particleMaterial,
        data.length
      );
      particleMesh.frustumCulled = false;

      this.add(particleMesh);
    });
  }

  update() {
    const { object } = game.data;

    this.particles.forEach(({ data }, index) => {
      const mesh = this.children[index];
      if (!mesh) return;

      data.forEach(([vec, normal], i) => {
        vec.add(normal);

        object.position.copy(vec);
        object.updateMatrix();

        mesh.setMatrixAt(i, object.matrix);
      });

      mesh.material.opacity -= 0.025;
      mesh.instanceMatrix.needsUpdate = true;
    });
  }
}

class Explosions extends Group {
  constructor() {
    super();

    this.explosions = [];

    this.update = this.update.bind(this);
  }

  handleExplosions() {
    const { explosions } = game.data;

    const newExplosions = explosions.filter(
      ({ guid }) => !this.children.filter(explosions => explosions.guid === guid)[0]
    );
    if (newExplosions.length > 0) {
      newExplosions.forEach(({ offset, scale, guid }) => {
        const explosion = new Explosion({
          position: offset,
          scale: scale * 0.75,
        });
        explosion.guid = guid;

        this.add(explosion);
      });
    }

    const oldExplosions = this.children.filter(
      ({ guid }) => !explosions.filter(explosion => explosion.guid === guid)[0]
    );
    if (oldExplosions.length > 0) {
      oldExplosions.forEach(explosion => {
        this.remove(explosion);
      });
    }
  }

  update() {
    this.handleExplosions();

    this.children.forEach(child => {
      if (child.update) child.update();
    });
  }
}

export default Explosions;
