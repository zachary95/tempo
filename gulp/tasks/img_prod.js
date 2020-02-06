var gulp        = require('gulp');
var config      = require('../config.js');
var rev         = require('gulp-rev');
var rename      = require('gulp-rename');

// Images optimisation
gulp.task('img_prod', function() {

  for (var i = config.images.src.length - 1; i >= 0; i--) {

    gulp.src(config.images.src[i])
       .pipe(gulp.dest(config.images.build[i]));

  }

});
