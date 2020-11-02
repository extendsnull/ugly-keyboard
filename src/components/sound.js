import State from '../state.js';

export default class Sound {
  constructor(container) {
    this.container = container;
    this.soundBank = {};
  }

  play(key) {
    if (!State.soundMode) return;

    let audio;
    let filename;

    switch (key) {
      case 'Backspace':
      case 'CapsLock':
      case 'Enter':
      case 'Shift':
        filename = key.toLowerCase();

        if (!this.soundBank[filename]) {
          this.soundBank[filename] = this.container.querySelector(`[data-audio="${filename}"]`);
        }

        audio = this.soundBank[filename];
        break;
      default:
        filename = State.lang;

        if (!this.soundBank[filename]) {
          this.soundBank[filename] = this.container.querySelector(`[data-audio="${filename}"]`);
        }

        audio = this.soundBank[filename];
        break;
    }

    if (audio) {
      audio.play();
    }
  }
}
