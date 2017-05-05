import gulp from 'gulp';
import GulpConfig from '../gulp.config.json';
import merge from 'merge-stream';

modules.exports = () => {
  const assets = gulp.src(GulpConfig.APP + '/assets/**')
    .pipe(gulp.dest(GulpConfig.DIST + '/assets'));

  const configFiles = gulp.src([
    GulpConfig.APP + '/.editorconfig',
    GulpConfig.APP + '/.htaccess',
    GulpConfig.APP + '/apple-touch-icon.png',
    GulpConfig.APP + '/browserconfig.xml',
    GulpConfig.APP + '/crossdomain.xml',
    GulpConfig.APP + '/favicon.ico',
    GulpConfig.APP + '/humans.txt',
    GulpConfig.APP + '/LICENSE.txt',
    GulpConfig.APP + '/robots.txt',
    GulpConfig.APP + '/tile.png',
    GulpConfig.APP + '/tile-wide.png',
  ])
  .pipe(gulp.dest(GulpConfig.DIST + '/'));

  return merge(assets, configFiles);
};