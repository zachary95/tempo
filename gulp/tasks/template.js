var gulp       = require('gulp');
var config     = require('../config.js');
var path       = require('path');
var handlebars = require('gulp-handlebars');
var concat     = require('gulp-concat');
var declare    = require('gulp-declare');
var wrap       = require('gulp-wrap');
 
gulp.task('template', function() {

  return gulp.src(config.templates.hbs)
		    .pipe(handlebars())
		    .pipe(wrap('Handlebars.template(<%= contents %>)'))
		    .pipe(declare({
		      namespace: 'templates',
		      noRedeclare: true,
		    }))
		    .pipe(concat('template.js'))
		    .pipe(gulp.dest(config.templates.dist));

});