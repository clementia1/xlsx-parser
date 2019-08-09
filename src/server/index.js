const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const controllers = require('./controllers/index.js');

let app = express();

app.set('port', (process.env.PORT || 4000));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', '..', 'build')));
app.listen(app.get('port'), function () {
    console.log('App is running on port', app.get('port'));
});

// app.use('/', controllers);
