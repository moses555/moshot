import { gsap, Power4 } from 'gsap';
import game from 'game';
import Moon from 'objects/Moon';
import Stars from 'objects/Stars';
import Planets from 'objects/Planets';
import Player from 'objects/Player';
import Particles from 'objects/Particles';
import Rocks from 'objects/Rocks';
import Explosions from 'objects/Explosions';
import manager from 'utils/manager';
import 'table';
import './index.css';

game.add(new Moon());
game.add(new Stars());
game.add(new Planets());
game.add(new Player());
game.add(new Particles());
game.add(new Rocks());
game.add(new Explosions());

const init = () => {
  game.renderer.xr.addEventListener('sessionstart', game.start);
  game.renderer.xr.addEventListener('sessionend', game.pause);

  gsap.to(game.camera.rotation, {
    duration: 1,
    ease: Power4.easeIn,
    y: 0,
    onComplete: game.start,
  });
};

const onClick = event => {
  event.preventDefault();
  event.stopPropagation();

  game.dom.removeEventListener('click', onClick);

  init();
};

const onSelect = () => {
  game.controllers.controller1.removeEventListener('selectstart', onSelect);
  game.controllers.controller2.removeEventListener('selectstart', onSelect);

  init();
};

manager.onLoad = () => {
  game.dom.addEventListener('click', onClick);
  game.controllers.controller1.addEventListener('selectstart', onSelect);
  game.controllers.controller2.addEventListener('selectstart', onSelect);

  game.camera.rotation.y = Math.PI;

  let initGame = false;

  game.init(() => {
    const session = game.renderer.xr.getSession();

    if (session && !initGame) {
      initGame = true;

      init();
    }
  });
};
