var gulp = require('gulp');
var sass = require('gulp-sass');
var fs = require('fs');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var tsify = require('tsify');
var del = require('del');
var gutil = require('gulp-util');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var exec = require('child_process').execSync;

var basedir = 'src';
var build_output_dir = 'dist';

var paths = { pages: [ `index.html` ]};
var APP_NAME = 'main.js';
var APP_NAME_MIN = 'main.min.js';

var watcher = watchify(
	browserify({
		basedir: basedir,
		debug: true,
		entries: ['main.ts'],
		cache: {},
		packageCache: {}
	})
);

function bundleAll() {
	return watcher
		.plugin(tsify)
		.bundle()
		.pipe(source(APP_NAME))
		.pipe(gulp.dest(`${build_output_dir}/js`));
}

gulp.task('sass', function () {
	return gulp.src(`./${basedir}/sass/*.scss`)
	  .pipe(sass().on('error', sass.logError))
	  .pipe(gulp.dest(`${build_output_dir}/styles`));
  });
   
gulp.task('sass:watch', () => {
	gulp.watch(`./${basedir}/sass/*.scss`, ['sass']);
});

gulp.task('copy', () => {
	return gulp.src(`./${basedir}/*.html`).pipe(gulp.dest(`${build_output_dir}/`));
});

gulp.task('build', ['sass', 'copy'], () => {
	return browserify({
		basedir: basedir,
		debug: true,
		entries: ['main.ts'],
		cache: {},
		packageCache: {}
	})
	.plugin(tsify)
	.bundle()
	.pipe(source(APP_NAME))
	.pipe(gulp.dest(`${build_output_dir}/js`));
});

gulp.task('build-minify', ['build'], function() {
	return browserify({
		basedir: basedir,
		debug: false,
		entries: ['main.ts'],
		cache: {},
		packageCache: {}
	})
	.plugin(tsify)
	.bundle()
	.pipe(source(APP_NAME_MIN))
	.pipe(streamify(uglify()))
	.pipe(gulp.dest(`${build_output_dir}/js`));
});

gulp.task('default', ['clean', 'build', 'watch' ], function() {

});

gulp.task('clean', function() {
	return del([`${build_output_dir}/**`, `${build_output_dir}/js/*.js`, `${build_output_dir}/styles/*.css`]);
});
gulp.task('watch', ['sass:watch'], () => {
	return gulp.watch('./src/**/*', ['build'])
});

watcher.on('update', bundleAll);
watcher.on('log', gutil.log);
