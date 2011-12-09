
/**
 * Module dependencies.
 */

var express = require('express'),
    request = require('request'),
    http = require('http'),
    qs = require('querystring'),
    colors = require('colors'),
    _ = require('underscore'),
    cradle = require('cradle'),
    db = new(cradle.Connection)().database('webglydrs'),
    routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'tbh^#$@$#!@&*^^%$5s04v3905tp97gs9h3p5b76gg2(!$@#^' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/../client/'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var io = require('socket.io').listen(app);

io.configure(function(){
  io.set('log level', 1);
});

io.sockets.on('connection', function (socket) {
  socket.on('kinectPos',function(data){
    io.sockets.emit('updateMove', data);
  });
  socket.on('kinectReady',function(data){
    io.sockets.emit('kinectUser',data);
  });
  socket.on('highscore',function(data){
    db.exists(function (err, exists) {
      if (err) {
        console.log('error', err);
        io.sockets.emit('sucesshighscore',{ isHighscore :'error', player : ''});
      } else if (exists) {
        db.get(data.vidID,function(err,doc){
          if(err){
            db.save(data.vidID,data,function(err,res){
              if(res.ok == true){
                io.sockets.emit('sucesshighscore',{ isHighscore : 'true', player : data.player });
              }
            });
          }else{
            if(doc.score <= data.score){
              io.sockets.emit('sucesshighscore',{ isHighscore :'notHighscore', player : data.player});
            }else{
              var newDoc = {
                _id : doc._id,
                player : data.player,
                score : data.score,
                vidID : doc.vidID
              };
              db.merge(data.vidID, newDoc, function (err, res) {
                if(res.ok == true){
                  io.sockets.emit('sucesshighscore', { isHighscore : 'true', player : data.player });
                }else{
                  console.log('error',err);
                  io.sockets.emit('sucesshighscore',{ isHighscore :'error', player : ''});
                }
              });
            }
          }
        });
      }else{
        db.create();
        db.save(data.vidID,data,function(err,res){
          if(res.ok == true){
            io.sockets.emit('sucesshighscore',{ isHighscore : 'true', player : data.player });
          }else{
            io.sockets.emit('sucesshighscore',{ isHighscore :'error', player : ''});
          }
        });
      }
    });
  });
});

// Routes


app.get('/video/:vid', function(req, res){
  var videoId = encodeURIComponent(req.params.vid),
      token = '',
      allowedChars = '-_abcdefghijklmnopqrstuvwxyz0123456789',
      parsed;

  if (videoId.length !== 11){
    console.log('Wrong video ID (must be 11 chars). Aborting.'.bold.red);
    return res.end();
  }

  for (var i = 0; i < videoId.length; ++i){
    if (allowedChars.indexOf(videoId.charAt(i).toLowerCase()) === -1){
      console.log('"'.bold.red + videoId.bold.red + '" is not a valid YouTube video ID. Aborting.'.bold.red);
      return res.end();
    }
  }

  console.log('Requesting video ID'.bold.green, videoId.bold.green);
  request.get('http://youtube.com/get_video_info?&video_id=' + videoId + '&el=detailpage&ps=default&eurl=&gl=US&hl=en', function (error, response, body) {
    parsed = qs.parse(body);

    var videos = decodeURIComponent(parsed.url_encoded_fmt_stream_map).split(','),
        videosLength,
        video = videos[0];

    videos = _.filter(videos, function(item){
      return item.indexOf('url=') === 0;
    });

    console.log('Found streams:'.bold.grey, videos.length.toString().grey);
    console.log('Streams:'.bold.grey, JSON.stringify(videos, null, '\t').grey);
    video = video.slice(4);
    video = video.slice(0, video.indexOf('&quality'));

    console.log('Requesting stream'.bold.grey, video.grey);

/*    try {
      request.get(video).pipe(res);
    } catch(e) {
      console.log('eeeeeeeee', e);
    }*/

    try {
      var host = /^http\:\/\/(.+)\//.exec(video),
          path = video.slice(host[0].length - 1);
    } catch(e){
      console.log('errrrrrrrrrrrrr', e);
      return;
    }

    var options = {
      'host': host[1],
      'port': 80,
      'path': path,
      'method': 'GET'
    };

    var v_request = http.request(options, function(resp){
      //res.headers = resp.headers;
      _.each(resp.headers, function(value, key){
        res.setHeader(key, value);
      });

      res.connection.on('error', function(err){
        console.log('error:', err);
      });

      res.connection.on('close', function(err){
        console.log('CLIENT ABORTED');
        resp.connection.destroy();
        //res.connection.end();
        return;
      });

      res.connection.on('end', function(err){
        console.log('END');
        resp.connection.destroy();
        //res.connection.end();
        return;
      });

      /*resp.connection.on('data', function(chunk){
        res.write(chunk);
      });*/
      return resp.pipe(res);

    });

    v_request.end();

  });
});


app.get('/restart', function(req, res){
  process.exit(8);
});


app.listen(80,'0.0.0.0');
