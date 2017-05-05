import cssmin from 'gulp-cssmin';
import gulp from 'gulp';
import GulpConfig from '../gulp.config.json';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';

const js = () => {
  return gulp.src(GulpConfig.APP + '/assets/js/main.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min',}))
    .pipe(gulp.dest(GulpConfig.DIST + '/assets/js/'));
};

const css = () => {
  return gulp.src(GulpConfig.APP + '/assets/css/style.css')
    .pipe(cssmin())
    .pipe(rename({suffix: '.min',}))
    .pipe(gulp.dest(GulpConfig.DIST + '/assets/css/'));
};

module.exports = {
  css,
  js,
};