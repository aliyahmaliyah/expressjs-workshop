var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Sequelize = require('sequelize')

var db = new Sequelize('reddit', 'aliyahmaliyah', '', {
    dialect: 'mysql'
});

var User = db.define('user', {
    username: Sequelize.STRING,
    password: Sequelize.STRING // TODO: make the passwords more secure!
});

var Content = db.define('content', {
    url: Sequelize.STRING,
    title: Sequelize.STRING
});

var Vote = db.define('vote', {
    upVote: Sequelize.BOOLEAN
});

Content.belongsTo(User); // This will add a `setUser` function on content objects
User.hasMany(Content); // This will add an `addContent` function on user objects

User.belongsToMany(Content, {
    through: Vote,
    as: 'Upvotes'
}); // This will add an `add`
Content.belongsToMany(User, {
    through: Vote
});

app.get('/createContent/', function (request, response) {
    var options = {
        root: __dirname,
    }
    response.sendFile('form.html', options);
    
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.post('/createContent', function(request,response){
    var url = request.body.url;
    var title = request.body.title;
    Content.create({title: title, url: url});
   // console.log("URL is" + url + "Title is " + title);
   response.send("Ok");
});

app.listen(process.env.PORT);