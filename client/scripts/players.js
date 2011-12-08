var players = {
//  defaultRotation:[90,90,0],
	playerCount:0,
  killPlayer:function(player){
     player.reset();
  },
	spawn:function(scene,physics,location,controls) {
		this.playerCount++;
		if(!location){
			location = [0,0,0];
		}

    // load the collada file, specify path for images
    var colladaScene = CubicVR.loadCollada("resources/skydiver/skydiver.dae",'');

    // need to know it's name in the default scene
    var mesh = colladaScene.getSceneObject("SkyDiver").obj;
    
		var box = new CubicVR.SceneObject({
			mesh:mesh,
			position:location,
			scale:[.8,.8,.8]
		});
    box.setProperty('id',this.playerCount);
//		box.getInstanceMaterials()[0].color = [Math.random(),Math.random(),Math.random()];

    var modifier = 5;
		var rigidBox = new CubicVR.RigidBody(box, {
			type: 'dynamic',
			collision: {
				type: CubicVR.enums.collision.shape.BOX,
				size: [box.scale[0]*1.6*modifier,box.scale[1]*2.5*modifier,box.scale[2]*1.1*modifier]
			}
		});
		rigidBox.activate();
		
		var This = this;
		rigidBox.getSceneObject().addEvent({
			id: "tick",
			interval: 1/100,
			action: function(event){
				This._applyPlayerForces(rigidBox,controls);
			}
		});

		scene.bind(box);
		physics.bind(rigidBox);
    rigidBox.applyForce([0,-15,0],[0,0,0]);
		return rigidBox;
	},
	_applyPlayerForces:function(player,controls) {
    player.setAngularVelocity([0,0,0]);
    var velocity = player.getLinearVelocity();
    var terminalVelocity = -200;
    var maxVelocity = 70;
    var rotationModifier = 2;
    var modifier = 40;
    if(controls.buttons.A_Button != 0){
      rotationModifier = .5;
      modifier = 45;
      maxVelocity = 90;
      terminalVelocity = -150;
    }

    if (Math.abs(velocity[0]) < maxVelocity) {
      player.applyForce([controls.axes.Left_Stick_Y*modifier,0,0], [0,0,0]);
    }
    if (Math.abs(velocity[2]) < maxVelocity) {
      player.applyForce([0,0,controls.axes.Left_Stick_X*-1*modifier],[0,0,0]);
    }
    //[forward/back, left/right,twist]
    player.setRotationEuler([(velocity[0]/maxVelocity)*-30,(velocity[2]/maxVelocity)*30,0]);

    if(Math.abs(Math.abs(velocity[1]) + terminalVelocity) > 4){
      if(velocity[1] > terminalVelocity){
        player.applyForce([0,-8,0],[0,0,0]);
      }else{
        player.applyForce([0,8,0],[0,0,0]);
      }
    }

    velocity = player.getLinearVelocity();
    var directionalForce = 15;
    if (Math.abs(velocity[0]) > 10) {
      if (velocity[0] > 0) {
        player.applyForce([-directionalForce,0,0], [0,0,0]);
      } else {
        player.applyForce([directionalForce,0,0], [0,0,0]);
      }
    }else{
      velocity = player.getLinearVelocity();
      player.setLinearVelocity([0,velocity[1],velocity[2]]);
    }
    if (Math.abs(velocity[2]) > 10) {
      if (velocity[2] > 0) {
        player.applyForce([0,0,-directionalForce], [0,0,0]);
      } else {
        player.applyForce([0,0,directionalForce], [0,0,0]);
      }
    }else{
       velocity = player.getLinearVelocity();
      player.setLinearVelocity([velocity[0],velocity[1],0]);
    }
	}
};
