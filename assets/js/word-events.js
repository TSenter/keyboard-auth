export function handleWordEnd(session) {
  const keyEvents = session.currentKeyEvents;
  const { finalString, keySequence } = getStringAndSequence(keyEvents);
  const eventTimings = getEventTimings(keyEvents);
  const numMistakes = keyEvents.filter(keyEvent => keyEvent.keyCode == 'Backspace').length;

  const keyTimings = getKeyTimings(keyEvents);

  const wordEvent = {
    keySequence,
    finalString,
    numMistakes,
    eventTimings,
    keyTimings,
  };

  session.wordEvents.push(wordEvent);

  return wordEvent;
}

function getStringAndSequence(keyEvents) {
  const keySequence = [];
  const finalString = [];

  for (const keyEvent of keyEvents) {
    const { key } = keyEvent;

    keySequence.push(key);
    if (key == 'Backspace') {
      finalString.pop();
      continue;
    } else if (key.length > 1) {
      continue;
    }
    finalString.push(key);
  }

  return {
    finalString: finalString.join(''),
    keySequence,
  };
}

function getEventTimings(keyEvents) {
  const wordStart = keyEvents[0].timing.start;
  const wordEnd = keyEvents[keyEvents.length - 1].timing.stop;
  const duration = wordEnd - wordStart;

  const downtimes = [];

  for (let i = 1; i < keyEvents.length; i++) {
    const lastEventStop = keyEvents[i - 1].timing.stop;
    const nextEventStart = keyEvents[i].timing.start;

    downtimes.push(nextEventStart - lastEventStop);
  }

  const totalDowntime = downtimes.reduce(
    (total, current) => total + current,
    0
  );

  return {
    wordStart,
    wordEnd,
    duration,
    downtimes,
    totalDowntime,
  };
}

function getKeyTimings(keyEvents) {
  const keyDurations = getKeyDurations(keyEvents);
  const timings = {};

  for (const keyCode in keyDurations) {
    const durations = keyDurations[keyCode];

    const totalDuration = durations.reduce(
      (total, current) => total + current,
      0
    );
    const numKeyPresses = durations.length;
    const averageDuration = totalDuration / numKeyPresses;

    timings[keyCode] = {
      averageDuration,
      totalDuration,
      numKeyPresses,
    };
  }

  return timings;
}

function getKeyDurations(keyEvents) {
  const keyPressDurations = {};

  for (const evt of keyEvents) {
    if (!keyPressDurations[evt.keyCode]) {
      keyPressDurations[evt.keyCode] = [];
    }

    keyPressDurations[evt.keyCode].push(evt.timing.duration);
  }

  return keyPressDurations;
}