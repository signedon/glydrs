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
			position:location,
			scale:[1,1,1]
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
			interval: 1/10,
			action: function(event){
				This._applyPlayerForces(rigidBox,controls);
			}
		});
		rigidBox.getSceneObject().addEvent({
			id: "tick",
			interval: 5,
			action: function(event){
				rigidBox.applyForce([0,-3,0],[0,0,0]);
			}
		});

		scene.bind(box);
		physics.bind(rigidBox);
		return rigidBox;
	},
	_applyPlayerForces:function(player,controls) {
		var velocity = player.getLinearVelocity();
    var maxVelocity = 20;
    var modifier = 2;
    if (Math.abs(velocity[0]) < maxVelocity) {
      player.applyForce([controls.axes.Left_Stick_Y*modifier,0,0], [0,0,0]);
    }
    if (Math.abs(velocity[2]) < maxVelocity) {
      player.applyForce([0,0,controls.axes.Left_Stick_X*-1*modifier],[0,0,0]);
    }

		if (Math.floor(velocity[0]) != 0) {
			if (velocity[0] > 0) {
				player.applyForce([-1,0,0], [0,0,0]);
			} else {
				player.applyForce([1,0,0], [0,0,0]);
			}
		}
		if (Math.floor(velocity[2]) != 0) {
			if (velocity[2] > 0) {
				player.applyForce([0,0,-1], [0,0,0]);
			} else {
				player.applyForce([0,0,.1], [0,0,0]);
			}
		}
	}
};
