'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const jsdoc = require('gulp-jsdoc3');
const jshint = require('gulp-jshint');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const COVERAGE_THRESHOLD = 90;
const src = './lib/**/*.js';
const testSrc = './test/spec/*.js';


//======================================================================== Tasks
gulp.task('doc', function (cb) {
    gulp.src(['README.md', src], {read: false})
        .pipe(jsdoc(cb));
});


/*
 Linting
 */
gulp.task('lint', () => {
    return gulp.src(src)
        .pipe(jshint('.jshintrc'))
        // You can look into pretty reporters as well, but that's another story
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});


/*
 Sets up code coverage
 */
gulp.task('pre-test', () => {
    return gulp.src(src)
    // Covering files
        .pipe(istanbul({includeUntested: true}))
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});


/*
 Runs tests with coverage.
 */
gulp.task('test', ['pre-test'], () => {
    return gulp.src(testSrc)
        .pipe(mocha({
            reporter: 'list'
        }))
        .pipe(istanbul.writeReports())
        // Enforce a coverage of at least 90%
        .pipe(istanbul.enforceThresholds({ thresholds: { global: COVERAGE_THRESHOLD } }))
        .on('error', gutil.log);
});


/*
 Builds the entire project.
 */
gulp.task('default', ['lint', 'test'], done => {
    done();
});
