import { Points, BufferGeometry, BufferAttribute, PointsMaterial } from 'three';

class Stars extends Points {
  constructor({ count = 1000 } = {}) {
    const positions = [];

    for (let i = 0; i < count; i++) {
      const r = 4000;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.cos(theta) * Math.sin(phi) + (-2000 + Math.random() * 4000);
      const y = r * Math.sin(theta) * Math.sin(phi) + (-2000 + Math.random() * 4000);
      const z = r * Math.cos(phi) + (-1000 + Math.random() * 2000);

      positions.push(x);
      positions.push(y);
      positions.push(z);
    }

    const stars = new Float32Array(positions);

    const starsGeometry = new BufferGeometry({ count: positions.length / 3 });
    starsGeometry.setAttribute('position', new BufferAttribute(stars, 3));

    const starsMaterial = new PointsMaterial({
      size: 150,
      sizeAttenuation: true,
      color: 0xffffff,
      fog: false,
    });

    super(starsGeometry, starsMaterial);
    this.scale.set(10, 10, 10);
  }
}

export default Stars;
