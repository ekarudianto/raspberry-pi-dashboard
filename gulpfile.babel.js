/**
 * Created by Eka Rudianto on 04/04/16.
 */

import clean from 'gulp-clean';
import connect from 'gulp-connect';
import cssmin from 'gulp-cssmin';
import gulp from 'gulp';
import gutil from 'gulp-util';
import jade from 'gulp-jade';
import merge from 'merge-stream';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';

import CONFIG from './gulp.config.json';

const mountFolder = (connect, dir) => connect.static(require('path').resolve(dir));

/**
 * copy assets file to distribution folder
 */

gulp.task('copy-assets:dist', [
  'clean:dist',
], () => {
  const assets = gulp.src(CONFIG.APP + '/assets/**')
          .pipe(gulp.dest(CONFIG.DIST + '/assets'));

  const configFiles = gulp.src([
    CONFIG.APP + '/.editorconfig',
    CONFIG.APP + '/.htaccess',
    CONFIG.APP + '/apple-touch-icon.png',
    CONFIG.APP + '/browserconfig.xml',
    CONFIG.APP + '/crossdomain.xml',
    CONFIG.APP + '/favicon.ico',
    CONFIG.APP + '/humans.txt',
    CONFIG.APP + '/LICENSE.txt',
    CONFIG.APP + '/robots.txt',
    CONFIG.APP + '/tile.png',
    CONFIG.APP + '/tile-wide.png',
  ])
  .pipe(gulp.dest(CONFIG.DIST + '/'));

  return merge(assets, configFiles);
});

/**
 * minify style.css and copy the minified file to distribution folder
 */

gulp.task('minify-css:dist', [
  'copy-assets:dist',
], () => {
  return gulp.src(CONFIG.APP + '/assets/css/style.css')
          .pipe(cssmin())
          .pipe(rename({suffix: '.min',}))
          .pipe(gulp.dest(CONFIG.DIST + '/assets/css/'));
});

/**
 * uglify main.js and copy the minified file to distribution folder
 */

gulp.task('uglify-js:dist', [
  'copy-assets:dist',
], () => {
  return gulp.src(CONFIG.APP + '/assets/js/main.js')
          .pipe(uglify())
          .pipe(rename({suffix: '.min',}))
          .pipe(gulp.dest(CONFIG.DIST + '/assets/js/'));
});

/**
 * copy compiled jade files to .tmp / temporary folder
 */

gulp.task('copy-base-files', [
  'clean',
], () => {
  return gulp.src(CONFIG.APP + '/base/*.jade')
          .pipe(jade({
            locals: {},
            pretty: false,
            compileDebug: true,
          }))
          .pipe(gulp.dest('.tmp'));
});

/**
 * copy compiled jade files to distribution folder
 */

gulp.task('copy-base-files:dist', [
  'clean:dist',
], () => {
  return gulp.src(CONFIG.APP + '/base/*.jade')
          .pipe(jade({
            locals: {},
            pretty: true,
            compileDebug: true,
          }))
          .pipe(gulp.dest(CONFIG.DIST));
});

/**
 * clean .tmp / temporary folder files
 */

gulp.task('clean', () => {
  return gulp.src('.tmp', {read: false,})
          .pipe(clean());
});

/**
 * clean distribution folder files
 */

gulp.task('clean:dist', () => {
  return gulp.src([CONFIG.DIST + '/*', CONFIG.DIST + '/.*',], {read: false,})
          .pipe(clean());
});

/**
 * build a web server to handle development environment folders
 */

gulp.task('connect', [
  'copy-base-files',
], () => {
  gutil.log(gutil.colors.bgGreen('Starting web server...'));
  return connect.server({
    root: CONFIG.APP,
    port: CONFIG.APP_PORT,
    livereload: {
      port: CONFIG.LIVERELOAD_PORT,
    },
    middleware: (connect) => {
      return [
        mountFolder(connect, '.tmp'),
        mountFolder(connect, CONFIG.APP),
      ];
    },
  });
});

/**
 * build a web server to handle distribution folder
 */

gulp.task('connect:dist', [
  'build',
], () => {
  gutil.log(gutil.colors.bgGreen('Starting distribution web server...'));
  return connect.server({
    root: CONFIG.DIST,
    port: CONFIG.DIST_PORT,
    livereload: true,
  });
});


/**
 * Reload the connected web server if there are changes
 */

gulp.task('reload', [
  'copy-base-files',
], () => {
  gulp.src([
    './' + CONFIG.APP + '/base/*.jade',
    './' + CONFIG.APP + '/base/**/*.jade',
    './' + CONFIG.APP + '/assets/css/*.css',
    './' + CONFIG.APP + '/assets/js/*.js',
  ])
  .pipe(connect.reload());
});

/**
 * development environment watcher, used to watch all of the changes on development folders when running
 *
 * - gulp server
 */

gulp.task('watch', [
  'connect',
], () => {
  gulp.watch([
    CONFIG.APP + '/base/*.jade',
    CONFIG.APP + '/base/**/*.jade',
    CONFIG.APP + '/assets/css/*.css',
    CONFIG.APP + '/assets/js/*.js',
  ], ['copy-base-files', 'reload',])
  .on('change', (event) => {
    gutil.log(gutil.colors.bgYellow(event.path + ' has changed, reloading...'));
  });
});

/**
 * distribution folder watcher, used to watch all of the changes on distribution folder when running
 *
 * - gulp server:dist
 */

gulp.task('watch:dist', [
  'connect:dist',
], () => {
  return gulp.watch([
    CONFIG.DIST + '/**',
  ])
  .on('change', (event) => {
    gutil.log(gutil.colors.bgYellow(event.path + ' has changed, reloading...'));
    gulp.src(['./' + CONFIG.DIST + '/**',]).pipe(connect.reload());
  });
});

/**
 * build task to build all of the works from apps folder
 */

gulp.task('build', ['copy-assets:dist', 'copy-base-files:dist', 'minify-css:dist', 'uglify-js:dist',]);

/**
 * creating web server for development environment
 */

gulp.task('default', ['clean', 'connect', 'watch',]);
gulp.task('server', ['default',]);

/**
 * creating distribution web server
 */

gulp.task('server:dist', ['build', 'connect:dist', 'watch:dist',]);