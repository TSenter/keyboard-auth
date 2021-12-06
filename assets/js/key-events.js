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
  const previousKeyDownEvent = session.activeKeyEvents[keyCode];

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

  session.activeKeyEvents[keyCode] = keyEvent;
}

export function handleKeyUp(session, evt) {
  const keyCode = evt.code;
  const keyPressStop = Date.now();

  const keyDownEvent = session.activeKeyEvents[keyCode];
  if (!keyDownEvent) {
    // Somehow the "keyup" event fired before a matching "keydown" event was fired
    return;
  }

  keyDownEvent['timing']['stop'] = keyPressStop;
  keyDownEvent['timing']['duration'] = keyPressStop - keyDownEvent.timing.start;
  keyDownEvent['keyCode'] = keyCode;

  session.keyEvents.push(keyDownEvent);

  delete session.activeKeyEvents[keyCode];
}