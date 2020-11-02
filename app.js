import KEYBOARD from './src/keyboard.js';
import State from './src/state.js'

import Caret from './src/components/caret.js';
import Write from './src/components/write.js';
import Keys from './src/components/keys.js';
import Speech from './src/components/speech.js';
import Sound from './src/components/sound.js';

// DOM elements

const app = document.querySelector('.app');
const output = app.querySelector('.output');
const input = app.querySelector('.input');

const hideKey = input.querySelector('[data-action="hide"]');
const enterKey = input.querySelector('[data-code="Enter"]');

const queryPattern = '[data-code^="Shift"]';
const shiftKeys = input.querySelectorAll(queryPattern);

const capsLockKey = input.querySelector('[data-code="CapsLock"]');
const backspaceKey = input.querySelector('[data-code="Backspace"]');
const changeLangKey = input.querySelector('[data-action="lang"]');
const arrowLeftKey = input.querySelector('[data-code="ArrowLeft"]');
const arrowRightKey = input.querySelector('[data-code="ArrowRight"]');
const speechKey = input.querySelector('[data-action="speech"]');
const audioContainer = app.querySelector('.audio');
const soundKey = input.querySelector('[data-action="sound"]');

// instances

const caret = new Caret(output, 0);
const write = new Write(output, caret);
const keys = new Keys(KEYBOARD);
const speech = new Speech();
const sound = new Sound(audioContainer);
speech.onResult = transcript => write.text(transcript);

// init

keys.render();

// hide

hideKey.addEventListener('click', () => {
  input.classList.remove('show');
  output.blur();
});

// show

output.addEventListener('focus', () => {
  input.classList.add('show');
});

// type

output.addEventListener('click', () => {
  caret.position = output.selectionEnd;
});

input.addEventListener('click', evt => {
  const code = evt.target.dataset.code;
  if (!code) return;
  const options = KEYBOARD[code];
  if (!options || !options.isChar) return;

  write.symbol(options);

  if (!State.shiftIsPress) {
    State.shiftMode = false;
    setShiftKeysState();
  }

  sound.play();
});

let pressedKey = [];

document.addEventListener('keydown', evt => {
  const options = KEYBOARD[evt.code];

  if (options && options.DOMElement) {
    options.DOMElement.classList.add('press');
    pressedKey.push(options.DOMElement);
  }
});

document.addEventListener('keyup', () => {
  if (pressedKey) {
    pressedKey.forEach(key => key.classList.remove('press'));
    pressedKey.length = 0;
  }
});

// caps lock

const setCapsLockState = () => {
  if (State.capsLockMode) {
    capsLockKey.classList.add('active');
  } else {
    capsLockKey.classList.remove('active');
  }

  keys.render();
};

capsLockKey.addEventListener('click', () => {
  State.capsLockMode = !State.capsLockMode;
  setCapsLockState();
  caret.show();
  sound.play('CapsLock');
});

document.addEventListener('keydown', evt => {
  if (evt.code === 'CapsLock') {
    State.capsLockMode = evt.getModifierState('CapsLock');
    setCapsLockState();
  }

});

document.addEventListener('keyup', evt => {
  if (evt.code === 'CapsLock') {
    State.capsLockMode = evt.getModifierState('CapsLock');
    setCapsLockState();
  }
});

// backspace

backspaceKey.addEventListener('click', () => {
  write.remove();
  sound.play('Backspace');
});

// tab

document.addEventListener('keydown', evt => {
  if (evt.code === 'Tab') {
    evt.preventDefault();
    write.symbol(KEYBOARD[evt.code]);
  }
});

// shift

const setShiftKeysState = () => {
  shiftKeys.forEach(key => {
    if (State.shiftMode) {
      key.classList.add('active');
      input.classList.add('shift-mode');
    } else {
      key.classList.remove('active');
      input.classList.remove('shift-mode');
    }
  });

  keys.render();
};

document.addEventListener('click', evt => {
  const shiftKey = evt.target.closest(queryPattern);

  if (!shiftKey) return;
  State.shiftMode = !State.shiftMode;
  setShiftKeysState();

  sound.play('Shift');
});

document.addEventListener('keydown', evt => {
  if (evt.code === 'ShiftLeft' || evt.code === 'ShiftRight') {
    State.shiftMode = true;
    State.shiftIsPress = true;
    setShiftKeysState();
  }
});

document.addEventListener('keyup', evt => {
  if (evt.code === 'ShiftLeft' || evt.code === 'ShiftRight') {
    State.shiftMode = false;
    State.shiftIsPress = false;
    setShiftKeysState();
  }
});

// enter

enterKey.addEventListener('click', evt => {
  evt.preventDefault();
  sound.play('Enter');
});

// change language

changeLangKey.addEventListener('click', evt => {
  evt.preventDefault();

  State.lang =
    (State.lang === 'en') ? 'ru' : 'en';
  changeLangKey.textContent = State.lang;

  keys.render();
  speech.switchLang();
});

// arrows

arrowLeftKey.addEventListener('click', evt => {
  evt.preventDefault();

  caret.position = Math.max(caret.position - 1, 0);
  caret.show();
});

arrowRightKey.addEventListener('click', evt => {
  evt.preventDefault();

  caret.position = Math.min(caret.position + 1, output.value.length);
  caret.show();
});

document.addEventListener('keydown', evt => {
  if (evt.code === 'ArrowLeft') {
    caret.position = output.selectionStart - 1;
  }

  if (evt.code === 'ArrowRight') {
    caret.position = output.selectionStart + 1;
  }
});

// speech

speechKey.addEventListener('click', evt => {
  evt.preventDefault();
  caret.show();

  State.recognitionMode = !State.recognitionMode;

  if (State.recognitionMode) {
    speechKey.classList.add('active');
    speech.start();
  } else {
    speechKey.classList.remove('active');
    speech.abort();
  }
});

// play sound

soundKey.addEventListener('click', evt => {
  evt.preventDefault();
  caret.show();

  State.soundMode = !State.soundMode;

  if (State.soundMode) {
    soundKey.classList.add('active');
  } else {
    soundKey.classList.remove('active');
  }
});
