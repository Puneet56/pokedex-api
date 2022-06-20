const tf = require('@tensorflow/tfjs-node');
const express = require('express');


async function runServer() {
  const app = express();

  app.use(express.json());

  app.get('*', (req, res) => {
    
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

runServer();