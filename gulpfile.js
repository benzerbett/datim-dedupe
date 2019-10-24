/* global require, console */
var gulp = require('gulp');
var runKarma = require('./gulphelp.js').runKarma;
var dhis2Config = require('./gulphelp.js').checkForDHIS2ConfigFile();

var dhisDirectory = dhis2Config.dhisDeployDirectory;
var buildDirectory = 'build';

var files = [
    //Vendor dependency files
    'vendor/jquery/dist/jquery.js',
    'vendor/angular/angular.js',
    'vendor/angular-animate/angular-animate.js',
    'vendor/angular-messages/angular-messages.js',
    'vendor/lodash/dist/lodash.js',
    'vendor/restangular/dist/restangular.js',
    'vendor/notify/notify-service.js',
    'vendor/angular-ui-select/dist/select.js',

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
    let sass = require('gulp-sass')
    return gulp.src('src/app/app.sass', { base: './src/' })
        .pipe(sass())
        .pipe(gulp.dest(
            ['temp', 'css'].join('/')
        ));
});

gulp.task('clean', function (done) {
    var del = require('del');
    del(buildDirectory);
    done();
});

gulp.task('test', function () {
    return gulp.src(files).pipe(runKarma());
});

gulp.task('watch', function () {
    return gulp.src(files).pipe(runKarma(true));
});

gulp.task('eslint', function () {
    var eslint = require('gulp-eslint');
    return gulp.src([
        'test/specs/**/*.js',
        'src/**/*.js'
    ])
        .pipe(eslint({fix:true}))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('min', gulp.series('sass', function() {
    var mangleJS = false;

    var useref = require('gulp-useref');
    var gulpif = require('gulp-if');
    var ngAnnotate = require('gulp-ng-annotate');
    var uglify = require('gulp-uglify');
    var minifyCss = require('gulp-minify-css');
    var rev = require('gulp-rev');
    var revReplace = require('gulp-rev-replace');

    var assets = useref.assets();

    return gulp.src('src/**/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulpif('**/*.css', minifyCss()))
        .pipe(gulpif('**/app.js', ngAnnotate({
            add: true,
            remove: true,
            single_quotes: true, //jshint ignore:line
            stats: true
        })))
        .pipe(gulpif('**/*.js', uglify({
            mangle: mangleJS
        })))
        .pipe(gulpif('!**/index.html', rev()))
        .pipe(revReplace())
        .pipe(gulp.dest(buildDirectory));
}));

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

gulp.task('copy-files', function (done) {
    //TODO: Copy templates
    done();
});

gulp.task('copy-fonts', function () {
    return gulp.src([ 'vendor/font-awesome/fonts/**/*.*' ], {base: './vendor/font-awesome/'})
        .pipe(gulp.dest(buildDirectory));
});

gulp.task('package', function () {
    var zip = require('gulp-zip');
    return gulp.src('build/**/*', { base: './build/' })
        .pipe(zip('datim-dedupe.zip', { compress: false }))
        .pipe(gulp.dest('.'));
});

gulp.task('build', gulp.series('clean', 'test', 'i18n', 'eslint', 'min', 'copy-files', 'copy-fonts'));

gulp.task('build-skipTest', gulp.series('clean', 'i18n', 'eslint', 'min', 'copy-files', 'copy-fonts',
        function (done) {
        console.log();
        console.log([__dirname, 'datim-dedupe.zip'].join('/'));
        done();
    }
));

gulp.task('build-prod', gulp.series('build', 'images', 'manifest', 'package',
    function (done) {
        console.log();
        console.log([__dirname, 'datim-dedupe.zip'].join('/'));
        done();
    }
));

gulp.task('build-prod-skipTest', gulp.series('build-skipTest', 'images', 'manifest', 'package',
    function (done) {
        console.log();
        console.log([__dirname, 'datim-dedupe.zip'].join('/'));
        done();
    }
));

gulp.task('modify-manifest', function (done) {
    var fs = require('fs');

    fs.readFile('build/manifest.webapp', 'utf8', function (err, data) {
        var manifest;

        if (err) {
            console.log('Failed to load manifest from build directory', err);
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
    done();
});

gulp.task('copy-app', function () {
    return gulp.src('build/**/*.*', { base: './build/' }).pipe(gulp.dest(dhisDirectory));
});

gulp.task('copy-to-dev', gulp.series('clean', 'i18n', 'manifest', 'images', 'eslint', 'min', 'copy-files', 'copy-fonts', 'modify-manifest', 'copy-app'));

gulp.task('travis', gulp.series('test'));