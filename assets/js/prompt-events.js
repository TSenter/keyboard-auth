export function handlePrompt(session) {
  const keySequence = getKeySequence(session);
  const numMistakes = getNumMistakes(session);
  const timing = getTiming(session);
  const wpm = getWpm(session, timing);

  return {
    keySequence,
    meta: {
      numMistakes,
    },
    timing,
    wpm,
  };
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