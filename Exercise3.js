var express = require('express');
var app = express();

app.get('/op/:operation/:number1/:number2', function(request, response) {
    function operations(string, num1, num2){
        var n1 = Number(num1);
        var n2 = Number(num2);
        console.log(n1, n2);
    if (string === "add"){
        //response.sendStatus(200);
        return (n1 + n2);
    }
    else if (string === "sub"){
        //response.sendStatus(200);
        return (n1 - n2);
    }
    else if (string === "div"){
        //response.sendStatus(200);
        return (n1/n2);
    }
    else if (string === "mult"){
        //response.sendStatus(200);
        return (n1 * n2);
    }
    else {
        response.status(404).send("Sorry! That doesn't work!");
    }
}
    var ops = request.params.operation;
    var num1 = request.params.number1;
    var num2 = request.params.number2;
    var result = (operations(ops, num1, num2));
    response.json({operator: ops, firstOperand: num1, secondOperand: num2, solution: result});
});

app.listen(process.env.PORT);