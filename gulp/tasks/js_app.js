var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var changed     = require('gulp-changed');
var config      = require('../config.js');
var concat      = require('gulp-concat');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

// Scripts
gulp.task('js_app', function()
{
  gulp.src(config.scripts.app)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(changed(config.scripts.dist))    
    .pipe(concat("app.js"))
    .pipe(gulp.dest(config.scripts.dist))
    .on('error', function(err) {
      console.log(err.message);
      this.emit('end');
    })
    .pipe(reload({stream:true, once: true}));
});
