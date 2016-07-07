var gulp   = require('gulp');
var del    = require('del');
var config = require('../config.js');

gulp.task('clean', function(){
	
	gulp.task('clean', del.bind(null, './build'));

});