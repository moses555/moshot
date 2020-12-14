import { Expo, gsap, Power4 } from 'gsap';
import {
  Group,
  SphereBufferGeometry,
  MeshStandardMaterial,
  Mesh,
  Vector3,
  PlaneGeometry,
  TextureLoader,
} from 'three';
import Fragments from './Fragments';
import manager from 'utils/manager';
import moonTexture from 'assets/moon.png';
import splashTexture from 'assets/splash.svg';

class Moon extends Group {
  constructor() {
    super();

    const moonGeometry = new SphereBufferGeometry(1.25, 32, 32);
    const moonMaterial = new MeshStandardMaterial({ roughness: 1, fog: false });
    this.moon = new Mesh(moonGeometry, moonMaterial);
    this.add(this.moon);

    this.moon.scale.multiplyScalar(60);
    this.moon.rotation.y = Math.PI;
    this.position.z = 220;

    const rotationAxis = new Vector3(1, -1, 0).normalize();

    this.fragments = new Fragments();
    this.fragments.userData.rotationAxis = rotationAxis;
    this.add(this.fragments);

    const splashGeometry = new PlaneGeometry(200, 70);
    const splashMaterial = new MeshStandardMaterial({
      color: 0xffffff,
      fog: false,
      transparent: true,
    });

    this.splash = new Mesh(splashGeometry, splashMaterial);
    this.splash.rotation.y = Math.PI;
    this.splash.position.z = 0;
    this.splash.visible = false;
    this.add(this.splash);

    const textureLoader = new TextureLoader(manager);

    textureLoader.load(moonTexture, texture => {
      this.moon.material.map = texture;
      this.moon.material.needsUpdate = true;
    });

    textureLoader.load(splashTexture, texture => {
      this.splash.material.map = texture;
      this.splash.material.needsUpdate = true;
    });

    this.update = this.update.bind(this);
  }

  update() {
    if (this.shattered) return this.fragments.update();

    this.shattered = true;

    gsap.to(this.moon.scale, {
      duration: 1,
      ease: Power4.easeIn,
      x: this.moon.scale.x * 1.2,
      y: this.moon.scale.y * 1.2,
      z: this.moon.scale.z * 1.2,
      onComplete: () => {
        const distanceMax = 220;
        const distanceMin = 100;

        const fromDistance = this.moon.geometry.parameters.radius * this.moon.scale.x;

        this.fragments.children.forEach(fragment => {
          const distance = Math.random() * (distanceMax - distanceMin) + distanceMin;
          const { translationAxis } = fragment.userData;

          this.moon.visible = false;
          this.splash.visible = true;

          gsap.fromTo(
            fragment.position,
            {
              x: translationAxis.x * fromDistance,
              y: translationAxis.y * fromDistance,
              z: translationAxis.z * fromDistance,
            },
            {
              duration: 6,
              ease: Expo.easeOut,
              x: translationAxis.x * distance,
              y: translationAxis.y * distance,
              z: translationAxis.z * distance,
            }
          );
        });
      },
    });
  }
}

export default Moon;
