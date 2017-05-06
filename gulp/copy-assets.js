import gulp from 'gulp';
import GulpConfig from './gulp.config.json';
import merge from 'merge-stream';

module.exports = () => {
  const assets = gulp.src(GulpConfig.PATH.COPY_ASSETS.APP)
    .pipe(gulp.dest(GulpConfig.PATH.COPY_ASSETS.DIST));

  const configFiles = gulp.src(GulpConfig.COPY_ASSETS_LIST)
  .pipe(gulp.dest(GulpConfig.PATH.DIST));

  return merge(assets, configFiles);
};