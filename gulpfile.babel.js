/**
 * Created by Eka Rudianto on 04/04/16.
 */

import gulp from 'gulp';
import gutil from 'gulp-util';
import merge from 'merge-stream';
import pug from 'gulp-pug';

import clean from './gulp/clean';
import watch from './gulp/watch';
import reload from './gulp/reload';
import minify from './gulp/minify';
import connect from './gulp/connect';
import copyBaseFiles from './gulp/copy-base-files';

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
], minify.css);

/**
 * uglify main.js and copy the minified file to distribution folder
 */

gulp.task('uglify-js:dist', [
  'copy-assets:dist',
], minify.js);

/**
 * copy compiled pug files to .tmp / temporary folder
 */

gulp.task('copy-base-files', [
  'clean',
], copyBaseFiles.app);

/**
 * copy compiled pug files to distribution folder
 */

gulp.task('copy-base-files:dist', [
  'clean:dist',
], copyBaseFiles.dist);

/**
 * clean .tmp / temporary folder files
 */

gulp.task('clean', clean.app);

/**
 * clean distribution folder files
 */

gulp.task('clean:dist', clean.dist);

/**
 * build a web server to handle development environment folders
 */

gulp.task('connect', [
  'copy-base-files',
], connect.app);

/**
 * build a web server to handle distribution folder
 */

gulp.task('connect:dist', [
  'build',
], connect.dist);


/**
 * Reload the connected web server if there are changes
 */

gulp.task('reload', [
  'copy-base-files',
], reload);

/**
 * development environment watcher, used to watch all of the changes on development folders when running
 *
 * - gulp server
 */

gulp.task('watch', [
  'connect',
], watch.app);

/**
 * distribution folder watcher, used to watch all of the changes on distribution folder when running
 *
 * - gulp server:dist
 */

gulp.task('watch:dist', [
  'connect:dist',
], watch.dist);

/* eslint-disable comma-dangle */

/**
 * build task to build all of the works from apps folder
 */

gulp.task('build', ['copy-assets:dist', 'copy-base-files:dist', 'minify-css:dist', 'uglify-js:dist']);

/**
 * creating web server for development environment
 */

gulp.task('default', ['clean', 'connect', 'watch']);
gulp.task('server', ['default']);

/**
 * creating distribution web server
 */

gulp.task('server:dist', ['build', 'connect:dist', 'watch:dist']);

/* eslint-enable comma-dangle */