var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var config      = require('../config.js');
var pkg         = require('../../package.json');
var header      = require('gulp-header');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var rev         = require('gulp-rev');
var stripDebug  = require('gulp-strip-debug');

var banner = [
  '/**',
  ' * <%= pkg.name %>',
  ' * <%= pkg.author %>',
  ' * <%= pkg.client %>',
  ' * @version v<%= pkg.version %>',
  ' */',
  '', ''
].join('\n');

// Build scripts for prod
gulp.task('js_app_prod', function()
{
  return gulp.src( [ config.scripts.dist + '/vendor.js', config.scripts.dist + '/template.js', config.scripts.dist + '/app.js' ] )
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(stripDebug())
        .pipe(rev())
        .on('error', function(err) {
          console.log(err);
        })
        .pipe(gulp.dest( config.scripts.build ))
        .pipe(rev.manifest('rev-manifest.json', {merge: true}))
        .pipe(gulp.dest('./'));
});