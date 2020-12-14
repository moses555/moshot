import { MeshBasicMaterial, Group, Mesh, BoxBufferGeometry } from 'three';
import game from 'game';

class Crosshair extends Group {
  constructor() {
    super();

    this.material = new MeshBasicMaterial({ color: 'hotpink', fog: false });

    this.cross = new Group();
    this.cross.position.set(0, 0, -300);
    this.cross.name = 'cross';
    this.add(this.cross);

    const crossHorizontal = new Mesh(new BoxBufferGeometry(20, 2, 2), this.material);
    crossHorizontal.renderOrder = 1000;
    this.cross.add(crossHorizontal);

    const crossVertical = new Mesh(new BoxBufferGeometry(2, 20, 2), this.material);
    crossVertical.renderOrder = 1000;
    this.cross.add(crossVertical);

    this.target = new Group();
    this.target.position.set(0, 0, -300);
    this.target.name = 'target';
    this.add(this.target);

    const targetTop = new Mesh(new BoxBufferGeometry(40, 2, 2), this.material);
    targetTop.position.set(0, 20, 0);
    targetTop.renderOrder = 1000;
    this.target.add(targetTop);

    const targetBottom = new Mesh(new BoxBufferGeometry(40, 2, 2), this.material);
    targetBottom.position.set(0, -20, 0);
    targetBottom.renderOrder = 1000;
    this.target.add(targetBottom);

    const targetLeft = new Mesh(new BoxBufferGeometry(2, 40, 2), this.material);
    targetLeft.position.set(20, 0, 0);
    targetLeft.renderOrder = 1000;
    this.target.add(targetLeft);

    const targetRight = new Mesh(new BoxBufferGeometry(2, 40, 2), this.material);
    targetRight.position.set(-20, 0, 0);
    targetRight.renderOrder = 1000;
    this.target.add(targetRight);
  }

  update() {
    const { hits } = game.data;

    this.material.color.set(hits ? 'lightgreen' : 'hotpink');
    this.cross.visible = !hits;
    this.target.visible = !!hits;
  }
}

export default Crosshair;
