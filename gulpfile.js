var gulp        = require('gulp');
var gutil       = require('gulp-util');
var webpack     = require('webpack');
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
    webpack: {
        entry: {
            'react-bootstrap': './lib/index.js'
        },
        output: {
            path: './dist',
            filename: 'bundle.js',
            library: 'ReactBootstrapValidation',
            libraryTarget: 'umd'
        },
        externals: [
            {
                'react': {
                    root: 'React',
                    commonjs2: 'react',
                    commonjs: 'react',
                    amd: 'react'
                }
            },
            {
                'react-bootstrap': {
                    root: 'ReactBootstrap',
                    commonjs2: 'react-bootstrap',
                    commonjs: 'react-bootstrap',
                    amd: 'react-bootstrap'
                }
            }
        ],
        devtool: 'source-map'
    },
    babel: {
    }
};

gulp.task('lib', function () {
    return gulp.src(['src/**/*.js'])
        .pipe(babel(config.babel))
        .pipe(gulp.dest(lib));
});

gulp.task('pack', ['lib'], function(callback) {
    webpack(config.webpack, function(err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }

        gutil.log('[webpack]', stats.toString());

        callback();
    });
});

gulp.task('minimize', ['pack'], function () {
    return gulp.src('dist/bundle.js')
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(gulp.dest(dest))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dest));
});

gulp.task('build', ['minimize']);
gulp.task('default', ['build']);
