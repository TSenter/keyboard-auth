function mapKeyEvent(evt) {
  const keyEvent = {
    keypress: {},
  };

  keyEvent.keypress['alt'] = evt.altKey;
  keyEvent.keypress['ctrl'] = evt.ctrlKey;
  keyEvent.keypress['meta'] = evt.metaKey;
  keyEvent.keypress['shift'] = evt.shiftKey;
  keyEvent.keypress['repetitions'] = 0;

  return keyEvent;
}

export function handleKeyDown(session, evt) {
  const keyCode = evt.code;
  const previousKeyDownEvent = session.activeKeys[keyCode];

  if (previousKeyDownEvent) {
    // There is already an active event for this keycode

    if (evt.repeat) {
      previousKeyDownEvent['keypress'].repetitions++;
    }
    return;
  }

  const keyEvent = {
    timing: {
      start: Date.now(),
    },
    ...mapKeyEvent(evt),
  };

  session.activeKeys[keyCode] = keyEvent;
}

export function handleKeyUp(session, evt) {
  const keyCode = evt.code;
  const keyPressStop = Date.now();

  const keyDownEvent = session.activeKeys[keyCode];
  if (!keyDownEvent) {
    // Somehow the "keyup" event fired before a matching "keydown" event was fired
    return;
  }

  keyDownEvent['timing']['stop'] = keyPressStop;
  keyDownEvent['timing']['duration'] = keyPressStop - keyDownEvent.timing.start;
  keyDownEvent['keyCode'] = keyCode;
  keyDownEvent['key'] = evt.key;

  session.currentKeyEvents.push(keyDownEvent);

  delete session.activeKeys[keyCode];

  return keyDownEvent;
}