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
    scene.camera.position = [1,5,0];
    scene.camera.lookat([0,0,0]);

  //  var mvc = new CubicVR.MouseViewController(canvas, scene.camera);

    window.addEventListener('keydown', function(event) {
      switch (event.keyCode) {
        case 37: // Left
          if(typeof inputControls.left == 'undefined'){
            inputControls.left = 0;
          }
        break;
        case 38: // Up
          if(typeof inputControls.up == 'undefined'){
            inputControls.up = 0;
          }
        break;
        case 39: // Right
          if(typeof inputControls.right == 'undefined'){
            inputControls.right = 0;
          }
        break;
        case 40: // Down
          if(typeof inputControls.down == 'undefined'){
            inputControls.down = 0;
          }
        break;
      }
    }, false);

    window.addEventListener('keyup', function(event) {
      switch (event.keyCode) {
        case 37: // Left
          delete inputControls.left;
        break;
        case 38: // Up
          delete inputControls.up;
        break;
        case 39: // Right
          delete inputControls.right;
        break;
        case 40: // Down
          delete inputControls.down;
        break;
      }
    }, false);

    // Add our camera to the window resize list
    CubicVR.addResizeable(scene);
    


    player = spawnPlayer(scene,physics);

    var obstacleSpawnTime = -1;
    var playerPush = -1;
    // Start our main drawing loop, it provides a timer and the gl context as parameters
    CubicVR.MainLoop(function(timer, gl) {
      var seconds = timer.getSeconds();
      var roundedSecond = Math.floor(seconds);
      if(roundedSecond%1 == 0 && roundedSecond != obstacleSpawnTime){
        obstacleSpawnTime = roundedSecond;
        spawnObstacle(scene,physics);
      }
      if(roundedSecond%5 == 0 && roundedSecond != playerPush){
        playerPush = roundedSecond;
        player.physics.applyForce([0,-3,0],[0,0,0]);
      }
      updatePlayerControls();


      physics.stepSimulation(timer.getLastUpdateSeconds());
      scene.render();
    });
  }

  var lastObstacleHeight = -1;
  function spawnObstacle(scene,physics){
    var position = player.obj.position.slice(0);
    position[1]-=50;
    position[0] +=(Math.random()*10)-10;
    position[2] +=(Math.random()*10)-10;

    if(lastObstacleHeight == position[1]){
      return;
    }else{
      lastObstacleHeight = position[1];
    }

    var material = new CubicVR.Material({
      textures: {
        color: "/cubicvr/samples/images/6583-diffuse.jpg"
      }
    });


    var mesh = new CubicVR.Mesh({
      primitive: {
        type: "box",
        size: 1.0,
        material: material,
        uvmapper: {
          projectionMode: "cubic",
          scale: [1, 1, 1]
        }
      },
      compile: true
    });
    var box = new CubicVR.SceneObject({
      mesh:mesh,
      position:position,
      scale:[5,2,5]
    });
    box.getInstanceMaterials()[0].color = [Math.random(),Math.random(),Math.random()];

    scene.bind(box);

    var rigidBox = new CubicVR.RigidBody(box, {
      type: CubicVR.enums.physics.body.STATIC,
      collision: {
        type: CubicVR.enums.collision.shape.BOX,
        size: box.scale
      }
    });
    physics.bind(rigidBox);
  }
  function spawnPlayer(scene,physics){
    var material = new CubicVR.Material({
      textures: {
        color: "/cubicvr/samples/images/6583-diffuse.jpg"
      }
    });


    var mesh = new CubicVR.Mesh({
      primitive: {
        type: "box",
        size: 1.0,
        material: material,
        uvmapper: {
          projectionMode: "cubic",
          scale: [1, 1, 1]
        }
      },
      compile: true
    });
    var box = new CubicVR.SceneObject({
      mesh:mesh,
      position:[0,20,0],
      scale:[1,1,1]
    });
    box.getInstanceMaterials()[0].color = [Math.random(),Math.random(),Math.random()];

    scene.bind(box);
    scene.camera.setParent(box);

    var rigidBox = new CubicVR.RigidBody(box, {
      type: CubicVR.enums.physics.body.DYNAMIC,
      collision: {
        type: CubicVR.enums.collision.shape.BOX,
        size: box.scale
      }
    });
    physics.bind(rigidBox);

    return {
      physics:rigidBox,
      obj:box
    };
  }


  function updatePlayerControls(){
    var leftRight = false;
    var upDown = false;
    var velocity = player.physics.getLinearVelocity();
    for(var control in inputControls){
      if(control == 'up' || control == 'down'){
        upDown = true;
      }
      if(control == 'left' || control == 'right'){
        leftRight = true;
      }
      var maxVelocity = 10;
      switch(control){
        case 'up':
          if(Math.abs(velocity[0]) < maxVelocity){
            player.physics.applyForce([-1,0,0],[0,0,0]);
          }
        break;
        case 'down':
          if(Math.abs(velocity[0]) < maxVelocity){
            player.physics.applyForce([1,0,0],[0,0,0]);
          }
        break;
        case 'left':
          if(Math.abs(velocity[2]) < maxVelocity){
            player.physics.applyForce([0,0,1],[0,0,0]);
          }
        break;
        case 'right':
          if(Math.abs(velocity[2]) < maxVelocity){
            player.physics.applyForce([0,0,-1],[0,0,0]);
          }
        break;
      }
    }
    if(Math.floor(velocity[0]) != 0){
      if(velocity[0] > 0){
        player.physics.applyForce([-.25,0,0],[0,0,0]);
      }else{
        player.physics.applyForce([.25,0,0],[0,0,0]);
      }
    }
    if(Math.floor(velocity[2]) != 0){
      if(velocity[2] > 0){
        player.physics.applyForce([0,0,-.25],[0,0,0]);
      }else{
        player.physics.applyForce([0,0,.25],[0,0,0]);
      }
    }
  }
  $(document).ready(function(){
    webGLStart();
  });
})();
