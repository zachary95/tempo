var gulp   = require('gulp');
var config = require('../config.js');
var htmlreplace = require('gulp-html-replace');

gulp.task('index_replace', function(){

	var rev = require('../../rev-manifest.json');

  return gulp.src('./index.php')
		    .pipe(htmlreplace({
		      'css': 'stylesheets/' + rev['main.min.css'],
		      'js': 'js/' + rev['app.min.js']
		    }))
		    .pipe(gulp.dest('./build'));

});