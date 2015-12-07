var gulp = require('gulp'),
	gulpEslint = require('gulp-eslint'),
	gulpDebug = require('gulp-debug'),
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

gulp.task('lint', function lint() {
	return gulp.src(allOfMyFiles).
		pipe(gulpDebug({ title: 'lint:' })).
		pipe(gulpEslint()).
		pipe(gulpEslint.format()).
		pipe(gulpEslint.failAfterError());
});

gulp.task('jasmine', function jasmine() {
	return gulp.src(allOfMyTestFiles).
		pipe(gulpDebug({ title: 'jasmine:' })).
		pipe(gulpJasmine({ verbose: true }));
});

gulp.task('test', ['lint', 'jasmine']);

gulp.task('watch', ['test'], function watch() {
	gulp.watch(allOfMyFiles, ['test']);
});

gulp.task('default', ['test']);

