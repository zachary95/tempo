var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var concat      = require('gulp-concat');
var config      = require('../config.js');
var uglify      = require('gulp-uglify');

// Scripts vendor
gulp.task('js_libs', function()
{
  return gulp.src(config.scripts.vendors)
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(concat("vendor.js"))
        // .pipe(uglify())
        .pipe(gulp.dest( config.scripts.dist ))
        .on('error', function(err) {
          console.log(err);
        });
});