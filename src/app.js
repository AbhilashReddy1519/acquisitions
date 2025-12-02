// This file is all about setting up the express application logic with right middlewares 

import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello, World! from acquisitions application');
});

export default app;

