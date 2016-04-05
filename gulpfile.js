/**
 * Created by Eka Rudianto on 04/04/16.
 */

var gulp = require('gulp'),
    jade = require('gulp-jade'),
    clean = require('gulp-clean'),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    merge = require('merge-stream'),
    gutil = require('gulp-util'),

    LIVERELOAD_PORT = 35730,
    mountFolder = function (connect, dir) {
        return connect.static(require('path').resolve(dir));
    },

    config = {
        app: 'app',
        dist: 'dist'
    };

/**
 * copy assets file to distribution folder
 */

gulp.task('copy-assets:dist', ['clean:dist'], function () {
    var assets = gulp.src(config.app + '/assets/**')
        .pipe(gulp.dest(config.dist + '/assets'));

    var configFiles = gulp.src([
            config.app + '/.editorconfig',
            config.app + '/.htaccess',
            config.app + '/apple-touch-icon.png',
            config.app + '/browserconfig.xml',
            config.app + '/crossdomain.xml',
            config.app + '/favicon.ico',
            config.app + '/humans.txt',
            config.app + '/LICENSE.txt',
            config.app + '/robots.txt',
            config.app + '/tile.png',
            config.app + '/tile-wide.png'
        ])
        .pipe(gulp.dest(config.dist + '/'));

    return merge(assets, configFiles);
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
 * copy compiled jade files to .tmp / temporary folder
 */

gulp.task('copy-base-files', ['clean'], function () {
    return gulp.src(config.app + '/base/*.jade')
        .pipe(jade({
            locals: {},
            pretty: false,
            compileDebug: true
        }))
        .pipe(gulp.dest('.tmp'));
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
 * clean .tmp / temporary folder files
 */

gulp.task('clean', function () {
    return gulp.src('.tmp', {read: false})
        .pipe(clean());
});

/**
 * clean distribution folder files
 */

gulp.task('clean:dist', function () {
    return gulp.src([config.dist + '/*', config.dist + '/.*'], {read: false})
        .pipe(clean());
});

/**
 * build a web server to handle development environment folders
 */

gulp.task('connect', ['copy-base-files'], function () {
    gutil.log(gutil.colors.bgGreen('Starting web server...'));
    return connect.server({
        root: config.app,
        port: 9010,
        livereload: {
            port: LIVERELOAD_PORT
        },
        middleware: function (connect) {
            return [
                mountFolder(connect, '.tmp'),
                mountFolder(connect, config.app)
            ];
        }
    });
});

/**
 * build a web server to handle distribution folder
 */

gulp.task('connect:dist', ['build'], function () {
    gutil.log(gutil.colors.bgGreen('Starting distribution web server...'));
    return connect.server({
        root: config.dist,
        port: 9050,
        livereload: true
    });
});


/**
 * Reload the connected web server if there are changes
 */

gulp.task('reload', ['copy-base-files'], function () {
    gulp.src([
            './' + config.app + '/base/*.jade',
            './' + config.app + '/base/**/*.jade',
            './' + config.app + '/assets/css/*.css',
            './' + config.app + '/assets/js/*.js'
        ])
        .pipe(connect.reload());
});

/**
 * development environment watcher, used to watch all of the changes on development folders when running
 *
 * - gulp server
 */

gulp.task('watch', ['connect'], function () {
    gulp.watch([
            config.app + '/base/*.jade',
            config.app + '/base/**/*.jade',
            config.app + '/assets/css/*.css',
            config.app + '/assets/js/*.js'
        ], ['copy-base-files', 'reload'])
        .on('change', function (event) {
            gutil.log(gutil.colors.bgYellow(event.path + ' has changed, reloading...'));
        });
});

/**
 * distribution folder watcher, used to watch all of the changes on distribution folder when running
 *
 * - gulp server:dist
 */

gulp.task('watch:dist', ['connect:dist'], function () {
    return gulp.watch([
            config.dist + '/**'
        ])
        .on('change', function (event) {
            gutil.log(gutil.colors.bgYellow(event.path + ' has changed, reloading...'));
            gulp.src(['./' + config.dist + '/**'])
                .pipe(connect.reload());
        });
});

/**
 * build task to build all of the works from apps folder
 */

gulp.task('build', ['copy-assets:dist', 'copy-base-files:dist', 'minify-css:dist', 'uglify-js:dist']);

/**
 * creating web server for development environment
 */

gulp.task('server', ['clean', 'connect', 'watch']);

/**
 * creating distribution web server
 */

gulp.task('server:dist', ['build', 'connect:dist', 'watch:dist']);