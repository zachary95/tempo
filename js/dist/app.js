var View = function(){

	// Constructor
	this.loaded = false;
	this.container = app.mainContainer;

	this.domElem = null;

	this.domId = this.id;

	if ( typeof this.templateId == 'undefined' ){
		this.templateId = this.id;
	}

	if ( typeof this.datas == 'undefined' ){
		this.datas = app.datas;
	}

	// Create useful signals
	this._onViewLoadComplete = new signals.Signal();

	this._onAnimateIn = new signals.Signal();
	this._onAnimateOut = new signals.Signal();

	this.images = {};

	// Init view
	this.init();

};

// Init view
View.prototype.init = function() {
	
	this.template();

};

// Template view
View.prototype.template = function() {
	
	this.dom = app.template( this.templateId, this.datas );

};

// Load view
View.prototype.load = function() {
	
	// If there is something to load
	if ( app.getObjectLength( this.images ) > 0 ){

		// Create loader
		this.loader = new Loader();

		// Listen to onComplete event
		this.loader._onComplete.add( this.onLoadComplete, this );

		// Add images to the queue
		this.loader.addImages( this.images );

		// Start loader
		this.loader.start();

	} else {

		// If nothing to load we go directly to onLoadComplete
		this.onLoadComplete();

	}

};

// Once the view is loaded
View.prototype.onLoadComplete = function() {
	
	// Remove listener if we used the loader
	if ( this.loader ) this.loader._onComplete.remove( this.onLoadComplete, this );

	// Set the view as loaded
	this.loaded = true;

	// Dispatch on view load complete event
	this._onViewLoadComplete.dispatch();

};

// Animate view in
View.prototype.animateIn = function() {
	
	// Remove on view load complete event
	this._onViewLoadComplete.remove( this.animateIn, this );

	// If the view is not loaded yet
	if ( !this.loaded ){

		// Listen to the on view load complete event
		// for going back to animateIn once loaded
		this._onViewLoadComplete.add( this.animateIn, this );

		// Load it
		this.load();

		return;

	}
	
	// Append dom to the container
	this.container.append( this.dom );

	// Set selectors
	this.setSelectors();

	// Resize view
	this.resize();

	// Bind view events
	this.bind();

};

// Set selectors
View.prototype.setSelectors = function() {
	
	// Set domElem
	this.domElem = this.container.find('#' + this.domId);

	// Hide it
	this.domElem.hide();

};

// Resize view
View.prototype.resize = function() {

};

// Update
View.prototype.update = function() {

};

// Bind view events
View.prototype.bind = function() {
	
	// Bind onUpdate = requestAnimationFrame event
	app._onUpdate.add(this.update, this);

	// Bind resize event
	app._onResize.add(this.resize, this);

};

// Once view is animated in
View.prototype.onAnimateIn = function() {
	
	// Dispatch onAnimateIn event
	this._onAnimateIn.dispatch();

};

// Animate view out
View.prototype.animateOut = function() {
	
	// Unbind view events
	this.unbind();

};

// Unbind view events
View.prototype.unbind = function() {
	
	// Unbind onUpdate
	app._onUpdate.remove(this.update, this);

	// Unbind onResize
	app._onResize.remove(this.resize, this);

};

// Once view is animated out
View.prototype.onAnimateOut = function() {
	
	// Remove domElem
	this.domElem.remove();

	// Dispatch onAnimateOut event
	this._onAnimateOut.dispatch();

};
"use strict";

function App(){

	this.window = $(window);

	this.mainContainer = $('main');

	// Signals
	this._onResize = new signals.Signal();
	this._onUpdate = new signals.Signal();

	// Datas
	this.datas = null;

	// Datas path
	this.datasPath = '/assets/json/';

	// Save templates
	this.templates = window.templates;

	// Set lang
	this.lang = 'fr';

	// Init
	this.init();

};

// Init app
App.prototype.init = function() {
	
	// Load datas
	this.loadDatas();

};

// Load datas
App.prototype.loadDatas = function() {

	// Save context
	var self = this;

	// Get datas
	$.getJSON( this.datasPath + this.lang + '.json', function(response){

		// Save datas
		self.datas = response;

		// Once datas are loaded
		self.onDatasLoaded();

	});

};

