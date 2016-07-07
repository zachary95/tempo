/**
 * SoundMaster
 * Manage WebAudioAPI and sample.
 *
 * @param {Object.bpm} options.bpm - Indicate the BPM of the style
 * @param {Object.sample} options.sample - Sample names to use
 * @constructor
 * @class SoundMaster
 * @since 0.1.0
 */
var SoundMaster = function ( options ) {
  this.bpm = options.bpm;

  this.beatInSeconds = 60 / this.bpm;

  this._sounds = {};

  this.genreSample = options.sample;

  this.soundBufferNode = {};

  this.lowpassNode = {};

  this.gainNode = {};

  this._lowpassState = false;

  this.currentVolume = .7;

  this.clickIsBeating = false;

  this.error = new ErrorHandler();

  this.soundsLoaded = new signals.Signal();

  this.elements = $(".sample__droppable");

  this.clickSample = {
    click: 'click.wav'
  };

  try {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    if ( this.audioContext ) {
      this._init();
    }

  } catch (e) {
    this.error.killTheApp('Web Audio API is not supported by your browser. Y u no keep it updated ?');
  }

};

/**
 * Init method, automatically called by constructor.
 *
 * @method _init
 * @private
 */
SoundMaster.prototype._init = function () {
  var self = this;

  var soundLoader = new SampleLoader(this.audioContext);

  var sampleToLoad = $.extend(this.clickSample, this.genreSample);

  this._attachEvents();

  soundLoader.preload(sampleToLoad)
    .then(function ( loadedSample ) {
      self._sounds = loadedSample;

      // Things to do when preloading suceeed
      self.soundsLoaded.dispatch(true);
    })
    .catch(function ( err ) {
      self.error.killTheApp('Preloading didn\'t made it.');
      self.soundsLoaded.dispatch(false);
    });

};

/**
 * Attach Events

 * @method _attachEvents
 * @private
 */
SoundMaster.prototype._attachEvents = function () {
  var self = this;

  // Play / Pause when Space Bar is pressed
  $('body')
    .keyup(function ( e ) {
      if ( e.keyCode === 32 ) {
        self.togglePause();
      } else if ( e.keyCode === 76 ) {
        self.toggleLowpass();
      }
    });

  $(window).on('blur', function () {
    self._windowBlurred();
  });

  $(window).on('focus', function () {
    self._windowFocused();
  });

  $('#volumeSlider').on('change', function ( e ) {
    self.setVolume(1 - e.target.value);
  });
};

/**
 * Play a preloaded sample
 *
 * @param name - Name of the sample
 * @param length - Beat length of the sample
 * @param click - If the sample need a click or play instantly
 * @param loop - Is the sample should be looped
 * @return {boolean}
 * @method playSample
 */
SoundMaster.prototype.playSample = function ( name, length, click, loop ) {
  if ( this.checkIfSampleIsPlaying(name) ) {
    return false;
  }

  return this._playSampleFromBuffer(name, length, click || true, loop || true);
};

/**
 * Remove a loaded sample
 *
 * @param {String} sampleName - Name of the sample
 * @return {boolean}
 * @method removeSample
 */
SoundMaster.prototype.removeSample = function ( sampleName ) {
  if ( ! this.checkIfSampleIsPlaying(sampleName) ) {
    return false;
  }

  return this._removeSampleFromBuffer(sampleName);
};

/**
 * Set the volume of one or all samples
 *
 * @param {Number} vol - Desired volume (max 1)
 * @param {String?} name - Sample name
 * @param {Number?} time - Time until volume should change in milliseconds.
 * @method setVolume
 */
SoundMaster.prototype.setVolume = function ( vol, name, time ) {
  if ( vol > 1 ) {
    throw new Error("You sure you're crazy enough to play that high ?");
  }

  var c = this.audioContext.currentTime;
  var timeToFade = c + (time || 0);

  if ( ! name ) {
    for ( var index in this.soundBufferNode ) {
      if ( this.soundBufferNode.hasOwnProperty(index) ) {
        this.gainNode[ index ].gain.setValueAtTime(this.currentVolume, timeToFade);
        this.gainNode[ index ].gain.linearRampToValueAtTime(vol, timeToFade + .2);

        this.currentVolume = vol;
      }
    }
  } else {
    this.gainNode[ name ].gain.setValueAtTime(this.currentVolume, timeToFade);
    this.gainNode[ name ].gain.linearRampToValueAtTime(vol, timeToFade + .2);
  }

};

/**
 * Check if sample is playing yet.
 *
 * @param soundName
 * @return {Boolean}
 * @method checkIfSampleIsPlaying
 */
SoundMaster.prototype.checkIfSampleIsPlaying = function ( soundName ) {
  var res;

  if ( Object.keys(this.soundBufferNode).length === 0 ) {
    res = false;
  }

  $.each(this.soundBufferNode, function ( key ) {
    if ( key === soundName ) res = true;
  });

  return res;
};

/**
 * Get the number of beat left in a mesure
 *
 * @param mesureLength - Number of beats in a mesure
 * @return {number}
 * @method getBeatLeftByMesure
 */
SoundMaster.prototype.getBeatLeftByMesure = function ( mesureLength ) {
  var cT = this.audioContext.currentTime;
  var bIS = this.beatInSeconds;

  return Math.ceil(mesureLength - (cT / bIS % mesureLength));
};

