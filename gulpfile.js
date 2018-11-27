var gulp = require('gulp');  

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
    'node_modules/sclazy/sclazy.js',
    'node_modules/vercom/vercom.js',
    'node_modules/flickable/flickable.js',
  ];
  gulp.src(files)
    .pipe(gulp.dest('./src/assets/plugins'))
    ;
});
