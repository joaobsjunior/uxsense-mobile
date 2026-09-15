const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');

const paths = {
  sass: ['./scss/**/*.scss'],
  controller: ['./controller/**/*.js'],
  // Third-party AngularJS plugins vendored in www/lib (see bower.json for versions)
  libs: [
    './www/lib/jquery/dist/jquery.min.js',
    './www/lib/angular-translate/dist/angular-translate.min.js',
    './www/lib/angular-input-masks/releases/angular-input-masks-standalone.min.js',
    './www/lib/angular-i18n/angular-locale_pt-br.js'
  ]
};

const tasks = {};
tasks.sass = () => {
  return gulp
    .src(paths.sass)
    .pipe(sass({ loadPaths: ['.'], quietDeps: true, silenceDeprecations: ['import', 'global-builtin', 'slash-div', 'color-functions'] }).on('error', sass.logError))
    .pipe(gulp.dest('./www/css/'))
    .pipe(cleanCss({ level: { 1: { specialComments: 0 } } }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'));
};
tasks.controller = () => {
  return gulp
    .src(paths.controller)
    .pipe(concat('controllers.js'))
    .pipe(gulp.dest('./www/js/'));
};
tasks.lib = () => {
  return gulp
    .src(paths.libs)
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('./www/js/'));
};
tasks.watchSass = () => gulp.watch(paths.sass, tasks.sass);
tasks.watchController = () => gulp.watch(paths.controller, tasks.controller);

/* ------- GULP TASKS ------- */
gulp.task('sass', tasks.sass);
gulp.task('controller', tasks.controller);
gulp.task('lib', tasks.lib);
gulp.task('default', gulp.series('sass', 'controller', 'lib'));
gulp.task('watch-sass', tasks.watchSass);
gulp.task('watch-controller', tasks.watchController);
gulp.task('watch', gulp.series('default', gulp.parallel('watch-sass', 'watch-controller')));
gulp.task('ionic:build:before', gulp.series('default'));
gulp.task('ionic:serve:before', gulp.series('default'));
