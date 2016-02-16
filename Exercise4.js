var Sequelize = require('sequelize');
var mysql = require('mysql')
var express = require('express')
var app = express();

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

//db.sync(); 

function createNewUser(username, password, cb) {
    User.create({
        username: username,
        password: password
    }).then(function(user) {
        cb(user);
    });

}
//createNewUser('anonymous','blahbah', function(promisedUser) {
//  return promisedUser; 
//});

function createNewContent(userID, url, title, cb) {
    User.findById(userID).then(function(user) {
        user.createContent({
            url: url,
            title: title
        }).then(function(content) {
            cb(content)
        })
    });
}
// createNewContent(1,'http://google.ca', 'I heart canadian google', function(content){
//     console.log(content);
// })
// createNewContent(1,'http://facebook.com', 'stalk your friends here', function(content){
//     console.log(content);
// })
// createNewContent(1,'http://twitter.com', 'spew hateful garbage here', function(content){
//     console.log(content);
// })
// createNewContent(1,'http://pinterest.com', "a housewife's dream", function(content){
//     console.log(content);
// })
// createNewContent(1,'http://snapchat.com', "made for sexting but remember once it's on the internet, it's there forever", function(content){
//     console.log(content);
// })
// createNewContent(1,'http://flickr.com', 'steal photos here', function(content){
//     console.log(content);
// })
// createNewContent(1,'http://instagram.com', 'aka hipstagram', function(content){
//     console.log(content);
// })
// createNewContent(1,'http://ello.com', 'wait...why does this exist?', function(content){
//     console.log(content);
// })



// findContent(function(results) {
//     console.log(JSON.stringify(results, 0, 4));
// })

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
        </li>
        </ul> 
        </div>`
    })
    return html;
}

app.get('/contents', function(request, response) {
    getFive(function(contents) {
        var html = buildHTMLlist(contents);
        response.send(html);
    });
}); 

app.listen(process.env.PORT);