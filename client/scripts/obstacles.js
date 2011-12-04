var obstacles = {
  generateMap:function(scene,physics,tunnelRadius,tunnelLength,videoTexture){
    for(var i=200;i<tunnelLength;i=i+60){
      var myTunnelRadius = tunnelRadius-15;
      var location = [(Math.random()*myTunnelRadius*2)-myTunnelRadius,-i,(Math.random()*myTunnelRadius*2)-myTunnelRadius];
      obstacles.spawn(scene,physics,videoTexture,location,myTunnelRadius);
    }
  },
	spawn: function(scene,physics,videoTexture,position,tunnelRadius) {
//		var position = player.getSceneObject().position.slice(0);
//		position[1] -= 1000;
//    position[0] +=(Math.random()-.5)*25;
//    position[2] +=(Math.random()-.5)*25;
//		var lastObstacleHeight = player.getSceneObject().getProperty('lastObstacleHeight');
//		if(typeof lastObstacleHeight == 'undefined'){
//			lastObstacleHeight = 0;
//		}

    var scale = [35,15,35];

//		if (Math.abs(lastObstacleHeight-position[1]) < 5) {
//			return;
//		} else {
//			player.getSceneObject().setProperty('lastObstacleHeight',position[1]);
//		}


		var material = new CubicVR.Material({
			textures: {
//				color: "resources/image.jpg"
        color:videoTexture
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

  //BEGIN wireframes
//    var wireframeMesh = new CubicVR.Mesh({
//        primitives:{
//          type: "box",
//          size: 1.0,
//          material: {
//            textures: {
//                color: "resources/image3.jpg"
//            }
//          },
//          uvmapper: {
//            projectionMode: "cubic",
//            scale: [0.5, 0.5, 0.5]
//          }
//        },
//        wireframe: true,
//        triangulateWireframe: true,
//        wireframeMaterial: {
//            color: [0, 1, 0]
//        },
//        compile: true
//    });
//		var wireframeBox = new CubicVR.SceneObject({
//			mesh:wireframeMesh,
//			position:position,
//			scale:[scale[0]+.1,scale[1]-.5,scale[2]+.1],
//      rotation:[0,-90,0]
//		});
//		scene.bind(wireframeBox);


    


//		box.getInstanceMaterials()[0].color = [Math.random(),Math.random(),Math.random()];


		box.addEvent({
			id: CubicVR.enums.event.CONTACT_GHOST,
			action: function(event,handler){
//        players.killPlayer(event.event_properties.contacts[0]);
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

