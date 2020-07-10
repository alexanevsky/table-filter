/*
 * TOC
 *
 * Init
 * - Requires
 * - Variables
 * - Directories and files
 * Tasks
 * - Assets JS
 * - Clean
 * - Watch
 * Default task
 */

// > Init
// >> Requires
var gulp =          require('gulp');
var autoprefixer =  require('gulp-autoprefixer');
var concat =        require('gulp-concat');
var uglify =        require('gulp-uglify');
var rename =        require('gulp-rename');
var rimraf =        require('gulp-rimraf');
var header =        require('gulp-header');

var pkg = require('./package.json');

// >> Variables
var headerString = '/*! <%= pkg.name %> v<%= pkg.version %> (c) <%= pkg.author %> | <%= pkg.homepage %> */\n';

// >> Directories and files
var dist = './dist';

var src = './src/**/jquery.table-filter.js';

// > Tasks
// >> Assets JS
gulp.task('js', function() {
    return gulp.src(src)
        .pipe(gulp.dest(dist))
        .pipe(uglify())
        .pipe(header(headerString, {pkg}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(dist));
});

// >> Clean
gulp.task('clean', function() {
 return gulp.src(dist + '/*', { read: false })
   .pipe(rimraf());
});

// >> Watch
gulp.task('watch', function() {
    gulp.watch(src, gulp.series('js'));
});

// > Default task
gulp.task('default', gulp.series('clean', 'js'));