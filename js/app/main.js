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
