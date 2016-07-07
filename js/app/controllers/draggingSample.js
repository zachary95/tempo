/**
 * SampleDragging
 * bring GSAP's Draggable to the game and attach it on samples
 *
 * @param {SoundMaster} soundMaster - SoundMaster instance needed
 * @since 0.1.0
 * @class SampleDragging
 * @constructor
 */
var SampleDragging = function ( soundMaster ) {
  this.elements = $(".sample__droppable");
  this.dropArea = $(".the-scene");
  this.overlapThreshold = "99%";
  this.soundProcess = soundMaster;
  this.numberOfSampleDropped = 0;

  this.init();
};

SampleDragging.prototype.init = function () {
  this.attachDragging();
};

/**
 * Attach GSAP Draggable on sample
 *
 * @method attachDragging
 */
SampleDragging.prototype.attachDragging = function () {
  var self = this;

  Draggable.create(this.elements, {
    bounds: window,
    onPress: function () {
      if ( typeof self.origin == 'undefined' ) {
        self.origin = {
          x: this.x,
          y: this.y
        };
      }
    },
    onDrag: function () {
      $(this.target).addClass("isDragging");

      if ( this.hitTest(self.dropArea, self.overlapThreshold) ) {
        $(this.target).addClass("isInTheZone");
      } else {
        $(this.target).removeClass("isInTheZone");
      }
    },
    onRelease: function () {
      var sampleID = $(this.target).data('sampleId');
      var sampleLength = $(this.target).data('sampleLength');

      $(this.target).removeClass("isDragging");

      var hitTest = this.hitTest(self.dropArea, self.overlapThreshold);

      if ( hitTest ) {
        // SoundMaster is moving

        if ( ! $(this.target).hasClass('isDropped') ) {
          // SoundMaster is added
          self.numberOfSampleDropped ++;

          self.soundProcess.playSample(sampleID, sampleLength);

          $(this.target).addClass('isDropped');
        }

      } else if ( ! hitTest && $(this.target).hasClass('isDropped') ) {
        // SoundMaster is kicked
        self.numberOfSampleDropped --;

        $(this.target)
          .removeClass('isDropped')
          .removeClass('isPlaying');

        TweenLite.to(this.target, 0.2, {
          x: self.origin.x,
          y: self.origin.y
        });

        self.soundProcess.removeSample(sampleID, true);
      } else {
        TweenLite.to(this.target, 0.2, {
          x: self.origin.x,
          y: self.origin.y
        });
      }

      if ( self.numberOfSampleDropped > 0 ) {
        $(self.dropArea).addClass('hasSample');
      } else {
        $(self.dropArea).removeClass('hasSample');
      }
    }
  });
};
