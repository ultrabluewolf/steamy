'use strict';
 
var gulp   = require('gulp');
var sass   = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del    = require('del');

var path = {
  src: './assets/src/',
  dist: './dist',
  js: 'js/**/*.js',
  sass: 'styles/app.scss',
  lib: [
    './bower_components/jquery/dist/jquery.js',
    './bower_components/lodash/lodash.js',
    './bower_components/moment/moment.js',
    './bower_components/async/dist/async.js',
  ]
};

gulp.task('clean', function (cb) {
  del([path.dist], cb);
});

// js libs
//
gulp.task('lib:concat', function () {
  return gulp.src(path.lib)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(path.dist + '/js/'));
});

gulp.task('lib:uglify', ['lib:concat'], function() {
  return gulp.src(path.dist + '/js/lib.js')
    .pipe(uglify())
    .pipe(concat('lib.min.js'))
    .pipe(gulp.dest(path.dist + '/js/'));
});

// concat
//
gulp.task('js:concat', ['clean'], function() {
  return gulp.src(path.src + path.js)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(path.dist + '/js/'));
});

// uglify
//
gulp.task('js:uglify', ['js:concat'], function() {
  return gulp.src(path.dist + '/js/app.js')
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(path.dist + '/js/'));
});

// sass
//
gulp.task('sass', ['clean'], function () {
  gulp.src(path.src + path.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(path.dist + '/css/'));
});

gulp.task('build', [
  'clean',
  'sass',
  'js:concat',
  'js:uglify',
  'lib:concat',
  'lib:uglify'
]);

//
//
gulp.task('sass:watch', function () {
  gulp.watch(path.src + path.sass, ['sass']);
});

gulp.task('js:watch', function () {
  gulp.watch(path.src + path.js, ['js:concat', 'js:uglify']);
});

gulp.task('watch', [
  'sass:watch', 
  'js:watch'
]);

gulp.task('default', ['build', 'watch']);
