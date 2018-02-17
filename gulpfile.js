var gulp = require("gulp");  
var concat = require("gulp-concat");

gulp.task("build_plugins", function() {  
  var files = [
    'node_modules/querysearch/querysearch.js',
    'node_modules/uuaa/uuaa.js',
    'node_modules/routeful/routeful.js',
    'node_modules/helmeta/helmeta.js',
    'node_modules/firerest/firerest.js',
    'node_modules/spat/spat.js',
    'node_modules/socialink/socialink.js',
  ];
  gulp.src(files)
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('./src'))
    ;
});
