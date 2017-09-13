var gulp = require('gulp'),
	gulpEslint = require('gulp-eslint'),
	gulpDebug = require('gulp-debug'),
	gulpNodemon = require('gulp-nodemon'),
	gulpJasmine = require('gulp-jasmine'),
	gulpIstanbul = require('gulp-istanbul'),
	gulpCoveralls = require('gulp-coveralls');

var FUNCTIONS_COVERAGE_THRESHOLD = 50;

var allOfMyFiles = [
	'!node_modules/**',
	'!**/node_modules/**',
	'!coverage/**',
	'!Gulpfile.js',
	'**/*.js'
 ];

var allOfMyTestFiles = [
	'!node_modules/**',
	'!**/node_modules/**',
	'!coverage/**',
	'**/*.spec.js'
];

var allOfMyCoverageFiles = [
	'!node_modules/**',
	'!server.js',
	'!coverage/**',
	'!Gulpfile.js',
	'!**/*.spec.js',
	'**/*.js'
];

gulp.task('lint', function lint() {
	return gulp.src(allOfMyFiles).
		pipe(gulpDebug({ title: 'lint:' })).
		pipe(gulpEslint()).
		pipe(gulpEslint.format()).
		pipe(gulpEslint.failAfterError());
});

gulp.task('pre-jasmine', function preJasmine() {
	return gulp.src(allOfMyCoverageFiles).
	pipe(gulpIstanbul({includeUntested: true})).
	pipe(gulpIstanbul.hookRequire());
});

gulp.task('jasmine', ['pre-jasmine'], function jasmine() {
	return gulp.src(allOfMyTestFiles).
		pipe(gulpDebug({
			title: 'jasmine:'
		})).
		pipe(gulpJasmine({
			verbose: true,
			timeout: 1000,
			includeStackTrace: true
		})).
		pipe(gulpIstanbul.writeReports()).
		pipe(gulpIstanbul.enforceThresholds({
			thresholds: {
				global: {
					functions: FUNCTIONS_COVERAGE_THRESHOLD
				}
			}
		}));
});

gulp.task('coveralls', ['lint', 'jasmine'], function coveralls() {
	return gulp.src('coverage/**/lcov.info')
			.pipe(gulpCoveralls());
});

gulp.task('test', ['lint', 'jasmine']);

gulp.task('watch', ['test'], function watch() {
	gulp.watch(allOfMyFiles, ['test']);
});

gulp.task('default', ['test']);
