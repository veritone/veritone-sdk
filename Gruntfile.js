'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jasmine_nodejs: {
			default: {
				specs:['**/*.spec.js', '!node_modules/**/*.spec.js']
			}
		},
		jshint: {
			all: [
				'Gruntfile.js',
				'**/*.js',
				'**/*.spec.js'
			],
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options: {
				ignores: [ 'node_modules/**/*.js' ],
				// more options here if you want to override JSHint defaults
				jshintrc: '.jshintrc-spec'
			}
		},
		watch: {
			grunt: {
				files: [ 'Gruntfile.js', 'package.json' ],
				tasks: 'default'
			},
			javascript: {
				files: [ '**/*.js', '**/*.spec.js' ],
				tasks: 'test'
			}
		}
	});

	grunt.loadNpmTasks('grunt-jasmine-nodejs');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('test', ['jshint', 'jasmine_nodejs']);
	grunt.registerTask('default', ['jshint', 'jasmine_nodejs']);
};