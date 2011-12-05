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

  var tunnelRadius = 50;
  var tunnelLength = 23700;//Tuned for a 4 minute video
  var tunnelSides = 6;


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
    playerArray.push(players.spawn(scene,physics,[0,0,10*playerArray.length],gamepads[i]));
    $('body').append('<div class="playerScore player'+i+'" style="left:'+canvas.width/gamepads.length*i+'px">0</div>');
  }

  
  var video = document.getElementById('gameVideo');
  var videoTexture = new CubicVR.CanvasTexture(video);
  var gameStarted = false;
  video.addEventListener("ended", function(){
    console.log('Video ended');
    videoPlaying = false;
    alert('Game Over');
  }, false);
  var videoPlaying = false;
//  video.muted = true;
  tube.create(scene,physics,tunnelRadius,tunnelLength,tunnelSides,videoTexture);

  obstacles.generateMap(scene,physics,tunnelRadius,tunnelLength,videoTexture);
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

      for(var i=0;i<playerArray.length;i++){
        var playerPos = playerArray[i].getSceneObject().position.slice(0);
        var fov = 90 - Math.floor(( playerArray[i].getLinearVelocity()[1]/30)*6);

        if(playerPos[1] < highScores[i]){
          highScores[i] = playerPos[1];
          $('.player'+i).html(Math.round(highScores[i]/-10));
        }

        scene.camera.setFOV(fov);
        scene.camera.target = playerPos;
        scene.camera.position = [playerPos[0]+.1,playerPos[1]+12,playerPos[2]];
        scene.camera.resize(canvas.width/playerArray.length, canvas.height);
        gl.viewport(canvas.width/playerArray.length*i,0,canvas.width/playerArray.length, canvas.height);

        scene.render();
      }
    }else if(!gameStarted){
      if($(video).data('canPlay')){
        beat.init(video);
        video.play();
        gameStarted = true;
        videoPlaying = true;
      }
    }
  });
}
