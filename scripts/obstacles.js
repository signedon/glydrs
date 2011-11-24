var obstacles = {
	lastObstacleHeight:200,
	spawn: function(scene,physics,player) {
		var position = player.getSceneObject().position.slice(0);
		position[1] -= 10;
//    position[0] +=(Math.random()*10)-10;
//    position[2] +=(Math.random()*10)-10;

		if (Math.abs(this.lastObstacleHeight-position[1]) < 5) {
			return;
		} else {
			this.lastObstacleHeight = position[1];
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
			type: 'ghost',
			collision: {
				type: CubicVR.enums.collision.shape.BOX,
				size: box.scale
			},
			blocker:true
		});
		physics.bind(rigidBox);
	}
}

