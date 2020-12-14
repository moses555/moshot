import { Group, PointLight } from 'three';
import Ship from 'objects/Ship';
import game from 'game';

class Player extends Group {
  constructor() {
    super();

    const pointLight = new PointLight('indianred', 5, 400);
    pointLight.position.set(0, 100, -420);
    this.add(pointLight);

    this.ship = new Ship();
    this.add(this.ship);

    this.position.z = -20;

    this.update = this.update.bind(this);
  }

  update() {
    const { position } = game.data;

    this.ship.update();

    this.position.set(position.x, position.y, position.z - 20);
  }
}

export default Player;