// Once datas are loaded
App.prototype.onDatasLoaded = function() {

	// Bind common events
	this.bind();

	// Create router
	this.router = new Router();

	// Create viewController
	this.viewController = new ViewController();

	// Create mainLoader
	this.mainLoader = new MainLoader();

	// Listen mainLoader for onAnimateIn event
	this.mainLoader._onAnimateIn.add(this.onMainLoaderAnimateIn, this);

	// Start loading common assets
	this.mainLoader.animateIn();

};

// Bind common events
App.prototype.bind = function() {
	
	// Bind resize event
	this.window.on("resize", $.proxy(this.resize, this));

};

// Resize
App.prototype.resize = function() {
	
	// Save new window width & height
	this.w = this.window.width();
	this.h = this.window.height();

	// Dispatch resize event
	this._onResize.dispatch();

};

// Update
App.prototype.update = function() {
		
	// Dispatch onUpdate event at every requestAnimationFrame
	this._onUpdate.dispatch();

};

// Template
App.prototype.template = function(templateId, datas) {

	// Return compiled template from templateId & datas
	return this.templates[ templateId ]( datas );

};

App.prototype.onMainLoaderAnimateIn = function() {
	
	// Remove listener
	this.mainLoader._onAnimateIn.remove(this.onMainLoaderAnimateIn, this);

	// Bind viewController
	this.viewController.bind();

	// Init router
	this.router.init();

};

App.prototype.getObjectLength = function( obj ){

  return Object.size(obj);

};

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/**
 * SampleDragging
 * bring GSAP's Draggable to the game and attach it on samples
 *
 * @param {SoundMaster} soundMaster - SoundMaster instance needed
 * @since 0.1.0
 * @class SampleDragging
 * @constructor
 */
var SampleDragging = function ( soundMaster ) {
  this.elements = $(".sample__droppable");
  this.dropArea = $(".the-scene");
  this.overlapThreshold = "99%";
  this.soundProcess = soundMaster;
  this.numberOfSampleDropped = 0;

  this.init();
};

SampleDragging.prototype.init = function () {
  this.attachDragging();
};

/**
 * Attach GSAP Draggable on sample
 *
 * @method attachDragging
 */
SampleDragging.prototype.attachDragging = function () {
  var self = this;

  Draggable.create(this.elements, {
    bounds: window,
    onPress: function () {
      if ( typeof self.origin == 'undefined' ) {
        self.origin = {
          x: this.x,
          y: this.y
        };
      }
    },
    onDrag: function () {
      $(this.target).addClass("isDragging");

      if ( this.hitTest(self.dropArea, self.overlapThreshold) ) {
        $(this.target).addClass("isInTheZone");
      } else {
        $(this.target).removeClass("isInTheZone");
      }
    },
    onRelease: function () {
      var sampleID = $(this.target).data('sampleId');
      var sampleLength = $(this.target).data('sampleLength');

      $(this.target).removeClass("isDragging");

      var hitTest = this.hitTest(self.dropArea, self.overlapThreshold);

      if ( hitTest ) {
        // SoundMaster is moving

        if ( ! $(this.target).hasClass('isDropped') ) {
          // SoundMaster is added
          self.numberOfSampleDropped ++;

          self.soundProcess.playSample(sampleID, sampleLength);

          $(this.target).addClass('isDropped');
        }

      } else if ( ! hitTest && $(this.target).hasClass('isDropped') ) {
        // SoundMaster is kicked
        self.numberOfSampleDropped --;

        $(this.target)
          .removeClass('isDropped')
          .removeClass('isPlaying');

        TweenLite.to(this.target, 0.2, {
          x: self.origin.x,
          y: self.origin.y
        });

        self.soundProcess.removeSample(sampleID, true);
      } else {
        TweenLite.to(this.target, 0.2, {
          x: self.origin.x,
          y: self.origin.y
        });
      }

      if ( self.numberOfSampleDropped > 0 ) {
        $(self.dropArea).addClass('hasSample');
      } else {
        $(self.dropArea).removeClass('hasSample');
      }
    }
  });
};

/**
 * ErrorHandler
 * Handle errors
 *
 * @class ErrorHandler
 * @since 0.1.0
 * @constructor
 */
var ErrorHandler = function() {
  this.errorPane = $('.errorPane');
  this.errorMsg  = this.errorPane.find('.errorPane__message');
};

/**
 * It just BLOW THE APP AWAY AND DISPLAY A BLACK ON WHITE ERROR MESSAGE.
 *
 * @method killTheApp
 * @param {String} errMsg - Message to display
 */
