export function handlePrompt(session) {
  const keySequence = getKeySequence(session);
  const numMistakes = getNumMistakes(session);
  const averageKeypressDuration = getAverageKeypressDuration(session);
  const timing = getTiming(session);
  const wpm = getWpm(session, timing);

  const promptEvent = {
    keySequence,
    meta: {
      numMistakes,
      averageKeypressDuration,
    },
    timing,
    wpm,
  };

  session.promptEvents.push(promptEvent);

  return promptEvent;
}

function getKeySequence(session) {
  return session.allKeyEvents.map(evt => evt.keyCode);
}

function getNumMistakes({ wordEvents }) {
  return wordEvents.reduce(
    (total, evt) => total + evt.numMistakes,
    0
  );
}

function getAverageKeypressDuration(session) {
  const keyEvents = session.allKeyEvents;

  const totalKeyPressDuration = keyEvents.reduce(
    (total, evt) => total + evt.timing.duration,
    0
  );

  return totalKeyPressDuration / keyEvents.length;
}

function getTiming({ wordEvents }) {
  const firstWordEvent = wordEvents[0];
  const lastWordEvent = wordEvents[wordEvents.length - 1];

  const promptStart = firstWordEvent.eventTimings.wordStart;
  const promptEnd = lastWordEvent.eventTimings.wordEnd;
  const duration = promptEnd - promptStart;

  return {
    promptStart,
    promptEnd,
    duration,
  };
}

function getWpm({ wordEvents }, timing) {
  const durationMillis = timing.duration;
  const numWords = wordEvents.length;

  const wordsPerMilli = numWords / durationMillis;

  return wordsPerMilli * 1000 * 60;
}