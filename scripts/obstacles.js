var obstacles = {
	spawn: function(scene,physics,player) {
    var tunnelRadius = 30;

		var position = player.getSceneObject().position.slice(0);
		position[1] -= 1000;
    position[0] +=(Math.random()-.5)*25;
    position[2] +=(Math.random()-.5)*25;
		var lastObstacleHeight = player.getSceneObject().getProperty('lastObstacleHeight');
		if(typeof lastObstacleHeight == 'undefined'){
			lastObstacleHeight = 0;
		}


    var scale = [20,2,20];


		if (Math.abs(lastObstacleHeight-position[1]) < 5) {
			return;
		} else {
			player.getSceneObject().setProperty('lastObstacleHeight',position[1]);
		}

		var material = new CubicVR.Material({
			textures: {
				color: "resources/image.jpg"
//        color:videoTexture
			}
		});

    
		var mesh = new CubicVR.Mesh({
			primitive: {
				type: "box",
				size: 1.0,
				material: material,
				uvmapper: {
					projectionMode: "cubic",
					scale: [(tunnelRadius*2)/scale[0]*1.25, scale[1], (tunnelRadius*2)/scale[2]],
          center: [-1*(position[2]/scale[2]),0,(position[0]/scale[0])]
				}
			},
			compile: true
		});
		var box = new CubicVR.SceneObject({
			mesh:mesh,
			position:position,
			scale:scale,
      rotation:[0,-90,0]
		});


//		box.getInstanceMaterials()[0].color = [Math.random(),Math.random(),Math.random()];


		box.addEvent({
			id: CubicVR.enums.event.CONTACT_GHOST,
			action: function(event,handler){
//				event.event_properties.contacts[0].sceneObject.position = [0,0,0];
//				console.log(event,handler);
			}
		});

		scene.bind(box);

		var rigidBox = new CubicVR.RigidBody(box, {
			type: 'ghost',
			collision: {
				type: CubicVR.enums.collision.shape.BOX,
				size: box.scale
			}
//			blocker:true
		});
		physics.bind(rigidBox);
	}
}

