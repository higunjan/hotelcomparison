var express = require('express'),
    bodyParser = require("body-parser"),
	routes = require('./routes/db.js'),
	index = require('./routes/index.js'),
    http = require('http');

var app = express();

app.set('port', process.env.PORT || 5555);
app.use(bodyParser.urlencoded({
    extended: true
})); 
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));


var server = http.createServer(app);

server.listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
});


app.get('/hotelcomp', index.saveApi);
app.post('/hotelcomp', index.saveApi);

app.get('/login', index.login);
app.post('/login', index.login);