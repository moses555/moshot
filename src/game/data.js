import {
  Vector3,
  CatmullRomCurve3,
  TubeBufferGeometry,
  Clock,
  Vector2,
  Object3D,
  Ray,
  Box3,
} from 'three';

let guid = 1;

/**
 * Assigns mesh data to a mesh
 */
function randomData(count, track, radius, size, scale) {
  return new Array(count).fill().map(() => {
    const offset = track.parameters.path
      .getPointAt(Math.random())
      .multiplyScalar(15)
      .add(
        new Vector3(
          -radius + Math.random() * radius * 2,
          -radius + Math.random() * radius * 2,
          -radius + Math.random() * radius * 2
        )
      );
    const speed = 0.1 + Math.random();

    return {
      guid: guid++,
      scale: typeof scale === 'function' ? scale() : scale,
      size,
      offset,
      speed,
      radius,
      hit: new Vector3(),
      distance: 1000,
    };
  });
}

/**
 * Initial game state
 */
const spline = new CatmullRomCurve3([new Vector3(0, 0, 0), new Vector3(0, 0, -1000)]);
const track = new TubeBufferGeometry(spline, 250, 0.2, 10, true);

const data = {
  points: 0,
  health: 100,
  lasers: [],
  explosions: [],
  rocks: randomData(200, track, 150, 8, () => 1 + Math.random() * 2.5),
  particles: randomData(1000, track, 100, 1, () => 0.5 + Math.random() * 0.8),
  t: 0,
  position: new Vector3(),
  startTime: Date.now(),
  track,
  speed: 20,
  hits: false,
  looptime: 40 * 1000,
  clock: new Clock(false),
  mouse: new Vector2(-250, 50),

  // Re-usable objects
  object: new Object3D(),
  ray: new Ray(),
  box: new Box3(),
};

export default data;
