import connect from 'gulp-connect';
import gulp from 'gulp';
import GulpConfig from './gulp.config.json';
import LOGGER from 'gulp-util';

module.exports = () => {
  return gulp.src(GulpConfig.RELOAD_LIST)
    .pipe(connect.reload());
};