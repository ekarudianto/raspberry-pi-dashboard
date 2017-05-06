import gulp from 'gulp';
import GulpConfig from './gulp.config.json';
import pug from 'gulp-pug';

const app = () => {
  return gulp.src(GulpConfig.PATH.COPY_BASE_FILES.APP)
    .pipe(pug({
      locals: {},
      pretty: false,
      compileDebug: true,
    }))
    .pipe(gulp.dest(GulpConfig.PATH.TMP));
};

const dist = () => {
  return gulp.src(GulpConfig.PATH.COPY_BASE_FILES.DIST)
    .pipe(pug({
      locals: {},
      pretty: true,
      compileDebug: true,
    }))
    .pipe(gulp.dest(GulpConfig.PATH.DIST));
};

module.exports = {
  app,
  dist,
};