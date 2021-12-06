const process = require('process');
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  console.log(`GET: ${req.url}`);

  res.sendFile(`${process.cwd()}/assets/index.html`);
});

app.use(express.static(`${process.cwd()}/assets`));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});