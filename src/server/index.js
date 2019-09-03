const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const controllers = require('./controllers/index.js');

let app = express();

app.set('port', (process.env.PORT || 4000));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '5mb'
}));
app.use(bodyParser.json());
app.use(bodyParser.raw({
      limit: '5mb',
      inflate: true,
      parameterLimit: 100000
}))
app.use(express.static(path.join(__dirname, '..', '..', 'build')));
app.listen(app.get('port'), function () {
    console.log('App is running on port', app.get('port'));
});

const extendTimeoutMiddleware = (req, res, next) => {
  const space = ' ';
  let isFinished = false;
  let isDataSent = false;

  // Only extend the timeout for API requests
  if (!req.url.includes('/upload')) {
    next();
    return;
  }

  res.once('finish', () => {
    isFinished = true;
  });

  res.once('end', () => {
    isFinished = true;
  });

  res.once('close', () => {
    isFinished = true;
  });

  res.on('data', (data) => {
    // Look for something other than our blank space to indicate that real
    // data is now being sent back to the client.
    if (data !== space) {
      isDataSent = true;
    }
  });

  const waitAndSend = () => {
    setTimeout(() => {
      // If the response hasn't finished and hasn't sent any data back....
      if (!isFinished && !isDataSent) {
        // Need to write the status code/headers if they haven't been sent yet.
        if (!res.headersSent) {
          res.writeHead(202);
        }

        res.write(space);

        // Wait another 15 seconds
        waitAndSend();
      }
    }, 15000);
  };

  waitAndSend();
  next();
};

app.use(extendTimeoutMiddleware);

app.use('/', controllers);
