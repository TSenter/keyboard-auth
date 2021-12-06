import { handleKeyDown, handleKeyUp } from './key-events.js';
import { handleWordEnd } from './word-events.js';

let session;

function beginSession() {
  if (session) {
    return;
  }
  session = {};
  session.allKeyEvents = [];
  session.currentKeyEvents = [];
  session.wordEvents = [];
  session.promptEvents = [];

  session.activeKeys = {};
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

    const lastKeyEvent = handleKeyUp(session, evt);

    if (lastKeyEvent.key == ' ') {
      createWordEvent();
    }
  });
  
  function createWordEvent() {
    const currentKeyEvents = JSON.parse(JSON.stringify(session.currentKeyEvents));
    session.allKeyEvents.push(...currentKeyEvents);

    if (currentKeyEvents[currentKeyEvents.length - 1].key == ' ') {
      session.currentKeyEvents.pop();
    }

    handleWordEnd(session);
    session.currentKeyEvents = [];  
  }

  logButton.addEventListener('click', () => {
    // TODO Submit data

    if (session.currentKeyEvents.length) {
      createWordEvent();
    }
    console.clear();
    console.log('Key Events');
    for (const event of session.allKeyEvents) {
      console.log(event);
    }
    console.log('Word Events');
    for (const event of session.wordEvents) {
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