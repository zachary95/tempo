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