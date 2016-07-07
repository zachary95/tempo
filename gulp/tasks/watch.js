var gulp 						= require('gulp'),
		watch       		= require('gulp-watch'),
		gulpSequence 		= require('gulp-sequence'),
    template        = require('./template'),
		sass						= require('./sass'),
		config 					= require('../config.js'),
		browserSync 		= require('browser-sync'),
		reload  				= browserSync.reload;

// Watch task
gulp.task('default', function(){

  browserSync({
    proxy: config.vhost
  });

  gulp.watch( config.templates.hbs ).on('change', reload);

  //-- Live reload CSS / SASS
  gulp.watch( config.styles.sass, ['sass']);

  //-- Live Reload JS Libs & App
  gulp.watch( config.scripts.app, ['js_app']);

  //-- Watch templates
  gulp.watch('templates/**/*', ['template']);

});