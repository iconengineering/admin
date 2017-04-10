var gulp = require('gulp');
var shell = require('gulp-shell');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();


// Task for serving blog with Browsersync
gulp.task('serve', function () {
    browserSync.init({server: {baseDir: ''}});
    // Reloads page when some of the already built files changed:
    gulp.watch('*.*').on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
