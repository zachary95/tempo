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