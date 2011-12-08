var gl;
var highScores = [];
jQuery(document).ready(function(){
  gl = CubicVR.init();

  var video = document.getElementById('gameVideo');
  video.addEventListener("canplaythrough", function(){
    jQuery(video).data('canPlay',true);
  }, true);

});
var glydrs = function(){
  var $ = jQuery;
  var playerArray = [];
  var inputControls = {};
  var canvas = CubicVR.getCanvas();
  $(canvas).addClass('active');

  var tunnelRadius = 70;
  var tunnelLength = 30000;//Tuned for a 4 minute video
  var tunnelSides = 6;
  var coloredBlocks = false;
  var videoWalls = false;
  var distanceBetweenBlocks = 40;

  if(jQuery('#coloredBlock:checked').length > 0){
    coloredBlocks = true;
  }
  if(jQuery('#videoWalls:checked').length > 0){
    videoWalls = true;
  }
  
  $('#gameVideo').hide();
  if (!gl) {
    alert("Sorry, no WebGL support.");
    return;
  };

  var physics = new CubicVR.ScenePhysics();
  physics.setGravity([0,0,0]);
  var scene = new CubicVR.Scene(canvas.width, canvas.height, 80);
  scene.camera.setTargeted(true);
  scene.camera.setClip(.1,1000);

  // Add our camera to the window resize list
  CubicVR.addResizeable(scene);

  for(var i=0;i<gamepads.length;i++){
    highScores.push(0);
    var player = players.spawn(scene,physics,[0,0,10*playerArray.length],gamepads[i]);
    playerArray.push(player);
    $('body').append('<div class="playerScore player'+i+'" style="left:'+canvas.width/gamepads.length*i+'px">0</div>');
  }

  
  var video = document.getElementById('gameVideo');
  var videoTexture = new CubicVR.CanvasTexture(video);
  var gameStarted = false;
  video.addEventListener("ended", function(){
    videoPlaying = false;
    var myHighScores = [];
    for(var i=0;i<highScores.length;i++){
      myHighScores[i] = Math.round(highScores[i]/-10);
    }
    $('.playerScore').hide();
    gameEnd(myHighScores);
  }, false);
  var videoPlaying = false;
//  video.muted = true;
  tube.create(scene,physics,{
    tunnelRadius:tunnelRadius,
    tunnelLength:tunnelLength,
    tunnelSides:tunnelSides,
    videoTexture:videoTexture,
    videoWalls:videoWalls
  });

  var map = obstacles.generateMap(scene,physics,{
    tunnelRadius:tunnelRadius,
    tunnelLength:tunnelLength,
    videoTexture:videoTexture,
    coloredBlocks:coloredBlocks,
    distanceBetweenBlocks:distanceBetweenBlocks
  });

  //endgame func
  function gameEnd(scores){
      $('#endGame').toggle();
      var socket = socketIO.connect(window.location.host);
      var scoreTemplate = $('#scores-template').html();
      var compiledTemplate = Handlebars.compile(scoreTemplate);
      var scoreLen = scores.length;
      var scoreArr = [];
      var highScore = Math.max.apply(Math, scores);

      for(var i = 0; i < scoreLen; i++){
        var scoreObj = {};
        scoreObj['player'] = 'Player ' + [ i + 1 ];
        scoreObj['playerScore'] = scores[i];
        scoreObj['isHighScore'] = false;
        if(scores[i] == highScore){
          scoreObj['isHighScore'] = 'winner';
        }
        scoreArr.push(scoreObj);
      }
      var fullScoreObj = {scores : scoreArr};
      $('#scoreContainer').html(compiledTemplate(fullScoreObj));
      $('svg').live('click',function(){
        $('#submitScore').toggle();
      });
      $('#submit').live('click',function(e){
        e.preventDefault();
        var playerName = $('#username').val();
        var playerScore = $('#win span').text();
        var videoId = $('#videoID').val() || 'WeComeTogether';
        var finalScore = {
          player : playerName,
          score  : playerScore,
          vidID  : videoId
        };
        socket.emit('highscore', finalScore);
      });
      socket.on('sucesshighscore', function(data) {
        if(data == true){
          $('.endNotification').text('You have the highest score ever!!!!!');
        }else{
          $('.endNotification').text('You do not have the highest score out of everyone');
        }
      });
    };

  var lastChange = 0;
  // Start our main drawing loop, it provides a timer and the gl context as parameters
  CubicVR.MainLoop(function(timer, gl) {
    if (videoPlaying){
      videoTexture.update();
      physics.stepSimulation(timer.getLastUpdateSeconds());
      physics.triggerEvents();
      scene.runEvents(timer.getSeconds());

      var partOfSecond = Math.round(timer.getSeconds()*2);
      if(lastChange != partOfSecond && beat.isBeat()){
//        lastChange = partOfSecond;
        tube.changeColor();
      }
      for(var j=0;j<map.length;j++){
        map[  j ].getSceneObject().visible = false;
      }

      for(var i=0;i<playerArray.length;i++){
        var playerPos = playerArray[i].getSceneObject().position.slice(0);

        var fov = 70 - Math.floor(( playerArray[i].getLinearVelocity()[1]/30)*6);
        var startingPosition = Math.round((playerPos[1]*-1)/distanceBetweenBlocks);
        if(startingPosition > 10){
          startingPosition-=10;
        }else{
          startingPosition = 0;
        }
        for(var j=0;j<20;j++){
          map[ startingPosition + j ].getSceneObject().visible = true;
        }

        if(playerPos[1] < highScores[i]){
          highScores[i] = playerPos[1];
          $('.player'+i).html(Math.round(highScores[i]/-10));
        }

        scene.camera.setFOV(fov);
        scene.camera.target = [playerPos[0],playerPos[1]-2,playerPos[2]];
        scene.camera.position = [playerPos[0]+.1,playerPos[1],playerPos[2]];
        scene.camera.resize(canvas.width/playerArray.length, canvas.height);
        gl.viewport(canvas.width/playerArray.length*i,0,canvas.width/playerArray.length, canvas.height);

        scene.render();
      }
    }else if(!gameStarted){
      if($(video).data('canPlay')){
        if(jQuery.browser.mozilla){
          beat.init(video);
        }else{
          console.log('Not in mozilla, beat detection turned off.');
        }
        video.play();
        gameStarted = true;
        videoPlaying = true;
      }
    }
  });
}
