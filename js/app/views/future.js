var Future = function () {

  this.id = 'future';

  View.apply(this, arguments);

};

Future.prototype = Object.create(View.prototype);

Future.prototype.animateIn = function () {

  View.prototype.animateIn.call(this);

  var self = this;

  if (!this.loaded) return;

  this.soundProcess = new SoundMaster({
    bpm    : 86,
    sample : {
      drum1: 'Future Drumkit 1.mp3',
      drum2: 'Future Drumkit 2.mp3',
      drum3: 'Future Drumkit 3.mp3',

      synth1: 'Future Synth 1.mp3',
      synth2: 'Future Synth 2.mp3',
      synth3: 'Future Synth 3.mp3',

      fx1: 'Future Fall Down.mp3',
      fx2: 'Future Wololo.mp3',
      fx3: 'Future Signal.mp3'
    }
  });

  var drag = new SampleDragging(this.soundProcess);

  this.soundProcess.soundsLoaded.add(function () {
    self.domElem.fadeIn(200);
    $('#loader').remove();

    self.onAnimateIn();
  });


};

Future.prototype.animateOut = function () {

  View.prototype.animateOut.call(this);

  var self = this;

  this.soundProcess.close();

  this.domElem.fadeOut(250, function () {
    self.onAnimateOut();
  });

};