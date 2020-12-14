/**
 * Plays a loopable audio instance
 */
function playAudio(audio, volume = 1, loop = false) {
  audio.currentTime = 0;
  audio.volume = volume;
  audio.loop = loop;
  audio.play();
}

export default playAudio;
