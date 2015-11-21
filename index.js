var express = require('express');
var bodyParser= require('body-parser');
var app = express();
var cool = require('cool-ascii-faces');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Post = require('./post');
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
//  var result = '';
//  var times = process.env.TIMES || 5;
//  for (var i=0; i < times; i++)
//    result += cool();
//  response.send(result);

  response.render('pages/index');
});

app.get('/cool', function(request,response){
  response.send(cool());
});

app.get('/new', function(request,respose){
   respose.render('pages/new',{}); 
});
app.get('/chatroom', function(request,respose){
   respose.render('pages/chatroom',{}); 
});
app.post('/create', function(request,response){
   // response.redirect('/posts');
   var post = new Post({
      
       title: request.body.title,
       content: request.body.content
   }); 
    
    //save the model
    post.save(function(err,model){
       if(err){
           response.send(500,'There is somthing worng while saving!');
       }
        else{
            response.redirect('/posts');
       } 
    });
    
});
app.get('/posts', function(request, response) {
    Post.find(function(err, posts) {
        if (err) {
            response.send(500, 'There was an error - tough luck.');
        }
        else {
            response.render('pages/posts', {
               posts:posts
            });
        }
    });
});

//Configure Socket IO
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
   io.emit('chat message', msg);
  });
    socket.on('typing', function(msg){
       socket.broadcast.emit('typing',msg);
    });
    socket.on('donetyping', function(){
       socket.broadcast.emit('donetyping');
    });
});

//Configure port to listen on
http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


