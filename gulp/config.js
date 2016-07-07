module.exports = {
	vhost: "tempo.dev",
	scripts: {
		app: ['js/app/views/view.js', 'js/app/**/*.js'],
		vendors: ['js/vendor/jquery/jquery.min.js', 'js/vendor/signals/signals.min.js', 'js/vendor/**/*.js'],
		build: 'build/js/',
		dist: 'js/dist'
	},
	images: {
		src: ['assets/**', 'img/**'],
		build: ['build/assets', 'build/img']
	},
	styles: {
		sass: 'sass/**/*.scss',
		build: 'build/stylesheets/',
		dist: 'stylesheets'
	},
	templates: {
		hbs: 'templates/**/*',
		dist:'js/dist'
	},
	files: {
		src: ['fonts/**'],
		build: ['build/fonts']
	}
};