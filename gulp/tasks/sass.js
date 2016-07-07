var gulp        = require('gulp');
var browserSync = require('browser-sync');
var changed     = require('gulp-changed');
var config      = require('../config.js');
var plumber     = require('gulp-plumber');
var sass        = require('gulp-sass');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

// Watch SASS
gulp.task('sass', function()
{
  return gulp.src( config.styles.sass )
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(changed( config.styles.dist ))
        .pipe(sass({
          indentedSyntax: false
        }))
        .on('error', function(err) {
          console.log(err);
        })
        .pipe(gulp.dest( config.styles.dist ))
        .pipe(reload({stream: true}));
});