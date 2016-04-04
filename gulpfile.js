/**
 * Created by Eka Rudianto on 04/04/16.
 */

var gulp = require('gulp');
var jade = require('gulp-jade');
var clean = require('gulp-clean');

gulp.task('copy-assets', function () {

    gulp.src('app/assets/**')
        .pipe(gulp.dest('dist/assets/'));

});

gulp.task('copy-base-files', function () {

    var YOUR_LOCALS = {};

    gulp.src('app/base/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS,
            pretty: true
        }))
        .pipe(gulp.dest('dist/'));

});

gulp.task('clean-dist-folder', function () {
    return gulp.src('dist/*', {read: false})
        .pipe(clean());
});

gulp.task('build', ['clean-dist-folder', 'copy-assets', 'copy-base-files']);