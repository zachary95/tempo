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