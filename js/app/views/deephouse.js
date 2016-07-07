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