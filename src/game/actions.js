import gameData from 'game/data';
import touch from 'utils/touch';
import playAudio from 'utils/playAudio';
import shoot from 'assets/audio/shoot.mp3';

const actions = {
  updateMouse(event) {
    const { clientX: x, clientY: y } = touch ? event.touches[0] : event;

    gameData.mouse.set(x - window.innerWidth / 2, y - window.innerHeight / 2);
  },
  shoot() {
    gameData.lasers = [...gameData.lasers, Date.now()];

    clearTimeout(gameData.cancelLaserTO);

    gameData.cancelLaserTO = setTimeout(() => {
      gameData.lasers = gameData.lasers.filter(t => Date.now() - t <= 1000);
    }, 1000);

    playAudio(new Audio(shoot), 0.5);
  },
  test(data) {
    gameData.box.min.copy(data.offset);
    gameData.box.max.copy(data.offset);
    gameData.box.expandByScalar(data.size * data.scale);

    data.hit.set(10000, 10000, 10000);

    const result = gameData.ray.intersectBox(gameData.box, data.hit);
    data.distance = gameData.ray.origin.distanceTo(data.hit);

    return result;
  },
};

export default actions;
