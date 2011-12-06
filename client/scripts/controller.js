/*
* Left stick is up/down left/right for movement
* A button (shift for left player, control for right player) is speed boost. Warning, you lose a lot of control with it.
* */

var fastStart = false;//This will auto launch the game!

var gamepads = [];
var numKeyboards = 0;
var gamePlaying = false;

jQuery(document).ready(function(){
  window.addEventListener("MozGamepadConnected", function(e) {
    gamepads.push( new Input.Device(e.gamepad) );
    updateControllerCount();
  });

  function buttonHandler(event, pressed) {
    for(var i=0;i<gamepads.length;i++){
      if(pressed && gamepads[i].buttons.Start_Button){
        startGame();
      }
    }
  }
  window.addEventListener("MozGamepadButtonDown", function(e) { buttonHandler(e, true); }, false);
  window.addEventListener("MozGamepadButtonUp", function(e) { buttonHandler(e, false); }, false);

  if(fastStart){
    numKeyboards++;
    getNewKeyboardControl();
    updateControllerCount();
	  startGame();
  }
  window.addEventListener('keyup', function(event) {
    if(event.keyCode == 32){ //space
      if( numKeyboards<2){
        numKeyboards++;
        getNewKeyboardControl();
        updateControllerCount();
      }else{
        alert('Only 2 keyboard players are allowed at this time.');
      }
    }else if(event.keyCode == 13){
      if(gamepads.length > 0){
        startGame();
      }else{
        alert("You must have at least one player!");
      }
    }
  }, true);

  function getNewKeyboardControl(){
		var keyboardControlObj = {
      'axes' : {
        'Left_Stick_X':0,
        'Left_Stick_Y':0,
        'Right_Stick_X':0,
        'Right_Stick_Y':0
      },
      'buttons' : {
        'A_Button':0,
        'B_Button':0,
        'X_Button':0,
        'Y_Button':0,
        'Left_Stick_Button':0,
        'Right_Stick_Button':0,
        'Start_Button':0,
        'Back_Button':0,
        'Home_Button':0,
        'Pad_Up':0,
        'Pad_Down':0,
        'Pad_Left':0,
        'Pad_Right':0,
        'Left_Trigger_1':0,
        'Right_Trigger_1':0,
        'Left_Trigger_2':0,
        'Right_Trigger_2':0
      },
      'keyboard':true
    };
    var numKeyboards = 0;
    for(var i=0;i<gamepads.length;i++){
      if(gamepads[i].keyboard){
        numKeyboards++;
      }
    }
    if(numKeyboards == 0){
      var keyMap = { //WASD Keys
        65:{//left
          'type':'axes',
          'label':'Left_Stick_X',
          'value':-1
        },
        87:{//up
          'type':'axes',
          'label':'Left_Stick_Y',
          'value':-1
        },
        68:{//right
          'type':'axes',
          'label':'Left_Stick_X',
          'value':1
        },
        83:{//down
          'type':'axes',
          'label':'Left_Stick_Y',
          'value':1
        },
        13:{//enter
          'type':'buttons',
          'label':'Start_Button',
          'value':1
        },
        16:{//shift
          'type':'buttons',
          'label':'A_Button',
          'value':1
        }
      };
    }else if(numKeyboards == 1){
      var keyMap = { //Arrow Keys
        37:{//left
          'type':'axes',
          'label':'Left_Stick_X',
          'value':-1
        },
        38:{//up
          'type':'axes',
          'label':'Left_Stick_Y',
          'value':-1
        },
        39:{//right
          'type':'axes',
          'label':'Left_Stick_X',
          'value':1
        },
        40:{//down
          'type':'axes',
          'label':'Left_Stick_Y',
          'value':1
        },
        13:{//enter
          'type':'buttons',
          'label':'Start_Button',
          'value':1
        },
        17:{//ctrl
          'type':'buttons',
          'label':'A_Button',
          'value':1
        }
      };
    }

    window.addEventListener('keydown', function(event) {
			if( typeof keyMap[event.keyCode] != 'undefined'){
        var keyMapping = keyMap[event.keyCode];
				keyboardControlObj[keyMapping.type][keyMapping.label] = keyMapping.value;
			}
		}, false);
		window.addEventListener('keyup', function(event) {
			if( typeof keyMap[event.keyCode] != 'undefined'){
        var keyMapping = keyMap[event.keyCode];
				keyboardControlObj[keyMapping.type][keyMapping.label] = 0;
			}
		}, false);
    gamepads.push(keyboardControlObj);
    return keyboardControlObj
  }

  var kinectData ;

  DepthJS = {
    onKinectInit: function() {
      if(!kinectData){
        console.log('start?')
         kinectData = {
          'axes' : {
            'Left_Stick_X':0,
            'Left_Stick_Y':0,
            'Right_Stick_X':0,
            'Right_Stick_Y':0
          },
          'buttons' : {
            'A_Button':0,
            'B_Button':0,
            'X_Button':0,
            'Y_Button':0,
            'Left_Stick_Button':0,
            'Right_Stick_Button':0,
            'Start_Button':0,
            'Back_Button':0,
            'Home_Button':0,
            'Pad_Up':0,
            'Pad_Down':0,
            'Pad_Left':0,
            'Pad_Right':0,
            'Left_Trigger_1':0,
            'Right_Trigger_1':0,
            'Left_Trigger_2':0,
            'Right_Trigger_2':0
          },
        'keyboard':true
        };
        gamepads.push(kinectData);
        updateControllerCount();
      }else{
        console.log('kinect started') 
      }
       
  },
    onMove: function(x, y, z) {

      //update for percentage based data
      kinectData['axes']['Left_Stick_X'] = ( x / 50 - 1);
      kinectData['axes']['Left_Stick_Y'] = ( x / 50 - 1);

      if( z < 50 ){
        kinectData['buttons']['A_Button'] = 1;
      }else{
        kinectData['buttons']['Start_Button'] = 1;
      }
      console.log('onmove',kinectData);
      
      socket.emit('kinectPos', kinectData);
    }
  };

  //socket stuff
  var socket = io.connect('http://localhost:80');

  function startGame(){
    if(!gamePlaying){
      gamePlaying = true;
      jQuery('.instructions').html("Starting game with "+gamepads.length+" players.");
      jQuery('.playerDisplay').html('');
      setTimeout('glydrs()',100);
    }
  }

  function updateControllerCount(){
    jQuery('.playerCount').html(gamepads.length);
  }
});