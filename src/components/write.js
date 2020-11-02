import State from '../state.js';

export default class Write {
  constructor(output, caret) {
    this.output = output;
    this.caret = caret;
  }

  remove() {
    const { selectionStart, selectionEnd } = this.output;

    if (selectionStart === selectionEnd) {
      const before = this.output.value.slice(0, selectionStart - 1);
      const after = this.output.value.slice(selectionStart);
      this.output.value = before + after;
      this.caret.setPosition('decrement', 1);
    } else {
      const before = this.output.value.slice(0, selectionStart);
      const after = this.output.value.slice(selectionEnd);
      this.output.value = before + after;
      this.caret.position = selectionStart;
      this.caret.show(selectionStart);
    }
  }

  symbol(options) {
    const { selectionEnd, value } = this.output;

    this.caret.position = selectionEnd;
    let before = value.slice(0, this.caret.position);
    const after = value.slice(this.caret.position);

    const lang = options[State.lang] || options.en;

    if (State.capsLockMode && State.shiftMode && lang.shiftMode === 'alternate') {
      before += lang[lang.shiftMode];
    } else if (State.capsLockMode && State.shiftMode) {
      before += lang.lowerCase;
    } else if (State.capsLockMode) {
      before += lang.upperCase;
    } else if (State.shiftMode) {
      before += lang[lang.shiftMode];
    } else {
      before += lang.lowerCase;
    }

    this.output.value = before + after;
    this.caret.setPosition(options.caret, options.length);
  }

  text(text) {
    const { selectionEnd, value } = this.output;

    this.caret.position = selectionEnd;
    let before = value.slice(0, this.caret.position);
    const after = value.slice(this.caret.position);

    if (State.capsLockMode && State.shiftMode) {
      before += text.toLowerCase();
    } else if (State.capsLockMode) {
      before += text.toUpperCase();
    } else if (State.shiftMode) {
      before += text.toUpperCase();
    } else {
      before += text.toLowerCase();
    }

    this.output.value = before + after;

    this.caret.setPosition('increment', text.length);
  }
}
