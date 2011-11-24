var hasTicked = 0;
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
			interval: 1/10,
			action: function(event){
				This._updatePlayerControls(rigidBox);
			}
		});
		rigidBox.getSceneObject().addEvent({
			id: "tick",
			interval: 5,
			action: function(event){
				rigidBox.applyForce([0,-3,0],[0,0,0]);
			}
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
		var keyMap = { //Arrow Keys
			37:'left',
			38:'up',
			39:'right',
			40:'down'
		};
		if(players.playerCount == 2){
			var keyMap = { //WASD
				65:'left',
				87:'up',
				68:'right',
				83:'down'
			};
		}

		window.addEventListener('keydown', function(event) {
			var inputControls = player.getSceneObject().getProperty('inputControls');
			if( typeof keyMap[event.keyCode] != 'undefined'){
				inputControls[keyMap[event.keyCode]] = 0;
			}
			player.getSceneObject().setProperty('inputControls',inputControls);
		}, false);
		window.addEventListener('keyup', function(event) {
			var inputControls = player.getSceneObject().getProperty('inputControls');
			if( typeof keyMap[event.keyCode] != 'undefined'){
				delete inputControls[keyMap[event.keyCode]];
			}
			player.getSceneObject().setProperty('inputControls',inputControls);
		}, false);
	}
};
