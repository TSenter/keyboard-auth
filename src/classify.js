import KNN from 'ml-knn';
import fs from 'fs';
import process from 'process';

export default function(session) {
  const csvFilePath = `${process.cwd()}/src/data/model.csv`;
  const data = fs.readFileSync(csvFilePath).toString().split("\n").slice(1).map(l => l.trim()).map(l => l.split(",").slice(0, -1).map(parseFloat));
  const labels = fs.readFileSync(csvFilePath).toString().split("\n").slice(1).map(l => l.trim()).map(l => l.split(",").slice(-1));
  const labels1d = [].concat(...labels);

  const knn = new KNN(data, labels1d, { k: 1 });

  const input = [mapData(session)];

  console.log(data);
  console.log(input);

  var ans = knn.predict(input);
  console.log("Classification result:");
  console.log(ans);

  return ans;
}

function generateAlphaMapping() {
  const charCode = 65; // Capital 'A'
  const mapping = {};

  for (let i = 0; i < 26; i++) {
    mapping['Key' + String.fromCharCode(charCode + i)] = [];
  }

  return mapping;
}

export function mapData(session) {
  const features = [];

  const promptEvent = session.promptEvents[0];

  features.push(promptEvent.wpm); // typing speed, in words per minute
  features.push(promptEvent.meta.averageKeypressDuration);

  // Average keypress length for keys A-Z
  const alphaMapping = generateAlphaMapping();

  session.allKeyEvents.forEach(keyEvent => {
    if (!alphaMapping[keyEvent.keyCode]) {
      return;
    }

    alphaMapping[keyEvent.keyCode].push(keyEvent.timing.duration);
  });

  for (const keyCode in alphaMapping) {
    const numKeyPresses = alphaMapping[keyCode].length
    const totalDuration = alphaMapping[keyCode].reduce(
      (total, nextDuration) => total + nextDuration,
      0
    );
    features.push(totalDuration / (numKeyPresses || 1));
  }

  // Number of mistakes (backspaces)
  features.push(promptEvent.meta.numMistakes);

  // Average downtime per word
  const numWords = session.wordEvents.length;
  const totalDowntime = session.wordEvents.reduce(
    (total, wordEvent) => total + wordEvent.eventTimings.totalDowntime,
    0
  );
  features.push(totalDowntime / numWords);
  
  // User ID
  // features.push(session.userId);

  return features;
}