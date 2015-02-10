/* global require, console */
var gulp = require('gulp');
var runSequence = require('run-sequence');
var runKarma = require('./gulphelp.js').runKarma;
var dhis2Config = require('./gulphelp.js').checkForDHIS2ConfigFile();

var dhisDirectory = dhis2Config.dhisDeployDirectory;
var buildDirectory = 'build';

var files = [
    //Vendor dependency files
    'vendor/angular/angular.js',
    'vendor/angular-animate/angular-animate.js',
    'vendor/angular-messages/angular-messages.js',
    'vendor/lodash/dist/lodash.js',
    'vendor/restangular/dist/restangular.js',
    'vendor/notify/notify-service.js',

    //Test specific includes
    'test/fixtures/fixtures.js',
    'test/utils/*.js',
    'test/matchers/*.js',
    'vendor/angular-mocks/angular-mocks.js',

    //Source files
    'vendor/ngBootstrapper/ngBootstrapper.js',
    'src/app/app.js',
    'src/**/*.js',
    'src/**/*.html',

    //Testmocks
    'test/mocks/*_mock.js',

    //Jasmine spec files
    'test/specs/**/*_spec.js'
];

gulp.task('sass', function () {
    var sass = require('gulp-ruby-sass');

    return gulp.src('src/app/app.sass', { base: './src/' })
        .pipe(sass())
        .pipe(gulp.dest(
            ['temp', 'css'].join('/')
        ));
});

gulp.task('clean', function () {
    var del = require('del');
    del(buildDirectory);
});

gulp.task('test', function () {
    return gulp.src(files).pipe(runKarma());
});

gulp.task('watch', function () {
    return gulp.src(files).pipe(runKarma(true));
});

gulp.task('jshint', function () {
    var jshint = require('gulp-jshint');
    return gulp.src([
        'test/specs/**/*.js',
        'src/**/*.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function () {
    var jscs = require('gulp-jscs');
    return gulp.src([
        'test/specs/**/*.js',
        'src/**/*.js'
    ]).pipe(jscs('./.jscsrc'));
});

gulp.task('min', ['sass'], function () {
    var mangleJS = false;

    var useref = require('gulp-useref');
    var gulpif = require('gulp-if');
    var ngAnnotate = require('gulp-ng-annotate');
    var uglify = require('gulp-uglify');
    var minifyCss = require('gulp-minify-css');

    var assets = useref.assets();

    return gulp.src('src/**/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulpif('**/app.js', ngAnnotate({
            add: true,
            remove: true,
            single_quotes: true, //jshint ignore:line
            stats: true
        })))
        .pipe(gulpif('*.js', uglify({
            mangle: mangleJS
        })))
        .pipe(gulp.dest(buildDirectory));
});

gulp.task('i18n', function () {
    return gulp.src('src/i18n/**/*.json', { base: './src/' }).pipe(gulp.dest(
        buildDirectory
    ));
});

gulp.task('manifest', function () {
    return gulp.src('src/**/*.webapp', { base: './src/' }).pipe(gulp.dest(
        buildDirectory
    ));
});

gulp.task('images', function () {
    return gulp.src('src/**/icons/**/*', { base: './src/' }).pipe(gulp.dest(
        buildDirectory
    ));
});

gulp.task('copy-files', function () {
    //TODO: Copy templates
});

gulp.task('copy-fonts', function () {
    return gulp.src(['vendor/font-awesome/fonts/**/*.*'], {base: './vendor/font-awesome/'})
        .pipe(gulp.dest(buildDirectory));
});

gulp.task('build', function (cb) {
    runSequence('clean', 'test', 'i18n', 'manifest', 'images', 'jshint', 'jscs', 'min', 'copy-files', 'copy-fonts', cb);
});

gulp.task('build-prod', function () {
    runSequence('build', 'package', function () {
        console.log();
        console.log([__dirname, 'datim-dedupe.zip'].join('/'));
    });
});

gulp.task('modify-manifest', function () {
    var fs = require('fs');

    fs.readFile('build/manifest.webapp', 'utf8', function (err, data) {
        var manifest;

        if (err) {
            console.log('Failed to load manifest from build directory');
            return;
        }

        manifest = JSON.parse(data);
        if (!(manifest && manifest.activities && manifest.activities.dhis && manifest.activities.dhis.href)) {
            console.log('Incorrect manifest "manifest.activities.dhis.href" is not available');
            return;
        }
        manifest.activities.dhis.href = dhis2Config.dhisBaseUrl || '*';

        fs.writeFile('build/manifest.webapp', JSON.stringify(manifest, undefined, 2), function (err) {
            if (err) {
                console.log('Failed to save modified manifest');
            }
        });
    });
});

gulp.task('copy-app', function () {
    gulp.src('build/**/*.*', { base: './build/' }).pipe(gulp.dest(dhisDirectory));
});

gulp.task('copy-to-dev', function () {
    return runSequence('clean', 'i18n', 'manifest', 'images', 'jshint', 'jscs', 'min', 'copy-files', 'copy-fonts', 'modify-manifest', 'copy-app');
});

gulp.task('package', function () {
    var zip = require('gulp-zip');
    return gulp.src('build/**/*', { base: './build/' })
        .pipe(zip('datim-dedupe.zip', { compress: false }))
        .pipe(gulp.dest('.'));
});

gulp.task('travis', function () {
    return runSequence('test', 'jshint', 'jscs');
});