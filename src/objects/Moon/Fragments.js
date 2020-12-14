import { Expo, gsap } from 'gsap';
import {
  Face3,
  Geometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Vector3,
  Clock,
} from 'three';

const count = 600;
const vertexMax = 10;
const vertexMin = 3;
const groupDelta = Math.PI / 64;
const individualDelta = Math.PI / 8;
const startSpeed = 32;
const tweenDuration = 6;

class Fragments extends Group {
  constructor() {
    super();

    this.clock = new Clock();

    this.speed = { current: startSpeed };
    this.speedDropped = false;

    const getVertexRandom = () => Math.random() * (vertexMax - vertexMin) + vertexMin;

    const material = new MeshStandardMaterial({ color: 0x909090 });

    for (let i = 0; i < count; i += 1) {
      const geometry = new Geometry();

      geometry.vertices.push(
        new Vector3(-getVertexRandom(), 0, 0),
        new Vector3(0, 0, getVertexRandom()),
        new Vector3(getVertexRandom(), 0, 0),
        new Vector3(0, getVertexRandom(), 0)
      );

      geometry.faces.push(
        new Face3(0, 1, 3),
        new Face3(1, 2, 3),
        new Face3(2, 0, 3),
        new Face3(0, 2, 1)
      );

      geometry.computeFaceNormals();

      const fragment = new Mesh(geometry, material);

      const rotationAxis = new Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ).normalize();

      fragment.rotateOnAxis(rotationAxis, Math.random() * Math.PI);

      const translationAxis = new Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ).normalize();

      fragment.userData = { rotationAxis, translationAxis };

      this.add(fragment);
    }

    this.update = this.update.bind(this);
  }

  dropSpeed() {
    this.speedDropped = true;

    gsap.to(this.speed, {
      current: 1,
      duration: tweenDuration,
      ease: Expo.easeOut,
    });
  }

  update() {
    if (!this.speedDropped) this.dropSpeed();

    const delta = this.clock.getDelta();

    this.children.forEach(fragment => {
      const angle = individualDelta * delta;
      const axis = fragment.userData.rotationAxis;

      fragment.rotateOnAxis(axis, angle);
    });

    const groupAngle = this.speed.current * groupDelta * delta;
    const groupAxis = this.userData.rotationAxis;

    this.rotateOnWorldAxis(groupAxis, groupAngle);
  }
}

export default Fragments;
