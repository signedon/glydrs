var obstacles = {
  generateMap:function(scene,physics,options){
    var tunnelRadius=options.tunnelRadius;
    var tunnelLength=options.tunnelLength;
    var videoTexture=options.videoTexture;
    var coloredBlocks=options.coloredBlocks;

    var myTunnel = [];
    for(var i=200;i<tunnelLength;i=i+100){
      var myTunnelRadius = tunnelRadius-10;

//      var num = Math.round(Math.random()*2);
//      var num1 = Math.round(Math.random()*2);

      var location = [(Math.random()*myTunnelRadius*2)-myTunnelRadius,-i+(Math.random()*20-20),(Math.random()*myTunnelRadius*2)-myTunnelRadius];
      myTunnel.push({
        location:location,
        size:[50,10,50]
      });
    }


    for(var i=0;i<myTunnel.length;i++){
      obstacles.spawn(scene,physics,{
        videoTexture:videoTexture,
        coloredBlocks:coloredBlocks,
        position:myTunnel[i].location,
        size:myTunnel[i].size,
        tunnelRadius:myTunnelRadius
      });
    }
  },
	spawn: function(scene,physics,options) {
    var videoTexture=options.videoTexture;
    var position=options.position;
    var tunnelRadius = options.tunnelRadius;
    var coloredBlocks = options.coloredBlocks;
    var scale = [100,10,100];
    if(options.size){
      scale = options.size;
    }


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

    if(coloredBlocks){
      box.getInstanceMaterials()[0].color = [Math.random(),Math.random(),Math.random()];
    }
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
//      blocker:true
    });
		physics.bind(rigidBox);
	}
}

