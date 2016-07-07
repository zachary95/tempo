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