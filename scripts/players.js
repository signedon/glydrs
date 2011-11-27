var hasTicked = 0;
var players = {
	playerCount:0,
	spawn:function(scene, physics,location,controls) {
		this.playerCount++;
		if(!location){
			location = [0,0,0];
		}
		var material = new CubicVR.Material({
			textures: {
				color: "/cubicvr/samples/images/6583-diffuse.jpg"
			},
			opacity:.9
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
			position:location,
			scale:[1.3,.5,1]
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
    var terminalVelocity = -8;
    var maxVelocity = 20;
    if(angularVelocity[0] == 0 && angularVelocity[1] == 0 && angularVelocity[2] == 0){
      if(controls.buttons.A_Button == 1){
        terminalVelocity = -16;
        maxVelocity = 7;
      }

      var modifier = 2;
      if (Math.abs(velocity[0]) < maxVelocity) {
        player.applyForce([controls.axes.Left_Stick_Y*modifier,0,0], [0,0,0]);
      }
      if (Math.abs(velocity[2]) < maxVelocity) {
        player.applyForce([0,0,controls.axes.Left_Stick_X*-1*modifier],[0,0,0]);
      }

      //[forward/back, left/right,twist]
      player.setRotationEuler([velocity[0]*-2+Math.random()*2,velocity[2]*2+Math.random()*2,Math.random()*2]);
    }
    if(velocity[1] > terminalVelocity){
      player.applyForce([0,-.2,0],[0,0,0]);
    }else{
      player.applyForce([0,.2,0],[0,0,0]);
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
