'use strict';

module.exports = function(grunt) {
	var files = {
		serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
		mochaTests: ['tests/mocha/*.test.js'],
	};

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			serverJS: {
				files: files.serverJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
		},
		jshint: {
			all: {
				src: files.serverJS,
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
					watch: files.serverJS
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
			},
			coverage: {
				NODE_ENV: 'coverage',
      }
		},
		mochaTest: {
			src: files.mochaTests,
			options: {
				reporter: 'spec'
			},
		},
    mocha_istanbul: {
      coverage: {
          src: 'tests/mocha',
          options: {
              check: {
                  lines: 20,
                  statements: 20
              },
          }
      },
      coveralls: {
          src: 'tests/mocha',
          options: {
              coverage:true, 
              check: {
                  lines: 20,
                  statements: 20
              },
          }
      }
    },

	});

	require('load-grunt-tasks')(grunt);

	grunt.event.on('coverage', function(lcov, done){
		require('coveralls').handleInput(lcov, function(err){
				if (err) {
					return done(err);
				}
				done();
			});
	});

	grunt.registerTask('default', ['concurrent:default']);
	grunt.registerTask('test', ['env:test', 'jshint', 'mochaTest']);
	grunt.registerTask('travis', ['env:test', 'jshint', 'mocha_istanbul:coveralls']);
	grunt.registerTask('coverage', ['env:coverage', 'mocha_istanbul:coverage']);

};