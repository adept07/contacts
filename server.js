var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var contacts = require('./routes/contacts');

var app = express();

var port = process.env.PORT || 8080;

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

app.listen(port, function() {
  console.log(`Server started.... on port ${port}`);
});
