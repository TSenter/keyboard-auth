import { handleKeyDown, handleKeyUp } from './key-events.js';

let session;

function beginSession() {
  if (session) {
    return;
  }
  session = {};
  session.keyEvents = [];
  session.wordEvents = [];
  session.sentenceEvents = [];
  session.stats = {};

  session.activeKeyEvents = {};
}

export function setup() {
  beginSession();

  const inputElement = document.querySelector('#tester');
  const logButton = document.querySelector('#log');
  const resetButton = document.querySelector('#reset');

  inputElement.addEventListener('keydown', evt => {
    evt.stopPropagation();

    handleKeyDown(session, evt);
  });

  inputElement.addEventListener('keyup', evt => {
    evt.stopPropagation();

    handleKeyUp(session, evt);
  })

  logButton.addEventListener('click', () => {
    console.clear();
    for (let event of session.keyEvents) {
      console.log(event);
    }
  });

  resetButton.addEventListener('click', () => {
    session = undefined;
    beginSession();
    console.clear();
    console.log('Session reset');
    inputElement.value = '';
  });
}

export default {
  beginSession,
  session,
};