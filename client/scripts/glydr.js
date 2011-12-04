var gl;
jQuery(document).ready(function(){
  gl = CubicVR.init();
});
var glydrs = function(){
  var $ = jQuery;
  var playerArray = [];
  var inputControls = {};
  var canvas = CubicVR.getCanvas();

  var tunnelRadius = 50;
  var tunnelLength = 21000;
  var tunnelSides = 8;

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

  tube.create(scene,physics,tunnelRadius,tunnelLength,tunnelSides);

  for(i=0;i<gamepads.length;i++){
    playerArray.push(players.spawn(scene,physics,[0,0,10*playerArray.length],gamepads[i]));
  }

  
  var video = document.getElementById('gameVideo');
  var videoTexture = new CubicVR.CanvasTexture(video);
  video.addEventListener('canplay', function(e) {
    video.play();
  }, false);
  video.play();
  
  obstacles.generateMap(scene,physics,tunnelRadius,tunnelLength,videoTexture);

  // Start our main drawing loop, it provides a timer and the gl context as parameters
  CubicVR.MainLoop(function(timer, gl) {
    if (video.currentTime > 0) videoTexture.update();
    var seconds = timer.getSeconds();

    physics.stepSimulation(timer.getLastUpdateSeconds());
    physics.triggerEvents();
    scene.runEvents(seconds);

    for(var i=0;i<playerArray.length;i++){
      var playerPos = playerArray[i].getSceneObject().position.slice(0);
      var fov = 90 - Math.floor(( Math.round(playerArray[i].getLinearVelocity()[1])/30)*5);
      scene.camera.setFOV(fov);
      scene.camera.target = playerPos;
      scene.camera.position = [playerPos[0]+.1,playerPos[1]+12,playerPos[2]];
      scene.camera.resize(canvas.width/playerArray.length, canvas.height);
      gl.viewport(canvas.width/playerArray.length*i,0,canvas.width/playerArray.length, canvas.height);
      scene.render();
    }
  });
}
