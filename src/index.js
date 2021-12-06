import process from 'process';
import express from 'express';
import { recordTrainingData } from './training.js';
import classify from './classify.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.get('/', (req, res) => {
  console.log(`GET: ${req.url}`);

  res.sendFile(`${process.cwd()}/assets/index.html`);
});

app.get('/api/prompt', async (req, res) => {
  const datasets = [
    'pangram-lower-case',
    'pangram-sentence-case',
    'pangram-title-case',
    'pangram-upper-case',
    'random-lower-case',
    'random-sentence-case',
    'random-title-case',
    'random-upper-case',
  ];

  const randomSet = Math.floor(Math.random() * datasets.length);
  const _import = await import(`./data/sentences/${datasets[randomSet]}.js`);

  const dataset = _import.default;
  const randomPrompt = Math.floor(Math.random() * dataset.length);

  res.send(dataset[randomPrompt]);
})

app.post('/api/key-metrics', (req, res) => {
  const session = req.body;

  recordTrainingData(session);

  res.status(202).send();
});

app.post('/api/classify', (req, res) => {
  const session = req.body;

  const classification = classify(session);

  res.send(classification);
});

app.use(express.static(`${process.cwd()}/assets`));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});