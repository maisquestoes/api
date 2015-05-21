'use strict';

module.exports = function(grunt) {
	var watchFiles = {
		serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
		mochaTests: ['app/tests/mocha/*.js'],
		frisbyTests: ['app/tests/mocha/*.js'],
	};

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			serverJS: {
				files: watchFiles.serverJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
		},
		jshint: {
			all: {
				src: watchFiles.serverJS,
				options: {
					jshintrc: true
				}
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js',
					watch: watchFiles.serverJS
				}
			}
		},
		'node-inspector': {
			custom: {
				options: {
					'web-port': 1337,
					'web-host': 'localhost',
					'debug-port': 5858,
					'save-live-edit': true,
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},
		concurrent: {
			default: ['nodemon', 'watch'],
			debug: ['nodemon', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true,
				limit: 10
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			},
			secure: {
				NODE_ENV: 'secure'
			}
		},
		mochaTest: {
			src: watchFiles.mochaTests,
			options: {
				reporter: 'spec',
				require: 'server.js'
			}
		}
	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// A Task for loading the configuration object
	grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
		var init = require('./config/init')();
		var config = require('./config/config');
	});

	grunt.registerTask('default', ['concurrent:default']);

	grunt.registerTask('debug', ['lint', 'concurrent:debug']);

	grunt.registerTask('secure', ['env:secure', 'lint', 'concurrent:default']);

	grunt.registerTask('lint', ['jshint']);

	grunt.registerTask('build', ['lint', 'loadConfig']);

	grunt.registerTask('test', ['env:test', 'mochaTest']);
};