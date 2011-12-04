
/**
 * Module dependencies.
 */

var express = require('express'),
    request = require('request'),
    qs = require('querystring'),
    colors = require('colors'),
    _ = require('underscore'),
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
  try{
    request.get('http://youtube.com/get_video_info?&video_id=' + videoId + '&el=detailpage&ps=default&eurl=&gl=US&hl=en', function (error, response, body) {
      console.log('Response'.orange);
      parsed = qs.parse(body);

      var videos = decodeURIComponent(parsed.url_encoded_fmt_stream_map).split(','),
          videosLength,
          video = videos[0];

      videos = _.filter(videos, function(item){
        return item.indexOf('url=') === 0;
      });

      console.log('Found streams:'.bold.grey, videos.length.toString().grey);

      video = video.slice(4);
      video = video.slice(0, video.indexOf('&quality'));

      console.log('Requesting stream'.bold.grey, video.grey);

      request.get(video).pipe(res);
      //req.pipe(request(video)).pipe(res);
    });
  }catch(e){
    console.log('Error requesting stream'.bold.red);
  }
});


app.listen(80,'0.0.0.0');
