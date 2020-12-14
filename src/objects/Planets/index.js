import {
  Group,
  TextureLoader,
  Mesh,
  SphereBufferGeometry,
  MeshStandardMaterial,
  PointLight,
  MeshBasicMaterial,
} from 'three';
import manager from 'utils/manager';
import earthTexture from 'assets/earth.jpg';

class Planets extends Group {
  constructor() {
    super();

    this.position.set(0, 0, -25000);
    this.scale.set(1000, 1000, 1000);

    const earthGeometry = new SphereBufferGeometry(5, 32, 32);
    const earthMaterial = new MeshStandardMaterial({ roughness: 1, fog: false });
    const earth = new Mesh(earthGeometry, earthMaterial);

    const pointLight = new PointLight(0xffffff, 6, 1000);

    const sunGeometry = new SphereBufferGeometry(4, 32, 32);
    const sunMaterial = new MeshBasicMaterial({ color: 0xffff99, fog: false });
    const sun = new Mesh(sunGeometry, sunMaterial);

    const sunLight = new PointLight(0xffffff, 50, 6100);
    sun.add(sunLight);
    sun.position.set(-60, -10, -30);

    this.add(earth);
    this.add(pointLight);
    this.add(sun);

    const textureLoader = new TextureLoader(manager);

    textureLoader.load(earthTexture, texture => {
      earth.material.map = texture;
      earth.material.needsUpdate = true;
    });
  }
}

export default Planets;
