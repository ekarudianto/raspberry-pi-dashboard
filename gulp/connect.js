import connect from 'gulp-connect';
import GulpConfig from '../gulp.config.json';
import LOGGER from 'gulp-util';

const mountFolder = (connect, dir) => connect.static(require('path').resolve(dir));
const app = () => {
  LOGGER.log(LOGGER.colors.bgGreen('Starting web server...'));

  return connect.server({
    root: GulpConfig.APP,
    port: GulpConfig.APP_PORT,
    livereload: {
      port: GulpConfig.LIVERELOAD_PORT,
    },
    middleware: (connect) => {
      return [
        mountFolder(connect, '.tmp'),
        mountFolder(connect, GulpConfig.APP),
      ];
    },
  });
};

const dist = () => {
  LOGGER.log(LOGGER.colors.bgGreen('Starting distribution web server...'));

  return connect.server({
    root: GulpConfig.DIST,
    port: GulpConfig.DIST_PORT,
    livereload: true,
  });
};

module.exports = {
  app,
  dist,
};