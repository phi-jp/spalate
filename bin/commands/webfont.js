var fs      = require('fs-extra');
var path    = require('path');
var webfont = require('webfont').default
var config  = require('config');

// node-glob

var target = path.join(process.cwd(), config.spalate.webfont.target);
var output = path.join(process.cwd(), config.spalate.webfont.output);

async function run() {
  await fs.remove(output)
  await fs.mkdirs(output + '/_temp');
  await fs.copy(target, output + '/_temp');

  webfont({
    files: output + '/_temp/*.svg',
    fontName: 'webfont',
    prependUnicode: true,
    startUnicode: 0xF001,
    template: path.resolve(__dirname, '../font.css'),
    // cssTemplateClassName:'aa',
    // cssTemplateFontName:'bb',
  }).then((result) => {
    fs.writeFileSync(output + '/webfont.ttf', result.ttf )
    console.log(result);
  });  
};

run();


