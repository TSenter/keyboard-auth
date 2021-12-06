import { handleKeyDown, handleKeyUp } from './key-events.js';
import { handleWordEnd } from './word-events.js';
import { handlePrompt } from './prompt-events.js'

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

function sendTrainingData() {
  const xhttp = new XMLHttpRequest();

  const userId = document.querySelector('#user_id').value;

  session.userId = userId;

  xhttp.open('POST', '/api/key-metrics', true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify(session));
}

export function setup() {
  beginSession();
  loadPrompt();

  const inputElement = document.querySelector('#tester');
  const trainButton = document.querySelector('#train');
  const classifyButton = document.querySelector('#classify');
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

  function loadPrompt() {
    const xhttp = new XMLHttpRequest();

    xhttp.open('GET', '/api/prompt');
    xhttp.onload = () => {
      document.querySelector('#prompt').innerHTML = xhttp.responseText;
    }
    xhttp.send();
  }

  trainButton.addEventListener('click', () => {
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
    console.log('Prompt Event');
    console.log(handlePrompt(session));
    sendTrainingData();
  });

  classifyButton.addEventListener('click', () => {
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
    console.log('Prompt Event');
    console.log(handlePrompt(session));

    // TODO Send data to be classified
    const xhttp = new XMLHttpRequest();

    // const userId = document.querySelector('#user_id').value;

    xhttp.open('POST', '/api/classify', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(session));
  })

  resetButton.addEventListener('click', () => {
    session = undefined;
    beginSession();
    loadPrompt();
    console.clear();
    console.log('Session reset');
    inputElement.value = '';
  });
}

export default {
  beginSession,
  session,
};