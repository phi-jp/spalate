var gulp = require('gulp');  

gulp.task('copy', function() {  
  var files = [
    'node_modules/routeful/routeful.js',
    'node_modules/spat/spat.js',
  ];
  gulp.src(files)
    .pipe(gulp.dest('./src/assets/plugins'))
    ;
});
