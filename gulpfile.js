var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    mochaPhantomJS = require('gulp-mocha-phantomjs');

var sourceglob = './src/*.js',
    testglob = './test/*.js',
    dist = './dist/',
    renameOptions = { suffix: '.min' };

gulp.task('make-dist', function() {
    gulp.src(sourceglob)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(gulp.dest(dist)) // copy original .js before minifying
        .pipe(streamify(uglify()))
        .pipe(rename(renameOptions))
        .pipe(gulp.dest(dist));
});

gulp.task('do-test', function() {
    gulp.src('./test/index.html')
        .pipe(mochaPhantomJS());
});

// The block below was going to be used at one point, but isn't currently necessary.
/*
gulp.task('browserify-tests', function() {
    b = browserify();
    gulp.src('./test/index.js')
        .pipe(through2.obj(
            function write(file, enc, next) {
                b.add(file.path);
                next();
            },
            function end(next) {
                b.bundle()
                 .pipe(source('test-browserified.js'))
                 .pipe(gulp.dest('./test/'));
            }
        ));
});
*/

gulp.task('build', ['make-dist', 'do-test']);

// watch task
gulp.task('watch', function() {
    gulp.watch([sourceglob, testglob], ['build']);
});

// run the watch task by default
gulp.task('default', ['watch']);
