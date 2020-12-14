import Engine from 'game/engine';
import data from 'game/data';
import actions from 'game/actions';
import playAudio from 'utils/playAudio';
import music from 'assets/audio/music.mp3';

const game = new Engine({ data, actions });

const onClick = event => {
  event.preventDefault();
  event.stopPropagation();

  actions.shoot();
};

const onSelect = () => {
  actions.shoot();
};

const onSqueezeStart = () => {};

const onSqueezeEnd = () => {};

game.pause = () => {
  // Disable mouse controls
  game.dom.removeEventListener('pointermove', actions.updateMouse);
  game.dom.removeEventListener('touchmove', actions.updateMouse);
  game.dom.removeEventListener('contextmenu', onClick);
  game.dom.removeEventListener('click', onClick);
  game.dom.removeEventListener('touchstart', onClick, { passive: false });

  // Disable VR controls
  game.controllers.controller1.removeEventListener('selectstart', onSelect);
  game.controllers.controller2.removeEventListener('selectstart', onSelect);

  game.controllers.controller1.removeEventListener('squeezestart', onSqueezeStart);
  game.controllers.controller1.removeEventListener('squeezeend', onSqueezeEnd);
  game.controllers.controller2.removeEventListener('squeezestart', onSqueezeStart);
  game.controllers.controller2.removeEventListener('squeezeend', onSqueezeEnd);

  return game.renderer.setAnimationLoop(game.render());
};

game.stop = () => {
  // Disable mouse controls
  game.dom.removeEventListener('pointermove', actions.updateMouse);
  game.dom.removeEventListener('touchmove', actions.updateMouse);
  game.dom.removeEventListener('contextmenu', onClick);
  game.dom.removeEventListener('click', onClick);
  game.dom.removeEventListener('touchstart', onClick, { passive: false });

  // Disable VR controls
  game.controllers.controller1.removeEventListener('selectstart', onSelect);
  game.controllers.controller2.removeEventListener('selectstart', onSelect);

  game.controllers.controller1.removeEventListener('squeezestart', onSqueezeStart);
  game.controllers.controller1.removeEventListener('squeezeend', onSqueezeEnd);
  game.controllers.controller2.removeEventListener('squeezestart', onSqueezeStart);
  game.controllers.controller2.removeEventListener('squeezeend', onSqueezeEnd);

  // Cleanup game engine
  return game.dispose();
};

game.start = () => {
  // Init mouse controls
  game.dom.addEventListener('pointermove', actions.updateMouse);
  game.dom.addEventListener('touchmove', actions.updateMouse);
  game.dom.addEventListener('contextmenu', onClick);
  game.dom.addEventListener('click', onClick);
  game.dom.addEventListener('touchstart', onClick, { passive: false });

  // Init VR controls
  game.controllers.controller1.addEventListener('selectstart', onSelect);
  game.controllers.controller2.addEventListener('selectstart', onSelect);

  game.controllers.controller1.addEventListener('squeezestart', onSqueezeStart);
  game.controllers.controller1.addEventListener('squeezeend', onSqueezeEnd);
  game.controllers.controller2.addEventListener('squeezestart', onSqueezeStart);
  game.controllers.controller2.addEventListener('squeezeend', onSqueezeEnd);

  // Init game clock
  data.startTime = Date.now();
  data.clock.start();

  playAudio(new Audio(music), 0.5);

  game.init(() => {
    const time = Date.now();

    // Calculate timeline progression
    data.t = (time - data.startTime) / data.looptime;
    if (data.t >= 0.8) return game.stop();

    // Set game position to progression point on timeline
    const progress = data.track.parameters.path.getLength() * data.t;
    data.position.z = 20 + -progress * data.speed;

    // Update game position from VR controllers
    const session = game.renderer.xr.getSession();
    if (session) {
      const speed = data.speed * 0.2;

      session.inputSources?.forEach(source => {
        if (!source.gamepad) return;

        const [horizontal = 0, vertical = 0] = source.gamepad.axes.slice(2);

        data.position.x += speed * horizontal;
        data.position.y -= speed * vertical;
      });
    }

    // Update camera rig
    game.rig.position.copy(data.position);

    // Test for hits
    const rocks = data.rocks.filter(actions.test);
    data.hits = rocks.length;

    // Handle hits
    if (
      data.hits &&
      data.lasers.length &&
      time - data.lasers[data.lasers.length - 1] < 100
    ) {
      // Create explosions
      const updates = rocks.map(data => ({ time: Date.now(), ...data }));
      data.explosions = [...data.explosions, ...updates];

      // Cleanup explosions
      clearTimeout(data.cancelExplosionTO);
      data.cancelExplosionTO = setTimeout(() => {
        data.explosions = data.explosions.filter(({ time }) => Date.now() - time <= 1000);
      }, 1000);

      // Score player, cleanup rocks
      data.points = data.points + rocks.length * 100 + rocks.length * 200;
      data.rocks = data.rocks.filter(
        rock => !rocks.find(({ guid }) => guid === rock.guid)
      );
    }

    // Handle player collisions
    if (rocks.some(data => data.distance < 15)) data.health -= 1;
  });
};

export default game;
