import cssmin from 'gulp-cssmin';
import gulp from 'gulp';
import GulpConfig from './gulp.config.json';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';

const js = () => {
  return gulp.src(GulpConfig.PATH.MINIFY.JS.APP)
    .pipe(uglify())
    .pipe(rename({suffix: '.min',}))
    .pipe(gulp.dest(GulpConfig.PATH.MINIFY.JS.DIST));
};

const css = () => {
  return gulp.src(GulpConfig.PATH.MINIFY.CSS.APP)
    .pipe(cssmin())
    .pipe(rename({suffix: '.min',}))
    .pipe(gulp.dest(GulpConfig.PATH.MINIFY.CSS.DIST));
};

module.exports = {
  css,
  js,
};