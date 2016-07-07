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