/**
 * Set / Unset a lowpass at 200Hz on all played sample
 *
 * @param forceState {Boolean?} - Force Set or Unset
 * @method toggleLowpass
 */
SoundMaster.prototype.toggleLowpass = function ( forceState ) {
  this._lowpassState = forceState || ! this._lowpassState;

  var c = this.audioContext.currentTime;
  var fDest = 200;

  for ( var index in this.lowpassNode ) {
    if ( this.lowpassNode.hasOwnProperty(index) ) {
      if ( this._lowpassState ) {
        this.lowpassNode[ index ].type = 'lowpass';
        this.lowpassNode[ index ].Q.value = 1.000;

        this.lowpassNode[ index ].frequency.setValueAtTime(44000, c);
        this.lowpassNode[ index ].frequency.linearRampToValueAtTime(fDest, c + .2);
      } else {
        this.lowpassNode[ index ].type = 'allpass';
      }
    }
  }
};

/**
 * Pause / Resume the whole AudioContext (everything).
 * Add or remove .soundIsPaused to body
 *
 * @method togglePause
 */
SoundMaster.prototype.togglePause = function () {
  if ( this.audioContext.state == "running" ) {
    this.audioContext.suspend();

    $('body').addClass('soundIsPaused');
  } else {
    this.audioContext.resume();

    $('body').removeClass('soundIsPaused');
  }
};

/**
 * Play a sound from buffer with full options.
 * Please refer to SoundMaster#playSound if you need this function
 *
 * @param name - Name of the sample in buffer array
 * @param beat {Number?} - Beat length of the sample
 * @param needClick {Boolean} - If the sample need a click or play instantly
 * @param loop {Boolean} - Is the sample should be looped
 * @method _playSampleFromBuffer
 * @private
 */
SoundMaster.prototype._playSampleFromBuffer = function ( name, beat, needClick, loop ) {
  var sB = this.audioContext.createBufferSource();
  var sF = this.audioContext.createBiquadFilter();
  var sG = this.audioContext.createGain();

  sF.type = "allpass";

  sB.connect(sF);
  sF.connect(sG);
  sG.connect(this.audioContext.destination);

  sB.buffer = this._sounds[ name ];
  sB.loop = loop || false;

  sG.gain.value = this.currentVolume;

  var res = this._getNextBeatInSeconds(beat || 4);

  if ( needClick ) {
    this._click(beat, name);
  }

  sB.start(res);

  this.soundBufferNode[ name ] = sB;
  this.lowpassNode[ name ] = sF;
  this.gainNode[ name ] = sG;

  this._soundPlayed(name);

  return true
};

/**
 * Remove sample from buffer
 * Please refer to SoundMaster#removeSound if you need to remove sample
 *
 * @param name
 * @method _removeSampleFromBuffer
 * @private
 */
SoundMaster.prototype._removeSampleFromBuffer = function ( name ) {
  var self = this;

  self.setVolume(0, name);

  setTimeout(function () {
    self.soundBufferNode[ name ].stop();
    delete self.soundBufferNode[ name ];
    return true;
  }, 400);

};

/**
 * Get the next beat in seconds.
 *
 * @param length - length of the beat
 * @return {Number}
 * @method _getNextBeatInSeconds
 * @private
 */
SoundMaster.prototype._getNextBeatInSeconds = function ( length ) {
  var cT = this.audioContext.currentTime;
  var bIS = this.beatInSeconds;
  var l = length || 8;

  return cT + (bIS * (l - (cT / bIS % l)));
};

/**
 * Play a click until sound is playing
 *
 * @param length - Length of the sample
 * @param soundName - Name of the sample
 * @method _click
 * @private
 */
SoundMaster.prototype._click = function ( length, soundName ) {
  var self = this;

  if ( this.clickIsBeating === false ) {
    this.clickIsBeating = true;

    var clickInterval = setInterval(function () {
      var currentMesure = self.getBeatLeftByMesure(length);

      if ( currentMesure <= 1 || currentMesure > 7 || ! self.checkIfSampleIsPlaying(soundName) ) {
        self.clickIsBeating = false;
        clearInterval(clickInterval);

      } else if ( self.audioContext.state == "running" ) {
        self._playSampleFromBuffer('click', 1);

      }

    }, this.beatInSeconds * 1000);
  }
};

/**
 * Fires when window is blurred
 *
 * @event onWindowBlurred
 * @method _windowBlurred
 * @private
 */
SoundMaster.prototype._windowBlurred = function () {
  this.toggleLowpass(true);
};

/**
 * Fires when window is focused
 *
 * @event onWindowFocused
 * @method _windowFocused
 * @private
 */
SoundMaster.prototype._windowFocused = function () {
  this.toggleLowpass(false);
};

/**
 * Hook when sound start playing
 *
 * @event onSoundPlaying
 * @param name - Sample name
 * @method _soundPlayed
 * @private
 */
SoundMaster.prototype._soundPlayed = function ( name ) {
  $('.sample-content')
    .find('[data-sample-id="' + name + '"]')
    .addClass('isPlaying');
};

/**
 * Set the volume to 0 and close audioContext.
 *
 * @method close
 */
SoundMaster.prototype.close = function () {
  var self = this;
  this.setVolume(0);

  setTimeout(function () {
    self.audioContext.close();
  }, 500);

};

SoundMaster.prototype.numberOfSamplePlayed = function () {
  return Object.keys(this.soundBufferNode).length;
};