var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var contacts = require('./routes/contacts');

var app = express();

// views
app.engine('html', require('ejs').renderFile);

app.use('/static', express.static(path.join(__dirname, 'reactclient')))
app.use('/static', express.static(path.join(__dirname, 'static')))

// body-parser middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/', index);
app.use('/api', contacts);

app.listen(8080, function() {
  console.log('Server started....');
});
