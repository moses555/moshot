import { InstancedMesh, ConeBufferGeometry, MeshStandardMaterial } from 'three';
import game from 'game';

class Particles extends InstancedMesh {
  constructor() {
    const { particles, object } = game.data;

    const particleGeometry = new ConeBufferGeometry(2, 2, 3);
    const particleMaterial = new MeshStandardMaterial({ color: 0x909090 });

    super(particleGeometry, particleMaterial, particles.length);

    this.frustumCulled = false;

    particles.forEach((particle, i) => {
      const { offset, scale } = particle;

      object.position.copy(offset);
      object.scale.set(scale, scale, scale);
      object.rotation.set(
        Math.sin(Math.random()) * Math.PI,
        Math.sin(Math.random()) * Math.PI,
        Math.cos(Math.random()) * Math.PI
      );
      object.updateMatrix();

      this.setMatrixAt(i, object.matrix);
    });

    this.instanceMatrix.needsUpdate = true;
  }
}

export default Particles;
