/**
 *
 */

const gulp = require('gulp');
const gutil = require('gulp-util');
const jsdoc = require('gulp-jsdoc3');

gulp.task('doc', function (cb) {
    gulp.src(['README.md', './**/*.js', '!**/node_modules/**', '!Gulpfile.js'], {read: false})
        .pipe(jsdoc(cb));
});
