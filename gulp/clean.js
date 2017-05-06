import gulp from 'gulp';
import clean from 'gulp-clean';
import GulpConfig from './gulp.config.json';

module.exports = {
  app: () => gulp.src(GulpConfig.PATH.TMP, {read: false,}).pipe(clean()),
  dist: () => gulp.src(GulpConfig.PATH.CLEAN.DIST, {read: false,}).pipe(clean()),
};