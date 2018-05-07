var gulp = require('gulp');  
var riot    = require('gulp-riot');
var sort    = require('gulp-sort');
var concat  = require('gulp-concat');

gulp.task('tags', function() {
  var target = ['./src/tags/*.pug', './src/tags/**/*.pug']
  var output = './src/assets/scripts';
  return gulp
    .src(target)
    .pipe(riot({template: 'pug'}))
    .pipe(sort())
    .pipe(concat('tags.js'))
    .pipe(gulp.dest(output))
});

gulp.task('copy', function() {  
  var files = [
    'node_modules/querysearch/querysearch.js',
    'node_modules/uuaa/uuaa.js',
    'node_modules/routeful/routeful.js',
    'node_modules/helmeta/helmeta.js',
    'node_modules/firerest/firerest.js',
    'node_modules/spat/spat.js',
    'node_modules/socialink/socialink.js',
    'node_modules/meltline/meltline.css',
    'node_modules/vercom/vercom.js',
  ];
  gulp.src(files)
    .pipe(gulp.dest('./src/assets/plugins'))
    ;
});
