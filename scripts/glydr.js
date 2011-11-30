var gl;
jQuery(document).ready(function(){
  gl = CubicVR.init();
});
var glydrs = function(){
  var $ = jQuery;
  var playerArray = [];
  var inputControls = {};
  var canvas = CubicVR.getCanvas();
  if (!gl) {
    alert("Sorry, no WebGL support.");
    return;
  };

//    var video = document.getElementById('video');
//    videoTexture = new CubicVR.CanvasTexture(video);
//
//    video.addEventListener('canplay', function(e) {
//      video.play();
//    }, false);

  var physics = new CubicVR.ScenePhysics();
  physics.setGravity([0,0,0]);
  var scene = new CubicVR.Scene(canvas.width, canvas.height, 80);
  scene.camera.setTargeted(true);
  scene.camera.setClip(.1,1000);

  // Add our camera to the window resize list
  CubicVR.addResizeable(scene);

  tube.create(scene,physics);

  for(i=0;i<gamepads.length;i++){
    playerArray.push(players.spawn(scene,physics,[0,0,10*playerArray.length],gamepads[i]));
  }

  
  var video = document.getElementById('gameVideo');
  var videoTexture = new CubicVR.CanvasTexture(video);
  video.addEventListener('canplay', function(e) {
    video.play();
  }, false);
  video.addEventListener('ended', function(e) {
    video.currentTime = 0;
  }, false);

  
  var obstacleSpawnTime = -1;
  var playerPush = -1;
  // Start our main drawing loop, it provides a timer and the gl context as parameters
  CubicVR.MainLoop(function(timer, gl) {
    if (video.currentTime > 0) videoTexture.update();
    var seconds = timer.getSeconds();
    var roundedSecond = Math.floor(seconds)
    if(roundedSecond%1 == 0 && roundedSecond != obstacleSpawnTime){
    obstacleSpawnTime = roundedSecond;
    for(var i=0;i<playerArray.length;i++){
      obstacles.spawn(scene,physics,playerArray[i],videoTexture);
    }
  }

  physics.stepSimulation(timer.getLastUpdateSeconds());
  physics.triggerEvents();
  scene.runEvents(seconds);

  for(var i=0;i<playerArray.length;i++){
    var playerPos = playerArray[i].getSceneObject().position.slice(0);
    scene.camera.target = playerPos;
    scene.camera.position = [playerPos[0]+.1,playerPos[1]+14,playerPos[2]];
    scene.camera.resize(canvas.width/playerArray.length, canvas.height);
    gl.viewport(canvas.width/playerArray.length*i,0,canvas.width/playerArray.length, canvas.height);
    scene.render();
  }
  });
}
