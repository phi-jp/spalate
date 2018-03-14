var fs = require('fs-extra');
var path = require('path');
var ejs = require('ejs');
var templatePath = path.join(__dirname, '../../templates');
var template = process.argv[3];
var output = process.argv[4];

console.log('template: ', template);
console.log('output: ', output);
console.log(__dirname);

if (template === 'tag') {
  var file = fs.readFileSync( path.join(templatePath, template), 'utf8' );
  var tagName = path.basename(output).split('.')[0];

  var data = {
    tagName: tagName,
  };
  
  ejs.renderFile(path.join(templatePath, template), data, function(err, html) {
    if (err) {
      console.log(err);
    }
    else {
      fs.outputFileSync(output, html);
    }
  });
}