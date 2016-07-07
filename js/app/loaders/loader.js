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