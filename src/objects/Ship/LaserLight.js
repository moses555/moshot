import { PointLight } from 'three';
import game from 'game';

class LaserLight extends PointLight {
  constructor() {
    super('lightgreen', 0, 100);

    this.position.set(0, 0, -20);
  }

  update() {
    const { lasers } = game.data;

    this.intensity +=
      ((lasers.length && Date.now() - lasers[lasers.length - 1] < 100 ? 20 : 0) -
        this.intensity) *
      0.3;
  }
}

export default LaserLight;
