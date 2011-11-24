(function(){
  var $ = jQuery;
  var player;
  var inputControls = {};

  function webGLStart(){
    var gl = CubicVR.init();
    var canvas = CubicVR.getCanvas();
    if (!gl) {
      alert("Sorry, no WebGL support.");
      return;
    };

    var physics = new CubicVR.ScenePhysics();
    physics.setGravity([0,0,0]);
    var scene = new CubicVR.Scene(canvas.width, canvas.height, 80);
	scene.camera.setTargeted(true);
	  
    // Add our camera to the window resize list
    CubicVR.addResizeable(scene);

    player1 = players.spawn(scene,physics,[0,0,0]);
	player1.applyForce([0,-3,0],[0,0,0]);
    player = players.spawn(scene,physics,[10,0,10]);

//	camera1 = new CubicVR.Camera({
//		width:canvas.width/2,
//		height:canvas.height,
//		position : [.2,5,0],
//		target: [0,0,0],
//		targeted:true
//	});
//	scene.bindCamera(camera1);
//
//
//	camera2 = new CubicVR.Camera({
//		width:50,
//		height:60,
//		position : [.2,5,10],
//		target: [0,0,0],
//		targeted:true
//	});
//	scene.bindCamera(camera2);
	 


    var obstacleSpawnTime = -1;
    var playerPush = -1;
    // Start our main drawing loop, it provides a timer and the gl context as parameters
    CubicVR.MainLoop(function(timer, gl) {
	  var playerPos = player.getSceneObject().position.slice(0);
	  scene.camera.target = playerPos;
	  scene.camera.position = [playerPos[0]+.2,playerPos[1]+5,playerPos[2]];

      var seconds = timer.getSeconds();
      var roundedSecond = Math.floor(seconds);
      if(roundedSecond%1 == 0 && roundedSecond != obstacleSpawnTime){
        obstacleSpawnTime = roundedSecond;
        obstacles.spawn(scene,physics,player);
      }
      if(roundedSecond%5 == 0 && roundedSecond != playerPush){
        playerPush = roundedSecond;
        player.applyForce([0,-3,0],[0,0,0]);
      }
	  players._updatePlayerControls(player);

      physics.stepSimulation(timer.getLastUpdateSeconds());
      scene.render();

	    


    });
  }

  $(document).ready(function(){
    webGLStart();
  });
})();
