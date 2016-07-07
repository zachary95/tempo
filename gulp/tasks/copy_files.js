var gulp   = require('gulp');
var config = require('../config.js');

gulp.task('copy', function(){
	
	for (var i = config.files.src.length - 1; i >= 0; i--) {
  	gulp.src(config.files.src[i]).pipe(gulp.dest(config.files.build[i]));
  }

});