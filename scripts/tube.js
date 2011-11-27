var tube = {
  create:function(scene,physics){
    var material = new CubicVR.Material({
			textures: {
				color: "/cubicvr/samples/images/6583-diffuse.jpg"
			}
		});
		var mesh = new CubicVR.Mesh({
			primitive: {
				type: "torus",
				innerRadius:.9,
				outerRadius:1,
				lon:5,
				lat:5,
				material: material,
				uvmapper: {
					projectionMode: "planar",
					projectionAxis: "x",
					scale: [0.5, 0.5, 0.5]
				}
			},
			compile: true
		});
		var box = new CubicVR.SceneObject({
			mesh:mesh,
			position:[0,-10,0],
			scale:[20,9000,20]
		});
		box.getInstanceMaterials()[0].color = [Math.random(),Math.random(),Math.random()];

//		var rigidBox = new CubicVR.RigidBody(box, {
//			type: 'static',
//			collision: {
//				type: CubicVR.enums.collision.shape.CONVEX_HULL,
//				size: box.scale
//			},
//			blocker:true
//		});

		scene.bind(box);
//		physics.bind(rigidBox);
//		return rigidBox;
  }
}