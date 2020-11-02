import State from '../state.js';

export default class Keys {
  constructor(keyboard) {
    this.keys = Object.values(keyboard).filter(options => options.isChar && options.DOMElement);
  }

  render() {
    this.keys.forEach(options => {
      const { DOMElement } = options;
      const lang = options[State.lang] || options.en;

      if (options.hasIcon) return;

      if (State.capsLockMode && State.shiftMode && lang.shiftMode === 'alternate') {
        DOMElement.textContent = lang[lang.shiftMode];
      } else if (State.capsLockMode && State.shiftMode) {
        DOMElement.textContent = lang.lowerCase;
      } else if (State.capsLockMode) {
        DOMElement.textContent = lang.upperCase;
      } else if (State.shiftMode) {
        DOMElement.textContent = lang[lang.shiftMode];
      } else {
        DOMElement.textContent = lang.lowerCase;
      }

      if (lang.alternate) {
        DOMElement.dataset.alternate = lang.alternate;
      } else {
        delete DOMElement.dataset.alternate;
      }
    });
  }
}


