var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Sequelize = require('sequelize')
var mysql = require('mysql')

//this sets up my tables
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

//This takes the most recent 5 posts and adds them to my 'hompage'
function getFive(cb){
Content.findAll({
    order: [
        ['createdAt', 'DESC']
        ],
        limit: 5,
        include: User
    
}).then(function(results) {
        cb(results)
    });
}

getFive(function(results){
    return results;
})


function buildHTMLlist(array){
    var html = `<div id="contents">
      <h1>List of contents</h1>
      <ul class="contents-list">`
    array.forEach(function(item) {
        html += `<li class="content-item">
         <h2 class="content-item__title">
         <a href=` + item.url +`>` + item.title + `</a>
          </h2>
          <p>` + item.user.username + `</p>
        </li>`
    })
    html+= `</ul> 
        </div>`
    return html;
}

app.get('/contents', function(request, response) {
    getFive(function(contents) {
        var html = buildHTMLlist(contents);
        response.send(html);
    });
}); 

//this shows a form and allows ppl to submit a url and a title which is then added to the table
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
    Content.create({title: title, url: url, userId: 1});
   // console.log("URL is" + url + "Title is " + title);
   //response.send('Ok')
   response.redirect('/contents');
});

app.listen(process.env.PORT);