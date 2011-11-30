var tube = {
  create:function(scene,physics){
		var mesh = new CubicVR.Mesh({
			primitive: {
				type: "torus",
				innerRadius:.9,
				outerRadius:1,
				lon:10,
				lat:10,
				material: {
          textures: {
            color: "/cubicvr/samples/images/2062-diffuse.jpg"
          }
        },
				uvmapper: {
					projectionMode: "cylindrical",
					projectionAxis: "x",
					scale: [3, 3, .3]
				}
			},
			compile: true
		});

		var tube = new CubicVR.SceneObject({
			mesh:mesh,
			position:[0,-10,0],
			scale:[30,1000000,30]
		});
		tube.getInstanceMaterials()[0].color = [Math.random(),Math.random(),Math.random()];

		var rigidTube = new CubicVR.RigidBody(tube, {
			type: 'ghost',
      collision: {
        type: CubicVR.enums.collision.shape.CONVEX_HULL,
        mesh: tube.getMesh().clean(),
        size: tube.scale
      },
			blocker:true
		});

		scene.bind(tube);
		physics.bind(rigidTube);
		return rigidTube;
  }
}