const express = require('express');
const app = express();

const dogsRouter = require('./routes/dogs');

app.use('/dogs', dogsRouter);

app.use(express.json());

app.use('/static', express.static('assets'));

const logger = (req, res, next) => {
  console.log({ method: req.method, URL: req.url });
  res.on('finish', () => console.log(res.statusCode));
  next();
}

app.use(logger);

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res, next) => {
  let e = new Error("Hello World!");
  next(e);
});

app.get('/*', (req, res, next) => {
  let e = new Error(`The requested resource couldn't be found`);
  e.statusCode = 404;
  next(e);
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  res.send(`Error: ${err.message}`);
});

const port = 5001;
app.listen(port, () => console.log('Server is listening on port', port));
