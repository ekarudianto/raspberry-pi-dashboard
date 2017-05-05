import gulp from 'gulp';
import GulpConfig from '../gulp.config.json';
import pug from 'gulp-pug';

const app = () => {
  return gulp.src(GulpConfig.APP + '/base/* ')
    .pipe(pug({
      locals: {},
      pretty: false,
      compileDebug: true,
    }))
    .pipe(gulp.dest('.tmp'));
};

const dist = () => {
  return gulp.src(GulpConfig.APP + '/base/*.pug')
    .pipe(pug({
      locals: {},
      pretty: true,
      compileDebug: true,
    }))
    .pipe(gulp.dest(GulpConfig.DIST));
};

module.exports = {
  app,
  dist,
};