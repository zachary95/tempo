/**
 * SampleLoader
 * Instanciate WebAudioAPI and manage sample.
 *
 * @param {Object} audioCtx - Current audio context
 * @param {String?} samplePath - Base path for sample
 * @constructor
 * @class SampleLoader
 * @since 0.1.0
 */
var SampleLoader = function ( audioCtx, samplePath ) {
  this.audioContext = audioCtx;
  this.soundPath = samplePath || '../sounds/';
};

/**
 * Preload a bunch of sample
 *
 * @method preload
 * @param {Array} sampleToLoad - sample name
 * @return {Promise}
 */
SampleLoader.prototype.preload = function ( sampleToLoad ) {
  var loadedSounds = [];
  var self = this;

  return new Promise(function ( resolve, reject ) {
    async.forEachOf(sampleToLoad, function ( file, key, callback ) {

      self._getDecodedAudio(self.soundPath + file)
        .then(function ( data ) {
          loadedSounds[ key ] = data;

          callback();
        })
        .catch(function ( err ) {
          console.error(err);

          callback(err);
        });

    }, function ( err ) {
      if ( err ) {
        console.error(err);
        reject(err);
      }

      resolve(loadedSounds);
    });

  });
};

/**
 * Get and Decode sample
 *
 * @method _getDecodedAudio
 * @param {String} url_buffer
 * @returns {Promise}
 * @private
 */
SampleLoader.prototype._getDecodedAudio = function ( url_buffer ) {
  var self = this;

  return new Promise(function ( resolve, reject ) {
    console.log('Loading : ' + url_buffer);

    var request = new XMLHttpRequest();

    request.open('GET', self.soundPath + url_buffer, true);
    request.responseType = 'arraybuffer';

    request.onload = function () {
      // Decoding audio
      self._decodeAudio(request.response,
        function ( buffer ) {
          console.log(url_buffer + ' Loaded.');
          resolve(buffer);
        },
        function ( err ) {
          reject(err);
        }
      );

    };

    request.send();
  });
};

/**
 * Decode audio data
 *
 * @method _decodeAudio
 * @param data - binaries to decode
 * @param {Function} success - function to call on success
 * @param {Function} failure - function to call on failure
 * @private
 */
SampleLoader.prototype._decodeAudio = function ( data, success, failure ) {
  this.audioContext.decodeAudioData(data)
    .then(function ( buffer ) {
      success(buffer);
    }, function ( err ) {
      failure(err);
    });
};