/**
 * Created by Eka Rudianto on 04/04/16.
 */

var gulp = require('gulp');
var jade = require('gulp-jade');
var clean = require('gulp-clean');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var connect = require('gulp-connect');

var config = {
    app: 'app',
    dist: 'dist'
};

/**
 * copy assets file to distribution folder
 */

gulp.task('copy-assets:dist', ['clean:dist'], function () {
    return gulp.src(config.app + '/assets/**')
        .pipe(gulp.dest(config.dist + '/assets'));
});

/**
 * minify style.css and copy the minified file to distribution folder
 */

gulp.task('minify-css:dist', ['copy-assets:dist'], function () {
    return gulp.src(config.app + '/assets/css/style.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(config.dist + '/assets/css/'));
});

/**
 * uglify main.js and copy the minified file to distribution folder
 */

gulp.task('uglify-js:dist', ['copy-assets:dist'], function () {
    return gulp.src(config.app + '/assets/js/main.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(config.dist + '/assets/js/'));
});

/**
 * copy compiled jade files to distribution folder
 */

gulp.task('copy-base-files:dist', ['clean:dist'], function () {
    var YOUR_LOCALS = {};

    return gulp.src(config.app + '/base/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS,
            pretty: true,
            compileDebug: true
        }))
        .pipe(gulp.dest(config.dist));
});

/**
 * clean distribution folder files
 */

gulp.task('clean:dist', function () {
    return gulp.src([config.dist + '/*', config.dist + '/.*'], {read: false})
        .pipe(clean());
});

/**
 * build a web server to handle distribution folder
 */

gulp.task('connect:dist', ['build'], function () {
    return connect.server({
        root: 'dist',
        port: 9050,
        livereload: true
    });
});

/**
 * distribution folder watcher, used to watch all of the changes on distribution folder when running
 *
 * - gulp server:dist
 */

gulp.task('watch:dist', ['connect:dist'], function () {
    return gulp.watch([
            'dist/**'
        ])
        .on('change', function (event) {
            console.log(event.path + ' has changed, reloading...');
            gulp.src(['./dist/**'])
                .pipe(connect.reload());
        });
});

/**
 * build task to build all of the works from apps folder
 */

gulp.task('build', ['copy-assets:dist', 'copy-base-files:dist', 'minify-css:dist', 'uglify-js:dist']);

/**
 * creating distribution web server
 */

gulp.task('server:dist', ['build', 'connect:dist', 'watch:dist']);