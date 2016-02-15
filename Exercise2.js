var express = require('express');
var app = express();

app.get('/hello/:firstName', function(request, response) {
    var name = request.params.firstName;
    var result = firstName(name);
    response.send("Hello " + result + "!");
});

app.listen(process.env.PORT);

function firstName(input){
    return input;
};