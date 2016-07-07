var gulp        = require('gulp');
var config      = require('../config.js');
var rev         = require('gulp-rev');
var imagemin    = require('gulp-imagemin');
var imageminJR  = require('imagemin-jpeg-recompress');
var pngquant    = require('imagemin-pngquant');
var rename      = require('gulp-rename');

// Images optimisation
gulp.task('img_prod', function() {

  for (var i = config.images.src.length - 1; i >= 0; i--) {
    
    gulp.src(config.images.src[i])
      .pipe(imagemin({
        progressive: true,
        interlaced: true,
        multipass: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [
          pngquant(),
          imageminJR({
            loops: 3,
            min: 90,
            max: 100,
            quality: 'veryhigh'
          })
        ]
      }))
      .pipe(gulp.dest(config.images.build[i]));

  }

});