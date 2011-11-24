var players = {
	playerCount:0,
	spawn:function(scene, physics,location) {
		this.playerCount++;
		if(!location){
			location = [0,0,0];
		}
		var material = new CubicVR.Material({
			textures: {
				color: "/cubicvr/samples/images/6583-diffuse.jpg"
			}
		});
		var mesh = new CubicVR.Mesh({
			primitive: {
				type: "box",
				size: 1.0,
				material: material,
				uvmapper: {
					projectionMode: "cubic",
					scale: [1, 1, 1]
				}
			},
			compile: true
		});
		var box = new CubicVR.SceneObject({
			mesh:mesh,
			position:location,
			scale:[1,1,1]
		});
		box.getInstanceMaterials()[0].color = [Math.random(),Math.random(),Math.random()];

		scene.bind(box);

		var rigidBox = new CubicVR.RigidBody(box, {
			type: 'dynamic',
			collision: {
				type: CubicVR.enums.collision.shape.BOX,
				size: box.scale
			}
		});
		physics.bind(rigidBox);
		
		box.setProperty('inputControls',{});
		this._addListeners(rigidBox);
		var This = this;
		rigidBox.getSceneObject().addEvent({
			id: "tick",
			action: function(event){
				console.log("Ticking");
				This._updatePlayerControls(rigidBox);
			},
			enabled:true
		});

		return rigidBox;
	},
	_updatePlayerControls:function(player) {
		var leftRight = false;
		var upDown = false;
		var velocity = player.getLinearVelocity();
		var inputControls = player.getSceneObject().getProperty('inputControls');
		for (var control in inputControls) {
			if (control == 'up' || control == 'down') {
				upDown = true;
			}
			if (control == 'left' || control == 'right') {
				leftRight = true;
			}
			var maxVelocity = 10;
			switch (control) {
				case 'up':
					if (Math.abs(velocity[0]) < maxVelocity) {
						player.applyForce([-1,0,0], [0,0,0]);
					}
					break;
				case 'down':
					if (Math.abs(velocity[0]) < maxVelocity) {
						player.applyForce([1,0,0], [0,0,0]);
					}
					break;
				case 'left':
					if (Math.abs(velocity[2]) < maxVelocity) {
						player.applyForce([0,0,1], [0,0,0]);
					}
					break;
				case 'right':
					if (Math.abs(velocity[2]) < maxVelocity) {
						player.applyForce([0,0,-1], [0,0,0]);
					}
					break;
			}
		}
		if (Math.floor(velocity[0]) != 0) {
			if (velocity[0] > 0) {
				player.applyForce([-.25,0,0], [0,0,0]);
			} else {
				player.applyForce([.25,0,0], [0,0,0]);
			}
		}
		if (Math.floor(velocity[2]) != 0) {
			if (velocity[2] > 0) {
				player.applyForce([0,0,-.25], [0,0,0]);
			} else {
				player.applyForce([0,0,.25], [0,0,0]);
			}
		}
	},
	_addListeners:function(player) {
		window.addEventListener('keydown', function(event) {
			var inputControls = player.getSceneObject().getProperty('inputControls');
			switch (event.keyCode) {
				case 37: // Left
					if (typeof inputControls.left == 'undefined') {
						inputControls.left = 0;
					}
					break;
				case 38: // Up
					if (typeof inputControls.up == 'undefined') {
						inputControls.up = 0;
					}
					break;
				case 39: // Right
					if (typeof inputControls.right == 'undefined') {
						inputControls.right = 0;
					}
					break;
				case 40: // Down
					if (typeof inputControls.down == 'undefined') {
						inputControls.down = 0;
					}
					break;
			}
			player.getSceneObject().setProperty('inputControls',inputControls);
		}, false);
		window.addEventListener('keyup', function(event) {
			var inputControls = player.getSceneObject().getProperty('inputControls');
			switch (event.keyCode) {
				case 37: // Left
					delete inputControls.left;
					break;
				case 38: // Up
					delete inputControls.up;
					break;
				case 39: // Right
					delete inputControls.right;
					break;
				case 40: // Down
					delete inputControls.down;
					break;
			}
			player.getSceneObject().setProperty('inputControls',inputControls);
		}, false);
	}
};
