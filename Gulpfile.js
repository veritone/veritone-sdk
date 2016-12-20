var gulp = require('gulp'),
	gulpEslint = require('gulp-eslint'),
	gulpDebug = require('gulp-debug'),
	gulpIstanbul = require('gulp-istanbul'),
	gulpJasmine = require('gulp-jasmine');

var allOfMyFiles = [
	'!node_modules/**',
	'!**/node_modules/**',
	'!coverage/**',
	'!Gulpfile.js',
	'!**/*.spec.js',
	'**/*.js'
];

var allOfMyTestFiles = [
	'!node_modules/**',
	'!**/node_modules/**',
	'!coverage/**',
	'!Gulpfile.js',
	'**/*.spec.js'
];

gulp.task('lint', function lint() {
	return gulp.src(allOfMyFiles).
		pipe(gulpDebug({ title: 'lint:' })).
		pipe(gulpEslint()).
		pipe(gulpEslint.format()).
		pipe(gulpEslint.failAfterError());
});

gulp.task('pre-jasmine', function preJasmine() {
	return gulp.src(allOfMyFiles).
		pipe(gulpIstanbul({includeUntested: true})).
		pipe(gulpIstanbul.hookRequire());
});

gulp.task('jasmine', ['pre-jasmine'], function jasmine() {
	return gulp.src(allOfMyTestFiles).
		pipe(gulpDebug({ title: 'jasmine:' })).
		pipe(gulpJasmine({
			verbose: true,
			timeout: 1000
		})).
		pipe(gulpIstanbul.writeReports());
});

gulp.task('test', ['lint', 'jasmine']);

gulp.task('watch', ['test'], function watch() {
	gulp.watch(allOfMyFiles, ['test']);
});

gulp.task('default', ['test']);

