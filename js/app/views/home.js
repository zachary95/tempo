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