var express = require('express');
var app = express();

app.get('/hello', function(request, response) {
    response.send("<h1>Hello World!</h1>");
});

app.listen(process.env.PORT);