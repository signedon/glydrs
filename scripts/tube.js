var tube = {
  create:function(scene,physics){
    var material = new CubicVR.Material({
			textures: {
				color: "/cubicvr/samples/images/6583-diffuse.jpg"
			}
		});
		var mesh = new CubicVR.Mesh({
			primitive: {
				type: "cylinder",
				radius: 1,
        height:1,
				material: material,
				uvmapper: {
					projectionMode: "cylindrical",
					scale: [1, 1, 1]
				}
			},
			compile: true
		});
		var box = new CubicVR.SceneObject({
			mesh:mesh,
			position:[0,-10,0],
			scale:[1000,100,100]
		});
		box.getInstanceMaterials()[0].color = [Math.random(),Math.random(),Math.random()];

		var rigidBox = new CubicVR.RigidBody(box, {
			type: 'static',
			collision: {
				type: CubicVR.enums.collision.shape.CYLINDER,
				size: box.scale
			},
			blocker:true
		});

		scene.bind(box);
		physics.bind(rigidBox);
		return rigidBox;
  }
}