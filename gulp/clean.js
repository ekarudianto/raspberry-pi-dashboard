import gulp from 'gulp';
import clean from 'gulp-clean';
import GulpConfig from '../gulp.config.json';

module.exports = {
  tmp: () => gulp.src('.tmp', {read: false,}).pipe(clean()),
  dist: () => gulp.src([GulpConfig.DIST + '/*', GulpConfig.DIST + '/.*',], {read: false,}).pipe(clean()),
};