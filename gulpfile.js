var gulp        = require('gulp');
var browserify  = require('browserify');
var babel       = require('gulp-babel');
var uglify      = require('gulp-uglify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var rename      = require('gulp-rename');
var sourcemaps  = require('gulp-sourcemaps');

var dest   = "./dist";
var lib    = "./lib";
var src    = './src';
var entry  = src + '/index.js';

var config = {
    browserify: {
        libBundleConfig: {
            detectGlobals: false,
            entries: [ lib + '/index.js' ],
            debug: true
        },
        libOutputName: 'bundle.js',
        dest: dest
    },
    babel: {
        optional: ['runtime']
    },
    uglify: {
        src : dest + '/bundle.js',
        dest: dest
    }
};

gulp.task('build-lib', function () {
    return gulp.src(['src/**/*.js'])
        .pipe(babel(config.babel))
        .pipe(gulp.dest(lib));
});

gulp.task('build-dist', ['build-lib'], function () {
    var b = browserify(config.browserify.libBundleConfig);

    b.external('react');
    b.external('react-bootstrap');

    var stream = b.bundle()
        .pipe(source(config.browserify.libOutputName))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(gulp.dest(config.browserify.dest))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'));

    stream.pipe(gulp.dest(config.browserify.dest));

    return stream;
});

gulp.task('build', ['build-dist']);
