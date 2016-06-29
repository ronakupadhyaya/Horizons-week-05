var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send("I'm running express. This feels familiar");
});

app.listen(process.env.PORT || 3000); // process.env.PORT is necessary for Heroku