ErrorHandler.prototype.killTheApp = function(errMsg) {
  this.errorMsg.html(errMsg);
  this.errorPane.addClass('isShown');

  $('#main').remove();
};
/**
 * SampleLoader
 * Instanciate WebAudioAPI and manage sample.
 *
 * @param {Object} audioCtx - Current audio context
 * @param {String?} samplePath - Base path for sample
 * @constructor
 * @class SampleLoader
 * @since 0.1.0
 */
var SampleLoader = function ( audioCtx, samplePath ) {
  this.audioContext = audioCtx;
  this.soundPath = samplePath || '../sounds/';
};

/**
 * Preload a bunch of sample
 *
 * @method preload
 * @param {Array} sampleToLoad - sample name
 * @return {Promise}
 */
SampleLoader.prototype.preload = function ( sampleToLoad ) {
  var loadedSounds = [];
  var self = this;

  return new Promise(function ( resolve, reject ) {
    async.forEachOf(sampleToLoad, function ( file, key, callback ) {

      self._getDecodedAudio(self.soundPath + file)
        .then(function ( data ) {
          loadedSounds[ key ] = data;

          callback();
        })
        .catch(function ( err ) {
          console.error(err);

          callback(err);
        });

    }, function ( err ) {
      if ( err ) {
        console.error(err);
        reject(err);
      }

      resolve(loadedSounds);
    });

  });
};

/**
 * Get and Decode sample
 *
 * @method _getDecodedAudio
 * @param {String} url_buffer
 * @returns {Promise}
 * @private
 */
SampleLoader.prototype._getDecodedAudio = function ( url_buffer ) {
  var self = this;

  return new Promise(function ( resolve, reject ) {
    console.log('Loading : ' + url_buffer);

    var request = new XMLHttpRequest();

    request.open('GET', self.soundPath + url_buffer, true);
    request.responseType = 'arraybuffer';

    request.onload = function () {
      // Decoding audio
      self._decodeAudio(request.response,
        function ( buffer ) {
          console.log(url_buffer + ' Loaded.');
          resolve(buffer);
        },
        function ( err ) {
          reject(err);
        }
      );

    };

    request.send();
  });
};

/**
 * Decode audio data
 *
 * @method _decodeAudio
 * @param data - binaries to decode
 * @param {Function} success - function to call on success
 * @param {Function} failure - function to call on failure
 * @private
 */
SampleLoader.prototype._decodeAudio = function ( data, success, failure ) {
  this.audioContext.decodeAudioData(data)
    .then(function ( buffer ) {
      success(buffer);
    }, function ( err ) {
      failure(err);
    });
};
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
var ViewController = function(){

	this.views = {};

	this.isBusy = false;

	this._onViewLoadComplete = new signals.Signal();

	this._onNavigate = new signals.Signal();

	this.prevView = null;
	this.currentView = null;
	this.nextView = null;

	this.init();

};

// Init views
ViewController.prototype.init = function() {

	// Create all views
	this.views = {
		'home': new Home(),
		'genre': new Genre(),
		'drumandbass': new Drumandbass(),
		'dubstep' : new Dubstep(),
		'future' : new Future(),
		'deephouse' : new Deephouse()
	};

};

// Bind
ViewController.prototype.bind = function() {

	// Listen to the router for navigate event
	app.router._onNavigate.add( this.onNavigate, this );

};

// On navigate
ViewController.prototype.onNavigate = function(e) {

	var view = e.view;

	// Go to next view
	this.goTo( this.views[ view ] );

};

// Go to a view
ViewController.prototype.goTo = function( nextView ) {

	// If same view as current, stop it
	if ( nextView == this.currentView ){
		this.isBusy = false;
		return;
	}

	// Set busy state
	this.isBusy = true;

	// Save next view
	this.nextView = nextView;

	// If next view is not loaded yet
	if ( !this.nextView.loaded ){

		// Listen to on view load complete event
		this.nextView._onViewLoadComplete.add( this.onViewLoadComplete, this );

		// Load next view
		this.nextView.load();

		return;

	}

	// Remove on view load complete listener
	this.nextView._onViewLoadComplete.remove( this.onViewLoadComplete, this );

	// If it's the first view to be shown
	if ( this.currentView == null ){

		// Listen to onAnimateIn event
		this.nextView._onAnimateIn.add(this.onViewAnimateIn, this);

		// Animate next view in
		this.nextView.animateIn();

		// Dispatch navigation event
		this._onNavigate.dispatch({
			from: null,
			to: this.nextView
		});

		// Save prev view
		this.prevView = this.currentView;

		// Save new current view
		this.currentView = this.nextView;

		// Reset next view
		this.nextView = null;

		return;

	} else {

		// Animate out current view
		this.currentView.animateOut( this.nextView );

		// Listen to onAnimateIn event
		this.nextView._onAnimateIn.add( this.onViewAnimateIn, this );

		// Animate in next view
		this.nextView.animateIn( this.currentView );

		// Dispatch navigation event
		this._onNavigate.dispatch({
			from: this.currentView,
			to: this.nextView
		});

		// Save prev view
		this.prevView = this.currentView;

		// Save new current view
		this.currentView = this.nextView;

		// Reset next view
		this.nextView = null;

	}

};

