const process = require('process');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.get('/', (req, res) => {
  console.log(`GET: ${req.url}`);

  res.sendFile(`${process.cwd()}/assets/index.html`);
});

app.post('/api/key-metrics', (req, res) => {
  const reqData = req.body;

  res.status(202).send();
});

app.use(express.static(`${process.cwd()}/assets`));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});