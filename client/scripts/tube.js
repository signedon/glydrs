var tube = {
  create:function(scene,physics){
    var sides = 8;
    var radius = 25;
    var length = 100000;

    var largeTunnel = new CubicVR.Mesh();
    var tubeCollision = new CubicVR.CollisionMap();

    var newDistance =  Math.tan((360/sides/2) * (Math.PI/180))*2;

    for(var i=0;i<sides;i++){
      //Figure out where to place the object on the wall
//      var x = Math.round(radius*Math.cos(360*(i/sides)*(Math.PI/180)));
//	    var y = Math.round(radius*Math.sin(360*(i/sides)*(Math.PI/180)));
//      console.log(x,y);
//      var translate =[(x/radius+1)/2,0,(y/radius+1)/2];


      var transform = new CubicVR.Transform();
      //Position the item to the right side.
      transform.translate([0,0,1]);
      //Set its width equal to the calculated width of the wall we found out above
      transform.scale([newDistance,1,1]);
      //Rotate it 360/sides degrees around the center point
      transform.rotate([0,360*i/sides,0]);

      //Create the plane
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
          scale:[2/newDistance,30/length,2/newDistance]
				},
        mesh: largeTunnel
      });

      //Add collision
      tubeCollision.addShape({
          type: CubicVR.enums.collision.shape.BOX,
          size: [newDistance,1,1],
          position: [0,-10,radius],
          rotation:[0,360*i/sides,0]
      });
    }

    //Prepare the entire tunnel
    largeTunnel.prepare();

    //Create the tunnel
    var tubeWall = new CubicVR.SceneObject({
      mesh:largeTunnel,
      position:[0,-10,0],
      scale:[radius,length,radius]
    });

    //Add physics
    var rigidTubeWall = new CubicVR.RigidBody(tubeWall, {
      type: 'ghost',
      collision: tubeCollision,
      blocker:true
    });
    
    //Bind them to the scene
    scene.bind(tubeWall);
    physics.bind(rigidTubeWall);
    return rigidTubeWall;
  }
}