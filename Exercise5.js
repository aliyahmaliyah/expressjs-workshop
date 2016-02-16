var express = require('express');
var app = express();

app.get('/createContent/', function (request, response) {
    var options = {
        root: __dirname,
    }
    response.sendFile('form.html', options);
    
});

app.listen(process.env.PORT);