var players = {
	playerCount:0,
  killPlayer:function(player){
    player.reset();
  },
	spawn:function(scene, physics,location,controls) {
		this.playerCount++;
		if(!location){
			location = [0,0,0];
		}
		var material = new CubicVR.Material({
			textures: {
				color: "resources/2062-diffuse.jpg"
			},
			opacity:.5
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
    var sizeModifier = 3;
		var box = new CubicVR.SceneObject({
			mesh:mesh,
			position:location,
			scale:[1.3*sizeModifier,.5*sizeModifier,1*sizeModifier]
		});
		box.getInstanceMaterials()[0].color = [Math.random(),Math.random(),Math.random()];


		var rigidBox = new CubicVR.RigidBody(box, {
			type: 'dynamic',
			collision: {
				type: CubicVR.enums.collision.shape.BOX,
				size: box.scale
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
		return rigidBox;
	},
	_applyPlayerForces:function(player,controls) {
		var angularVelocity = player.getAngularVelocity();
    var velocity = player.getLinearVelocity();
    var terminalVelocity = -150;
    var maxVelocity = 20;
    var rotationModifier = 2;
    if(angularVelocity[0] == 0 && angularVelocity[1] == 0 && angularVelocity[2] == 0){
      var modifier = 1.7;
      if(controls.buttons.A_Button != 0){
        rotationModifier = .5;
        modifier = 5;
        maxVelocity = 30;
        terminalVelocity = -100;
      }

      if (Math.abs(velocity[0]) < maxVelocity) {
        player.applyForce([controls.axes.Left_Stick_Y*modifier,0,0], [0,0,0]);
      }
      if (Math.abs(velocity[2]) < maxVelocity) {
        player.applyForce([0,0,controls.axes.Left_Stick_X*-1*modifier],[0,0,0]);
      }
      //[forward/back, left/right,twist]
      player.setRotationEuler([velocity[0]*-2,velocity[2]*2,0]);
    }
    if(velocity[1] > terminalVelocity){
      player.applyForce([0,-2,0],[0,0,0]);
    }else{
      player.applyForce([0,4,0],[0,0,0]);
    }
    
    if (Math.abs(velocity[0]) > 1) {
      if (velocity[0] > 0) {
        player.applyForce([-1,0,0], [0,0,0]);
      } else {
        player.applyForce([1,0,0], [0,0,0]);
      }
    }
    if (Math.abs(velocity[2]) > 1) {
      if (velocity[2] > 0) {
        player.applyForce([0,0,-1], [0,0,0]);
      } else {
        player.applyForce([0,0,1], [0,0,0]);
      }
    }

	}
};