ViewController.prototype.onViewLoadComplete = function(e) {

	this.nextView._onViewLoadComplete.remove( this.onViewLoadComplete );

	this._onViewLoadComplete.dispatch(e);

	if ( this.currentView == null ){

		app.mainLoader.animateOut();

	}

	this.goTo( this.nextView );

};

// Once next view has been animated in
ViewController.prototype.onViewAnimateIn = function() {

	// Remove listener
	this.currentView._onAnimateIn.remove( this.onViewAnimateIn, this );

	// Set not busy anymore
	this.isBusy = false;

	// Bind navigation links again in case of new ones
	this.bindNavLinks();

};

// Bind navigation links
ViewController.prototype.bindNavLinks = function() {

	$('a').not('[target="_blank"]').off('click').on('click', $.proxy(this.onNavLinkClick, this));

};

// On nav link click
ViewController.prototype.onNavLinkClick = function(e) {

	// Prevent default link behavior
	e.preventDefault();

	// Get url of clicked link
	var url = $(e.currentTarget).attr('href');

	// Router, YOU HAVE ONE JOB.
	if ( !this.isBusy && url.indexOf("mailto") > -1 ) {

		window.location.href = url;

	}
	// If navigation is not busy and url is a valid link
	else if ( !this.isBusy && url != '#' ){

		// Navigate to the new url
		app.router.navigate( url );

	}

};
var Loader = function(xhr, maxConnections){

	this._onComplete = new signals.Signal();

	this.images = {};

	this.isComplete = false;

	this.fileTypes = {
		IMAGE: createjs.AbstractLoader.IMAGE,
		VIDEO: createjs.AbstractLoader.VIDEO,
		SOUND: createjs.AbstractLoader.SOUND,
		JS: createjs.AbstractLoader.JAVASCRIPT,
		JSON: createjs.AbstractLoader.JSON		
	};

	this.useXHR = false;
	this.maxConnections = 50;

	if ( xhr ) this.useXHR = xhr;
	if ( maxConnections ) this.maxConnections = maxConnections;

	this.init();

};

Loader.prototype.init = function() {

	if ( !this.queue ){

		this.queue = new createjs.LoadQueue( this.useXHR );

	}

	this.queue.on('complete', $.proxy(this.onQueueComplete, this));

};

Loader.prototype.onQueueComplete = function() {

	this.isComplete = true;

	this._onComplete.dispatch();

};

Loader.prototype.addImages = function( images ) {

	var self = this;

	$.each( images, function(id, img){

		self.queue.loadFile({
			id: id,
			src: img,
			type: self.fileTypes.IMAGE
		}, false);

	});

};

Loader.prototype.start = function() {

	this.queue.load();

};

Loader.prototype.pause = function() {
	
	this.queue.setPaused( true );

};

Loader.prototype.resume = function() {
	
	this.queue.setPaused( false );

};

Loader.prototype.clearQueue = function() {
	
	this.queue.removeAll();

};
var MainLoader = function(){

	this.id = 'loader';

	View.apply(this, arguments);

	this.images = {
		'logo': 'img/logo.png'
	};
};

MainLoader.prototype = Object.create(View.prototype);

MainLoader.prototype.animateIn = function() {

	View.prototype.animateIn.call(this);

	var self = this;

	if ( !this.loaded ) return;

	this.domElem.fadeIn(function(){
		self.onAnimateIn();
	});

};

MainLoader.prototype.animateOut = function() {
	
	View.prototype.animateOut.call(this);

	var self = this;

	this.domElem.fadeOut(function(){
		self.onAnimateOut();
	});

};
var Deephouse = function () {

  this.id = 'deephouse';

  View.apply(this, arguments);

};

Deephouse.prototype = Object.create(View.prototype);

