import {
  WebGLRenderer,
  ACESFilmicToneMapping,
  sRGBEncoding,
  Scene,
  Color,
  Fog,
  PerspectiveCamera,
  Group,
  AmbientLight,
} from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import Controllers from 'objects/Controllers';
import { cleanScene, cleanRenderer, removeLights } from 'utils/three';
import xr from 'utils/xr';

class Engine {
  constructor({
    width = window.innerWidth,
    height = window.innerHeight,
    canvas,
    ...rest
  } = {}) {
    this.width = width;
    this.height = height;

    this.container = canvas ? document.body : document.querySelector('.game');

    Object.assign(this, rest);

    this.meshCount = 0;
    this.meshListeners = [];

    this.renderer = new WebGLRenderer({ alpha: true, antialias: true, canvas });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(0.25);
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.outputEncoding = sRGBEncoding;

    if (xr) {
      this.renderer.xr.enabled = true;
      this.renderer.xr.setFramebufferScaleFactor(2.0);

      this.container.appendChild(VRButton.createButton(this.renderer));
    }

    this.scene = new Scene();
    this.scene.background = new Color(0x020209);
    this.scene.fog = new Fog(0x070715, 100, 1400);

    this.camera = new PerspectiveCamera(70, this.width / this.height, 0.01, 60000);

    this.rig = new Group();
    this.rig.add(this.camera);
    this.scene.add(this.rig);

    this.controllers = new Controllers(this.renderer);
    this.rig.add(this.controllers);

    this.composer = new EffectComposer(this.renderer);
    this.composer.setSize(this.width, this.height);

    this.renderPass = new RenderPass(this.scene, this.camera);
    this.unrealBloomPass = new UnrealBloomPass(undefined, 2, 1, 0);

    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.unrealBloomPass);

    const ambientLight = new AmbientLight(0xffffff, 0.2);

    this.lights = [ambientLight];
    this.lights.forEach(light => this.scene.add(light));

    this.dom = this.renderer.domElement;
    if (!canvas) this.container.appendChild(this.dom);

    this.onResize = () => {
      this.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', this.onResize);

    this.update = this.update.bind(this);
    this.resize = this.resize.bind(this);
  }

  add(mesh) {
    this.scene.add(mesh);
    if (!mesh.update) return;

    this.meshListeners.push(mesh.update);
    this.meshCount++;
  }

  remove(mesh) {
    this.scene.remove(mesh);
    if (!mesh.update) return;

    const index = this.meshListeners.indexOf(mesh.update);
    if (index > -1) this.meshListeners.splice(index, 1);

    this.meshCount--;
  }

  init(callback) {
    const loop = () => {
      if (callback) callback();

      this.update();
    };

    this.renderer.setAnimationLoop(loop);
  }

  update() {
    let i = this.meshCount;
    while (--i >= 0) {
      this.meshListeners[i].apply(this, null);
    }

    this.render();
  }

  render() {
    if (this.renderer.xr.isPresenting) {
      this.renderer.render(this.scene, this.camera);
    } else {
      this.composer.render();
    }
  }

  resize(width, height) {
    this.width = width;
    this.height = height;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.composer.setSize(this.width, this.height);
  }

  dispose() {
    window.removeEventListener('resize', this.onResize);

    cleanScene(this.scene);
    cleanRenderer(this.renderer);
    removeLights(this.lights);
  }
}

export default Engine;
