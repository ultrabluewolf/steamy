'use strict';
 
var gulp    = require('gulp');
var sass    = require('gulp-sass');
var concat  = require('gulp-concat');
var uglify  = require('gulp-uglify');
var del     = require('del');
var ngAnnotate = require('gulp-ng-annotate');
var html2js    = require('gulp-ng-html2js');

var path = {
  src: './assets/src/',
  dist: './dist',
  misc: [
    './assets/img/**/*',
    './assets/font/**/*'
  ], 
  js: 'js/**/*.js',
  sass: '**/*.scss',
  templates: 'templates/**/*.html',
  lib: [
    './bower_components/jquery/dist/jquery.js',
    './bower_components/lodash/lodash.js',
    './bower_components/moment/moment.js',
    './bower_components/async/dist/async.js',
    './bower_components/angular/angular.js',
    './bower_components/angular-resource/angular-resource.js',
    './bower_components/ui-router/release/angular-ui-router.js',
    './bower_components/angular-sanitize/angular-sanitize.js',
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
gulp.task('js:concat', ['templates'], function() {
  return gulp.src([
    path.src + path.js,
    path.dist + '/templates.js'
  ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest(path.dist + '/js/'));
});

// uglify
//
gulp.task('js:uglify', ['js:concat'], function() {
  return gulp.src(path.dist + '/js/app.js')
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(path.dist + '/js/'));
});

// client-side templates
//
gulp.task('templates', function () {
  return gulp.src(path.src + path.templates)
    .pipe(html2js({
        moduleName: 'steamyTemplates',
        //stripPrefix: '/templates'
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(path.dist));
});

// sass
//
gulp.task('sass', function () {
  gulp.src(path.src + 'styles/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(path.dist + '/css/'));
});

// copy misc files
//
gulp.task('copy', function () {
  gulp.src(path.misc, {
    base: './assets'
  })
    .pipe(gulp.dest(path.dist + '/'));
});

gulp.task('build', [
  'sass',
  'templates',
  'js:concat',
  'lib:concat',
  'copy'
]);

gulp.task('build:min', [
  'sass',
  'templates',
  'js:concat',
  'lib:concat',
  'js:uglify',
  'lib:uglify',
  'copy'
]);

//
//
gulp.task('sass:watch', function () {
  gulp.watch(path.src + path.sass, ['sass']);
});

gulp.task('js:watch', function () {
  gulp.watch([
    path.src + path.js,
    path.src + path.templates
  ], ['templates', 'js:concat', 'js:uglify']);
});

gulp.task('watch', [
  'sass:watch', 
  'js:watch'
]);

gulp.task('default', ['build', 'watch']);