Deephouse.prototype.animateOut = function () {

  View.prototype.animateOut.call(this);

  var self = this;

  this.soundProcess.close();

  this.domElem.fadeOut(250, function () {
    self.onAnimateOut();
  });

};

Deephouse.prototype.animateIn = function () {

  View.prototype.animateIn.call(this);

  var self = this;

  if (!this.loaded) return;

  this.soundProcess = new SoundMaster(
    {
      bpm    : 124,
      sample : {
        drum1: 'Deephouse - Drumkit 1.mp3',
        drum2: 'Deephouse - Drumkit 2.mp3',
        drum3: 'Deephouse - Drumkit 3.mp3',

        synth1: 'Deephouse - Synth 1.mp3',
        synth2: 'Deephouse - Synth 2.mp3',
        synth3: 'Deephouse - Synth 3.mp3',

        fx1: 'Deephouse - FX Bass Drop.mp3',
        fx2: 'Deephouse - FX Voice.mp3',
        fx3: 'Deephouse - FX Sax.mp3'
      }
    }
  );

  var drag = new SampleDragging(this.soundProcess);

  this.soundProcess.soundsLoaded.add(function () {
    self.domElem.fadeIn(200);
    $('#loader').remove();

    self.onAnimateIn();
  });

}; //end animateIn
var Drumandbass = function () {

    this.id = 'drumandbass';

    View.apply(this, arguments);

};

Drumandbass.prototype = Object.create(View.prototype);

Drumandbass.prototype.animateIn = function () {

    View.prototype.animateIn.call(this);

    var self = this;

    if (!this.loaded) return;

    this.soundProcess = new SoundMaster(
      {
          bpm    : 172,
          sample : {
              drum1: 'DnB - DRUM 1.mp3',
              drum2: 'DnB - DRUM 2.mp3',
              drum3: 'DnB - DRUM 3.mp3',

              synth1: 'DnB - SYNTH 1.mp3',
              synth2: 'DnB - SYNTH 2.mp3',
              synth3: 'DnB - SYNTH 3.mp3',

              fx1: 'DnB - Downlifter.mp3',
              fx2: 'DnB - Elbows.mp3',
              fx3: 'DnB - Splitbread.mp3'
          }
      }
    );

    var drag = new SampleDragging(this.soundProcess);

    this.soundProcess.soundsLoaded.add(function () {
        self.domElem.fadeIn(200);
        $('#loader').remove();

        self.onAnimateIn();
    });

};

Drumandbass.prototype.animateOut = function() {

    View.prototype.animateOut.call(this);

    var self = this;

    this.soundProcess.close();

    this.domElem.fadeOut(250, function(){
        self.onAnimateOut();
    });
};
var Dubstep = function () {

  this.id = 'dubstep';

  View.apply(this, arguments);
};

Dubstep.prototype = Object.create(View.prototype);

Dubstep.prototype.animateIn = function () {

  View.prototype.animateIn.call(this);

  var self = this;

  if ( ! this.loaded ) return;


  this.soundProcess = new SoundMaster(
    {
      bpm: 140,
      sample: {
        drum1: 'Dubstep Drumkit 1.mp3',
        drum2: 'Dubstep Drumkit 2.mp3',
        drum3: 'Dubstep Drumkit 3.mp3',

        synth1: 'Dubstep Gnalz Growley.mp3',
        synth2: 'Dubstep Goat Growl.mp3',
        synth3: 'Dubstep The Hollow Point.mp3',

        fx1: 'Dubstep Praszezaror.mp3',
        fx2: 'Dubstep The Riff.mp3',
        fx3: 'Dubstep What.mp3'
      }
    }
  );

  var drag = new SampleDragging(this.soundProcess);

  this.soundProcess.soundsLoaded.add(function () {
    self.domElem.fadeIn(200);
    $('#loader').remove();

    self.onAnimateIn();
  });

}; //end animateIn

Dubstep.prototype.animateOut = function () {

  View.prototype.animateOut.call(this);

  var self = this;

  this.soundProcess.close();

  this.domElem.fadeOut(250, function () {
    self.onAnimateOut();
  });

};
var Future = function () {

  this.id = 'future';

  View.apply(this, arguments);

};

Future.prototype = Object.create(View.prototype);

