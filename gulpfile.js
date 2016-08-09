var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var del = require('del');
var sass = require('gulp-ruby-sass');
var exec = require('child_process').exec;

gulp.task('clean-lib', function () {
    return del([
        './www/lib/**/*',
        './www/*.js'
    ])
})

gulp.task('copy-lib', ['clean-lib'], function () {
    gulp.src([
        './node_modules/systemjs/dist/**/*',
        './node_modules/reflect-metadata/**/*',
        './node_modules/zone.js/dist/**/*',
        './node_modules/core-js/client/**/*',
        './node_modules/rxjs/**/*',
        './node_modules/@angular/**/*',
        './node_modules/angular2-in-memory-web-api/**/*',
        './systemjs.config.js'
    ], { base: 'node_modules' })
        .pipe(gulp.dest('./www/lib'))
})

gulp.task('compile-clean', function () {
    return del([
        './www/js/**.*',
        './www/css/**/*',
    ])
})

gulp.task('compile-css', ['compile-clean'], function () {
    return sass('./src/style/**/*.scss')
        .pipe(gulp.dest('./www/css'));
});

gulp.task('compile-js', ['compile-clean'], function () {
    return gulp.src('./src/script/**/*.ts')
        .pipe(ts(tsProject))
        .pipe(gulp.dest('./www/js'));
})

gulp.task('cordova-browser', ['compile'], function (cb) {
    exec('cordova run browser', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
})

gulp.task('reset-lib', ['clean-lib', 'copy-lib']);
gulp.task('compile', ['compile-js', 'compile-css', 'compile-clean']);
gulp.task('run-browser', ['compile', 'cordova-browser']);
