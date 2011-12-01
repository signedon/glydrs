var tube = {
  create:function(scene,physics){
    var sides = 4;
    var radius = 40;

    var x = Math.round(radius*Math.cos(360/sides*Math.PI/180));
    var y = Math.round(radius*Math.sin(360/sides*Math.PI/180));
    var x1 = Math.round(radius*Math.cos(360*Math.PI/180));
    var y1 = Math.round(radius*Math.sin(360*Math.PI/180));
    var distance = Math.sqrt(Math.pow(x1-x,2)+Math.pow(y1-y,2));

    var scale = [distance,1000000,1];
    var largeTunnel = new CubicVR.Mesh();

//    var mesh = new CubicVR.Mesh({
//			primitive: {
//				type: "plane",
//				material: {
//          textures: {
//            color: "/cubicvr/samples/images/2062-diffuse.jpg"
//          }
//        },
//				uvmapper: {
//					projectionMode: "planar",
//					projectionAxis: "x",
//          scale:[1,.00001,1]
//				}
//			},
//			compile: true
//		});


    for(var i=0;i<sides;i++){
      var x = Math.round(radius*Math.cos(360*i/sides*Math.PI/180));
	    var y = Math.round(radius*Math.sin(360*i/sides*Math.PI/180));
      
      var transform = new CubicVR.Transform();
      transform.rotate([0,-360*i/sides,0]);
      transform.translate([x,y,0]);
      transform.scale([1,1,1]);
      
      CubicVR.primitives.plane({
				material: {
          textures: {
            color: "/cubicvr/samples/images/2062-diffuse.jpg"
          }
        },
        transform: transform,
				uvmapper: {
					projectionMode: "planar",
					projectionAxis: "x",
          scale:[1,1,1]
				},
        mesh: largeTunnel
      });
    }

    largeTunnel.prepare();

    var tubeWall = new CubicVR.SceneObject({
      mesh:largeTunnel,
      position:[0,-10,0],
      scale:[radius,100000,radius]
    });

//      var rigidTubeWall = new CubicVR.RigidBody(tubeWall, {
//        type: 'ghost',
//        collision: {
//          type: CubicVR.enums.collision.shape.PLANAR,
//          size: tubeWall.scale
//        },
//        blocker:true
//      });

    scene.bind(tubeWall);
//      physics.bind(rigidTubeWall);
//    return rigidTubeWall;
  }
}