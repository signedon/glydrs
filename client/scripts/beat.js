var beat = {
	kick_det: '',
  init:function(video){
  	var channels          = 0
      , rate              = 0
      , frameBufferLength = 0
      , bufferSize        = 0
      , m_BeatTimer       = 0
      , m_BeatCounter     = 0
      , ftimer            = 0
      , clearClr          = [0,0,1]
      , signal            = new Float32Array(bufferSize)
      , fft               = null
      , beatd
      , vu
      ;
    var This = this;

  	beatd = new BeatDetektor();    
    vu = new BeatDetektor.modules.vis.VU();
    this.kick_det = new BeatDetektor.modules.vis.BassKick();
    channels          = video.mozChannels;
    rate              = video.mozSampleRate;
    frameBufferLength = video.mozFrameBufferLength;
    bufferSize        = frameBufferLength/channels;
    fft               = new FFT(bufferSize,rate);
    signal            = new Float32Array(bufferSize);

    video.addEventListener('MozAudioAvailable',audioAvalible,false);


    function audioAvalible(event){
      var fb = event.frameBuffer;
      
      for( var i = 0, fbl = bufferSize; i < fbl; i++ ){
        signal[i] = ( fb[2*i] + fb[2*i*1] ) / 2;
      } 

      fft.forward(signal); 

      timestamp = event.time;

      beatd.process( timestamp, fft.spectrum );

      if(beatd.win_bpm_int_lo){
        m_BeatTimer += beatd.last_update;
        if(m_BeatTimer > (60.0/beatd.win_bpm_int_lo)){
          m_BeatTimer -= (60.0/beatd.win_bpm_int_lo);
          clearClr[0] = 0.5+Math.random()/2;
          clearClr[1] = 0.5+Math.random()/2;
          clearClr[2] = 0.5+Math.random()/2;
          m_BeatCounter++;
        }

      }

      ftimer += beatd.last_update;

      if (ftimer > 1.0/30.0){
        vu.process(beatd,ftimer);
      }

      This.kick_det.process(beatd);

    };
  },
  isBeat:function(){
    return this.kick_det.is_kick;
  }
}