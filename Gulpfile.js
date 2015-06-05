'use strict';

var gulp = require('gulp'),
    gulpJshint = require('gulp-jshint'),
    gulpDebug = require('gulp-debug'),
    gulpNodemon = require('gulp-nodemon'),
    gulpJasmine = require('gulp-jasmine');

var allOfMyFiles = [
	'!node_modules/**',
	'!**/node_modules/**',
	//'*.js',
	'**/*.js'
];

var allOfMyTestFiles = [
	'!node_modules/**',
	'!**/node_modules/**',
	'**/*.spec.js'
];

gulp.task('lint', function() {
	return gulp.src(allOfMyFiles).
		pipe(gulpDebug({ title: 'lint:' })).
		pipe(gulpJshint('.jshintrc-spec')).
		pipe(gulpJshint.reporter()).
		pipe(gulpJshint.reporter('fail'));
});

gulp.task('jasmine', function() {
	return gulp.src(allOfMyTestFiles).
		pipe(gulpDebug({ title: 'jasmine:' })).
		pipe(gulpJasmine({ verbose: true }));
});

gulp.task('test', ['lint', 'jasmine']);

gulp.task('watch', ['test'], function() {
	gulp.watch(allOfMyFiles, ['test']);
});

gulp.task('serve', ['test'], function() {
	gulpNodemon({
		script: 'server.js'
	});
});

gulp.task('default', ['test']);

