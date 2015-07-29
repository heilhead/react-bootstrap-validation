var gulp        = require('gulp');
var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var sourcemaps  = require('gulp-sourcemaps');

var dest   = "./build";
var src    = './src';
var jsDest = dest;

var config = {
    browserify: {
        libBundleConfig   : {
            detectGlobals: false,
            entries      : [ src + '/index.js' ],
            debug        : true
        },
        libOutputName     : 'main.js',
        dest              : jsDest
    },
    uglify    : {
        src : jsDest + '/main.js',
        dest: jsDest
    }
};

gulp.task('build', function () {
    var b = browserify(config.browserify.libBundleConfig)
        .transform(babelify.configure({ optional: ['runtime'] }));

    var stream = b.bundle()
        .pipe(source(config.browserify.libOutputName))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'));

    stream.pipe(gulp.dest(config.browserify.dest));

    return stream;
});