Future.prototype.animateIn = function () {

  View.prototype.animateIn.call(this);

  var self = this;

  if (!this.loaded) return;

  this.soundProcess = new SoundMaster({
    bpm    : 86,
    sample : {
      drum1: 'Future Drumkit 1.mp3',
      drum2: 'Future Drumkit 2.mp3',
      drum3: 'Future Drumkit 3.mp3',

      synth1: 'Future Synth 1.mp3',
      synth2: 'Future Synth 2.mp3',
      synth3: 'Future Synth 3.mp3',

      fx1: 'Future Fall Down.mp3',
      fx2: 'Future Wololo.mp3',
      fx3: 'Future Signal.mp3'
    }
  });

  var drag = new SampleDragging(this.soundProcess);

  this.soundProcess.soundsLoaded.add(function () {
    self.domElem.fadeIn(200);
    $('#loader').remove();

    self.onAnimateIn();
  });


};

Future.prototype.animateOut = function () {

  View.prototype.animateOut.call(this);

  var self = this;

  this.soundProcess.close();

  this.domElem.fadeOut(250, function () {
    self.onAnimateOut();
  });

};
var Genre = function () {

    this.id = 'genre';

    View.apply(this, arguments);

    this.images = {
        'genre-background': 'img/home-bg.jpg'
    };

};

Genre.prototype = Object.create(View.prototype);

Genre.prototype.animateIn = function () {

    View.prototype.animateIn.call(this);

    var self = this;

    if (!this.loaded) return;

    this.domElem.fadeIn(250, function () {
        self.onAnimateIn();
    });

};

Genre.prototype.animateOut = function () {

    View.prototype.animateOut.call(this);

    var self = this;

    this.domElem.fadeOut(250, function () {
        self.onAnimateOut();
    });

};
var Home = function () {

    this.id = 'home';

    View.apply(this, arguments);

    this.images = {
        'home-background': 'img/home-bg.jpg'
    };

};

Home.prototype = Object.create(View.prototype);

Home.prototype.animateIn = function () {

    View.prototype.animateIn.call(this);

    var self = this;

    if (!this.loaded) return;

    this.domElem.fadeIn(500, function () {

        self.onAnimateIn();

    });

    // Animation Home
    $("#home").find(".logo__link").delay(500).animate({
        opacity: 1
    }, 800, function () {
        $(".home__headline").animate({
            opacity: 1
        }, 500, function () {
            $('.home__button').animate({
                opacity: 1
            }, 300, function () {
                $('.home__tuto').animate({
                    opacity: 1
                }), 100
            });
        });
    });


};


Home.prototype.animateOut = function () {

    View.prototype.animateOut.call(this);

    var self = this;

    this.domElem.fadeOut(500, function () {
        self.onAnimateOut();
    });

};
var Router = function(){

	// Create navigate event
	this._onNavigate = new signals.Signal();

	// Create routes
	this.createRoutes();

};

// Init router
Router.prototype.init = function() {

	var self = this;

	// Bind HistoryJS state change
	History.Adapter.bind(window, "statechange", function(e){

		self.onStateChange(e);

	});

	// Parse first token
	this.onStateChange();

};

// On state change
Router.prototype.onStateChange = function(e) {
	
	// Get token
	var token = this.getToken();

	// Parse token - test if it matches a route
	crossroads.parse( token );

};

// Create routes
Router.prototype.createRoutes = function() {

	var self = this;

	// Homepage
	crossroads.addRoute( '', function(){

		// Dispatch navigate event
		self._onNavigate.dispatch({
			view: 'home'
		});

	});

	// Genre
	crossroads.addRoute( '/genre' , function(){

		self._onNavigate.dispatch({
			view: 'genre'
		});

	});

	// Drum and Bass
	crossroads.addRoute( '/drumandbass' , function(){

		self._onNavigate.dispatch({
			view: 'drumandbass'
		});

	});
	
	// Dubstep
	crossroads.addRoute( '/dubstep' , function(){

		self._onNavigate.dispatch({
			view: 'dubstep'
		});

	});
	
	// Future
	crossroads.addRoute( '/future' , function(){

		self._onNavigate.dispatch({
			view: 'future'
		});

	});
	
	// Deephouse
	crossroads.addRoute( '/deephouse' , function(){

		self._onNavigate.dispatch({
			view: 'deephouse'
		});

	});
	
};

// Navigate
Router.prototype.navigate = function( href ) {
	
	History.pushState(null, null, href);

};

// Get token from History hash
Router.prototype.getToken = function() {
	
	var token = History.getState().hash;

	if ( token.indexOf('?') != -1 ){

		var tokenSplit = token.split('?');
		return tokenSplit[0];

	} else {

		return token;

	}

};