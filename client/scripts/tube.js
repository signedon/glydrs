var tube = {
  create:function(scene,physics,radius,length,sides,texture){
    length = length*2;
    var largeTunnel = new CubicVR.Mesh();
    var tubeCollision = new CubicVR.CollisionMap();
    
    var newDistance =  Math.tan((360/sides/2) * (Math.PI/180))*2;

    for(var i=0;i<sides;i++){
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
//            color: "resources/2062-diffuse.jpg"
            color:texture
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
      //Figure out where to place the object on the wall
      var rotationOffest = 90;
      var x = Math.round(radius*Math.cos((360*(i/sides)+rotationOffest)*(Math.PI/180)));
      var y = Math.round(radius*Math.sin((360*(i/sides)+rotationOffest)*(Math.PI/180)));

      tubeCollision.addShape({
        type: CubicVR.enums.collision.shape.BOX,
        position: [x,0,y],
        size: [newDistance*radius,length,1],
        rotation:[0,-360*((i)/sides),0]
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
  }
}