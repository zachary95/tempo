var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var config      = require('../config.js');
var pkg         = require('../../package.json');
var header      = require('gulp-header');
var minifyCSS   = require('gulp-minify-css');
var rev         = require('gulp-rev');
var sass        = require('gulp-sass');
var rename      = require('gulp-rename');

var banner = [
  '/**',
  ' * <%= pkg.name %>',    
  ' * <%= pkg.author %>',
  ' * <%= pkg.client %>',
  ' * @version v<%= pkg.version %>',
  ' */',
  '', ''
].join('\n');

// Build styles for production
gulp.task('sass_prod', function()
{

  return gulp.src( config.styles.sass )
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(sass({
          indentedSyntax: false
        }))
        .on('error', function(err) {
          console.log(err);
        })
        .pipe(minifyCSS())
        .pipe(rename('main.min.css'))
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(rev())
        .pipe(gulp.dest( config.styles.build ))
        .pipe(rev.manifest('rev-manifest.json', { merge: true }))
        .pipe(gulp.dest('./'));
});