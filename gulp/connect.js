import connect from 'gulp-connect';
import GulpConfig from './gulp.config.json';
import LOGGER from 'gulp-util';

const mountFolder = (c, d) => c.static(require('path').resolve(d));
const app = () => {
  LOGGER.log(LOGGER.colors.bgGreen('Starting web server...'));

  return connect.server({
    root: GulpConfig.PATH.APP,
    port: GulpConfig.APP_PORT,
    livereload: {
      port: GulpConfig.LIVERELOAD_PORT,
    },
    middleware: (connect) => {
      return [
        mountFolder(connect, GulpConfig.PATH.TMP),
        mountFolder(connect, GulpConfig.PATH.APP),
      ];
    },
  });
};

const dist = () => {
  LOGGER.log(LOGGER.colors.bgGreen('Starting distribution web server...'));

  return connect.server({
    root: GulpConfig.PATH.DIST,
    port: GulpConfig.DIST_PORT,
    livereload: true,
  });
};

module.exports = {
  app,
  dist,
};