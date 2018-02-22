var express = require('express');
var router = express.Router();

router.get('/', function(request, response, next) {
    //response.send('Index page');
  response.render('index.html');
});

module.exports = router;
