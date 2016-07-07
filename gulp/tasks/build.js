var gulp 				 		= require('gulp');
var gulpSequence 		= require('gulp-sequence');
var clean				 		= require('./clean.js');
var img_prod		 		= require('./img_prod.js');
var index_replace		= require('./index_replace.js');
var js_app  				= require('./js_app');
var js_app_prod  		= require('./js_app_prod');
var js_libs  				= require('./js_libs');
var template  			= require('./template');
var sass_prod		 		= require('./sass_prod');

// Prod build task
gulp.task('build', gulpSequence(
	'clean',
	'js_app',
	'js_libs',
	'template',
	'sass_prod',
	'js_app_prod',
	'img_prod',
	'copy',
	'index_replace'
));