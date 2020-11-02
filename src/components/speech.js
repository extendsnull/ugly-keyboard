import State from '../state.js';

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default class Speech {
  constructor() {
    this.init();
  }

  init() {
    this.instance = new SpeechRecognition();
    this.interimResults = false;
    this.switchLang();
    this.addListeners();
  }

  addListeners() {
    this.instance.addEventListener('result', evt => {
      const transcript = evt.results[0][0].transcript;
      this.onResult(transcript);
    });

    this.instance.addEventListener('end', () => {
      if (State.recognitionMode) {
        this.instance.start();
      }
    });
  }

  switchLang() {
    if (!this.instance) return;

    switch (State.lang) {
      case 'en':
      default:
        this.instance.lang = 'en-US';
        break;
      case 'ru':
        this.instance.lang = 'ru-RU';
        break;
    }

    this.instance.abort();
  }

  start() {
    this.instance.start();
  }

  abort() {
    this.instance.abort();
  }

  onResult() {}
}
