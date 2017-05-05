import connect from 'gulp-connect';
import gulp from 'gulp';
import GulpConfig from '../gulp.config.json';
import LOGGER from 'gulp-util';

const app = () => {
  return gulp.watch([
    GulpConfig.APP + '/base/*.pug',
    GulpConfig.APP + '/base/**/*.pug',
    GulpConfig.APP + '/assets/css/*.css',
    GulpConfig.APP + '/assets/js/*.js',
  ], ['copy-base-files', 'reload',])
  .on('change', (e) => {
    LOGGER.log(LOGGER.colors.bgYellow(e.path + ' has changed, reloading...'));
  });
};

const dist = () => {
  return gulp.watch([
    GulpConfig.DIST + '/**',
  ])
  .on('change', (e) => {
    LOGGER.log(LOGGER.colors.bgYellow(e.path + ' has changed, reloading...'));
    gulp.src(['./' + GulpConfig.DIST + '/**',]).pipe(connect.reload());
  });
};


module.exports = {
  app,
  dist,
};
