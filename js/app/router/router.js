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