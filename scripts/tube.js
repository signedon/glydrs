var tube = {
  create:function(scene,physics){
		var mesh = new CubicVR.Mesh({
			primitive: {
				type: "torus",
				innerRadius:.9,
				outerRadius:1,
				lon:5,
				lat:5,
				material: {
          textures: {
            color: "/cubicvr/samples/images/6583-diffuse.jpg"
          }
        },
				uvmapper: {
					projectionMode: "planar",
					projectionAxis: "y",
					scale: [0.5, 0.5, 0.5]
				}
			},
			compile: true
		});

		var tube = new CubicVR.SceneObject({
			mesh:mesh,
			position:[0,-10,0],
			scale:[20,9000,20]
//			scale:[1,1,1]
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