var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    sassGlob = require('gulp-sass-glob'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    jshint = require('gulp-jshint'),
    stripCssComments = require('gulp-strip-css-comments'),
    notify = require('gulp-notify');


gulp.task('sass', function() { // Gulp Sass Task
  gulp.src('./scss/**/*.scss')
    .pipe(sourcemaps.init()) // Initializes sourcemaps
    .pipe(sassGlob()) // sass globbing
    .pipe(sass({
      errLogToConsole: true
      }))
    .pipe(autoprefixer('> 5%')) // Support 95% of global browser usage to change see https://github.com/ai/browserslist#queries
    .pipe(stripCssComments())
    .pipe(sourcemaps.write()) // Writes sourcemaps into the CSS file
    .pipe(gulp.dest('./css'))
    .pipe(notify({ message: 'Sass task complete' }));
});

gulp.task('scripts', function() {
  gulp.src('./js/**/*.js')
  .pipe(babel())
  .pipe(jshint('.jshintrc'))
  .pipe(concat('scripts.js'))
  .pipe(jshint.reporter('default'))
  .pipe(gulp.dest('./dist/js'))
  .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('mincss', function() {
  gulp.src('css/styles.css')
  .pipe(cssmin())
  .pipe(gulp.dest('./css'))
  .pipe(notify({ message: 'Min css complete' }));
});

gulp.task('minjs', function() {
  gulp.src('.dist/js/scripts.js')
  .pipe(uglify())
  .pipe(gulp.dest('.dist/js'))
  .pipe(notify({ message: 'Min js complete' }));
});

gulp.task('minify', ['mincss', 'minjs']); // minify css for prod

gulp.task('watch', function() { // Watch
  gulp.watch('./scss/**/*.scss', ['sass']);
  gulp.watch('./js/**/*.js', ['scripts']);
});

gulp.task('default', ['sass', 'scripts', 'watch']);
